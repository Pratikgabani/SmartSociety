import Stripe from 'stripe';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { EventOrder } from '../models/eventOrder.model.js';
import { BookingOrder } from '../models/bookingOrder.models.js';
import { Event } from '../models/event.models.js';
import { RefundRequest } from '../models/refundRequest.models.js';
import { User } from '../models/user.models.js';
import { sendRefundReviewEmail } from '../utils/mailer.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Removes a user from an event's ready list and re-syncs participant count.
const removeUserFromEventReadyList = async (eventId, userId) => {
    if (!eventId || !userId) return;

    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $pull: { readyUsers: userId } },
        { new: true }
    );

    if (updatedEvent) {
        updatedEvent.totalHouseReady = updatedEvent.readyUsers.length;
        await updatedEvent.save();
    }
};

// POST /api/v1/payments/:id/refund
// Creates a refund request or triggers instant Stripe refund based on 24-hour policy.
const requestRefund = asyncHandler(async (req, res) => {
    const { id } = req.params; // orderId
    const { reason, orderType } = req.body; // 'EventOrder' or 'BookingOrder'
    
    if (!reason || !orderType) {
        throw new ApiError(400, "Reason and orderType are required");
    }

    if (!['EventOrder', 'BookingOrder'].includes(orderType)) {
        throw new ApiError(400, "Refunds only applicable to Events and Bookings");
    }

    let OrderModel = orderType === 'EventOrder' ? EventOrder : BookingOrder;
    const order = await OrderModel.findById(id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to refund this order");
    }

    if (order.status === 'Refund Initiated' || order.status === 'Refunded') {
        throw new ApiError(400, "Refund already processed or initiated");
    }

    const existingRequest = await RefundRequest.findOne({ orderId: id });
    if (existingRequest) {
        throw new ApiError(400, "A refund request already exists for this order");
    }

    // Checking if 24 hours have passed since payment
    // Fallbacks just in case paidOn is somehow undefined on legacy records
    const paymentTime = new Date(order.paidOn || order.createdAt || Date.now()).getTime();
    const currentTime = Date.now();
    const hoursElapsed = (currentTime - paymentTime) / (1000 * 60 * 60);

    if (hoursElapsed <= 24) {
        // Less than 24 hours -> automated refund
        try {
            await stripe.refunds.create({
                payment_intent: order.paymentIntentId,
            });
            // Update order status temporarily (will be finalized by webhook)
            order.status = 'Refund Initiated';
            await order.save();

            // If an event refund is initiated, remove the user from attendee list immediately.
            if (orderType === 'EventOrder') {
                await removeUserFromEventReadyList(order.eventId, order.userId);
            }
            
            return res.status(200).json(new ApiResponse(200, {}, "Refund initiated automatically."));
        } catch (error) {
            throw new ApiError(500, `Stripe refund failed: ${error.message}`);
        }
    } else {
        // More than 24 hours -> manual review
        const refundReq = await RefundRequest.create({
            user: req.user._id,
            orderId: id,
            orderType,
            paymentIntentId: order.paymentIntentId,
            amount: order.amount,
            reason,
        });

        // Send email to admins
        const admins = await User.find({ 
            role: 'admin', 
            societyId: req.user.societyId,
            _id: { $ne: req.user._id }
        }).select('email');
        if (admins.length > 0) {
            const adminEmails = admins.map(a => a.email);
            // Non-blocking fire and forget email
            sendRefundReviewEmail(adminEmails, req.user.email, reason, order.amount, orderType, order.paymentIntentId)
                .catch(err => console.error("Failed to send refund review email:", err));
        }

        return res.status(201).json(new ApiResponse(201, refundReq, "Refund request submitted for admin review."));
    }
});

// GET /api/v1/admin/refunds
// Returns pending refund requests filtered to the admin's society.
const getPendingRefunds = asyncHandler(async (req, res) => {
    // Admins only
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Admin access required");
    }
    
    // Populate user to get name/email/block/houseNo
    const requests = await RefundRequest.find({ status: 'Pending' })
        .populate('user', 'name email societyId block houseNo')
        .sort({ createdAt: -1 });
        
    // Filter to only this society's admins, excluding the admin's own requests
    const societyRequests = requests.filter(r => 
        r.user && 
        r.user.societyId === req.user.societyId && 
        r.user._id.toString() !== req.user._id.toString()
    );

    return res.status(200).json(new ApiResponse(200, societyRequests, "Pending refund requests fetched"));
});

// POST /api/v1/admin/refunds/:id/approve
// Approves a pending refund, initiates Stripe refund, and marks order as refund initiated.
const approveRefund = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Admin access required");
    }

    const { id } = req.params;
    const refundReq = await RefundRequest.findById(id).populate('user', 'societyId');

    if (!refundReq) throw new ApiError(404, "Refund request not found");
    if (refundReq.status !== 'Pending') throw new ApiError(400, "Request is not pending. Current status: " + refundReq.status);
    if (refundReq.user.societyId !== req.user.societyId) throw new ApiError(403, "Not authorized for this society");
    if (refundReq.user._id.toString() === req.user._id.toString()) throw new ApiError(403, "You cannot approve your own refund request");

    // Initiate stripe refund
    try {
        await stripe.refunds.create({
            payment_intent: refundReq.paymentIntentId,
        });
        
        refundReq.status = 'Approved';
        await refundReq.save();

        let OrderModel = refundReq.orderType === 'EventOrder' ? EventOrder : BookingOrder;
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            refundReq.orderId,
            { status: 'Refund Initiated' },
            { new: true }
        );

        if (refundReq.orderType === 'EventOrder' && updatedOrder) {
            await removeUserFromEventReadyList(updatedOrder.eventId, updatedOrder.userId);
        }

        return res.status(200).json(new ApiResponse(200, refundReq, "Refund approved and initiated successfully."));
    } catch (error) {
        throw new ApiError(500, `Stripe refund failed: ${error.message}`);
    }
});

// POST /api/v1/admin/refunds/:id/reject
// Rejects a pending refund request with optional admin notes.
const rejectRefund = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Admin access required");
    }

    const { id } = req.params;
    const { adminNotes } = req.body;
    
    const refundReq = await RefundRequest.findById(id).populate('user', 'societyId');

    if (!refundReq) throw new ApiError(404, "Refund request not found");
    if (refundReq.status !== 'Pending') throw new ApiError(400, "Request is not pending. Current status: " + refundReq.status);
    if (refundReq.user.societyId !== req.user.societyId) throw new ApiError(403, "Not authorized for this society");
    if (refundReq.user._id.toString() === req.user._id.toString()) throw new ApiError(403, "You cannot reject your own refund request");

    refundReq.status = 'Rejected';
    if (adminNotes) refundReq.adminNotes = adminNotes;
    await refundReq.save();

    return res.status(200).json(new ApiResponse(200, refundReq, "Refund request rejected."));
});

export {
    requestRefund,
    getPendingRefunds,
    approveRefund,
    rejectRefund
};
