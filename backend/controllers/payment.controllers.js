import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Payment } from "../models/payment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Purchase } from "../models/purchase.models .js";
import { BookingOrder } from "../models/bookingOrder.models.js";
import { EventOrder } from "../models/eventOrder.model.js";
import { Event } from "../models/event.models.js";
import { RefundRequest } from "../models/refundRequest.models.js";
import { sendRefundProcessedEmail } from "../utils/mailer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// In-memory SSE registry keyed by society. Keeps things simple and avoids a DB round-trip on each webhook event.
const paymentStreams = new Map(); // Map<societyId, Set<res>>

// Broadcasts a payment-related SSE payload to all listeners in a society.
const sendPaymentEvent = (societyId, payload) => {
  const listeners = paymentStreams.get(societyId?.toString());
  if (!listeners || listeners.size === 0) return;
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of listeners) {
    res.write(data);
  }
};

// Opens and manages an SSE stream so clients receive live payment updates.
const paymentStream = asyncHandler(async (req, res) => {
  const societyId = req.user?.societyId?.toString();
  if (!societyId) {
    return res.status(400).json(new ApiResponse(400, null, "Missing society context"));
  }

  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const listeners = paymentStreams.get(societyId) || new Set();
  listeners.add(res);
  paymentStreams.set(societyId, listeners);

  // immediate heartbeat so the client knows we're connected
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  req.on("close", () => {
    listeners.delete(res);
    if (listeners.size === 0) {
      paymentStreams.delete(societyId);
    }
  });
});




// 1. Get all payments (Admin View) with Pagination!
// Returns paginated payment records for the authenticated user's society.
const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ societyId: req.user.societyId })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalDocCount = await Payment.countDocuments({ societyId: req.user.societyId });
    const hasMore = skip + payments.length < totalDocCount;

    // Send back a structured pagination response
    res.status(200).json(
      new ApiResponse(200, { data: payments, hasMore, currentPage: page, total: totalDocCount }, "Payments fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to fetch payments");
  }
};

// 2. Get payments for a specific user
// Returns all payments assigned to a specific user in the same society.
const getUserPayments = async (req, res) => {
  const { userId } = req.params;
  try {
    const payments = await Payment.find({ userId, societyId: req.user.societyId }).lean();
    res.status(200).json(new ApiResponse(200, payments, "User payments fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch user payments");
  }
};

// 3. Create a new payment (Admin can add)
// Creates a new maintenance/payment entry scoped to the current society.
const createPayment = async (req, res) => {
  try {
    const { description, amount, dueDate } = req.body;

    const newPayment = new Payment({
      description,
      amount,
      dueDate: new Date(dueDate),
      societyId: req.user.societyId
    });

    await newPayment.save();
    res.status(201).json(new ApiResponse(201, newPayment, "Payment created successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to create payment");
  }
};

// 4. Mark a payment as paid
//  const markPaymentAsPaid = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const payment = await Payment.findById(id);
//     if (!payment) return res.status(404).json({ error: "Payment not found" });

//     payment.status = "Paid";
//     payment.paidOn = new Date();
//     payment.paymentId = `#${Math.floor(Math.random() * 100000)}`; //todo Generate a random receipt number

//     await payment.save();
//     res.status(200).json(new ApiResponse(200, payment, "Payment marked as paid successfully"));
//   } catch (error) {
//    throw new ApiError(500, "Failed to mark payment as paid");
//   }
// };

// 5. Delete a payment (Admin only)
// Deletes a payment record by id.
const deletePayment = async (req, res) => {
  const { paymentId } = req.params;
  if (!paymentId) return res.status(400).json({ error: "Payment ID is required" });
  try {
    const payment = await Payment.findByIdAndDelete(paymentId);
    if (!payment) return res.status(404).json(new ApiResponse(404, "Payment not found"));

    res.status(200).json(new ApiResponse(200, payment, "Payment deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to delete payment");
  }
};

// 6. Update a payment (Admin only)
// Updates description, amount, and due date for an existing payment.
const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { description, amount, dueDate } = req.body;

  try {
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.description = description;
    payment.amount = amount;
    payment.dueDate = dueDate;

    await payment.save();
    res.status(200).json(new ApiResponse(200, payment, "Payment updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to update payment");
  }
};


// Creates a Stripe PaymentIntent for a maintenance payment after duplicate checks.
const payPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const userId = req.user._id;
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }
  const existingPurchase = await Purchase.findOne({ userId, paymentId });
  if (existingPurchase) {
    // console.log("bas bhai kitna pay krega")
    // toast.error("User has already done payment !");
    return res
      .status(400)
      .json({ errors: "User has already done payment !" });
  }




  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: payment.amount * 100,
      currency: "inr",
      description: `Society Payment: ${payment.description || "Invoice"}`,
      receipt_email: req.user.email || undefined,
      payment_method_types: ["card"],
      metadata: {
        paymentId: paymentId.toString(),
        userId: userId.toString(),
        societyId: req.user.societyId.toString(),
        email: req.user.email || "",
        kind: "maintenance",
      },
    },
    {
      // Idempotency key: same user + same payment always returns the same PaymentIntent
      // Prevents duplicate intents on retries or StrictMode double-calls
      idempotencyKey: `payPayment-${userId}-${paymentId}`,
    }
  );

  if (!paymentIntent) {
    throw new ApiError(500, "Failed to create payment intent");
  }

  // After checking existingPurchase
  // if (!payment.paidBy.includes(userId)) {
  //   payment.paidBy.push(userId);
  // }
  // await payment.save();


  res.status(201).json({
    message: "Payment intent created successfully",
    payment,
    clientSecret: paymentIntent.client_secret,
  });
});

// Retrieves Stripe-hosted receipt URL for a successful intent when available.
const getReceiptUrl = async (paymentIntent) => {
  if (!paymentIntent.latest_charge) return null;
  try {
    const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
    return charge.receipt_url || null;
  } catch (err) {
    console.error("Failed to retrieve charge receipt:", err.message);
    return null;
  }
};

// Finalizes maintenance payment success by updating Payment and creating Purchase.
const handleMaintenanceSuccess = async ({ paymentIntent, metadata, receiptUrl }) => {
  const { paymentId, userId, societyId } = metadata || {};
  if (!paymentId || !userId) return;

  const payment = await Payment.findById(paymentId);
  if (payment && !payment.paidBy.includes(userId)) {
    payment.paidBy.push(userId);
    await payment.save();
  }

  const alreadyProcessed = await Purchase.findOne({ paymentIntentId: paymentIntent.id });
  if (!alreadyProcessed) {
    await Purchase.create({
      userId,
      paymentId,
      societyId,
      paymentIntentId: paymentIntent.id,
      receiptUrl,
    });
  }

  sendPaymentEvent(societyId, {
    type: "payment_intent.succeeded",
    paymentId,
    userId,
  });
};

// Finalizes booking payment success by upserting BookingOrder and receipt data.
const handleBookingSuccess = async ({ paymentIntent, metadata, receiptUrl }) => {
  const { bookingId, userId, societyId, email } = metadata || {};
  if (!bookingId || !userId) return;

  const alreadyProcessed = await BookingOrder.findOne({ paymentIntentId: paymentIntent.id });
  if (!alreadyProcessed) {
    await BookingOrder.create({
      userId,
      bookingId,
      societyId,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: "Paid",  // Normalized to our enum, not Stripe's raw "succeeded"
      paidOn: new Date(),
      email: email || "",
      receiptUrl: receiptUrl || "",
    });
  } else if (receiptUrl && !alreadyProcessed.receiptUrl) {
    alreadyProcessed.receiptUrl = receiptUrl;
    await alreadyProcessed.save();
  }

  sendPaymentEvent(societyId, {
    type: "booking_intent.succeeded",
    bookingId,
    userId,
  });
};

// Finalizes event payment success by upserting EventOrder and attendee readiness.
const handleEventSuccess = async ({ paymentIntent, metadata, receiptUrl }) => {
  const { eventId, userId, societyId, email } = metadata || {};
  if (!eventId || !userId) return;

  const alreadyProcessed = await EventOrder.findOne({ paymentIntentId: paymentIntent.id });
  if (!alreadyProcessed) {
    await EventOrder.create({
      userId,
      eventId,
      societyId,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: "Paid",  // Normalized to our enum, not Stripe's raw "succeeded"
      paidOn: new Date(),
      email: email || "",
      receiptUrl: receiptUrl || "",
    });
  } else if (receiptUrl && !alreadyProcessed.receiptUrl) {
    alreadyProcessed.receiptUrl = receiptUrl;
    await alreadyProcessed.save();
  }

  await Event.findByIdAndUpdate(
    eventId,
    { $addToSet: { readyUsers: userId } },
    { new: true }
  );

  sendPaymentEvent(societyId, {
    type: "event_intent.succeeded",
    eventId,
    userId,
  });
};

// Verifies Stripe webhook signatures and routes events to domain-specific handlers.
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata || {};
      const receiptUrl = await getReceiptUrl(paymentIntent);
      const kind = metadata.kind || "maintenance";

      if (kind === "booking") {
        await handleBookingSuccess({ paymentIntent, metadata, receiptUrl });
      } else if (kind === "event") {
        await handleEventSuccess({ paymentIntent, metadata, receiptUrl });
      } else {
        await handleMaintenanceSuccess({ paymentIntent, metadata, receiptUrl });
      }
      break;
    }

    case "charge.succeeded": {
      const charge = event.data.object;
      const metadata = charge.metadata || {};
      const receiptUrl = charge.receipt_url;
      const kind = metadata.kind || "maintenance";
      const mockPaymentIntent = { id: charge.payment_intent, amount: charge.amount, status: "succeeded" };

      if (kind === "booking") {
        await handleBookingSuccess({ paymentIntent: mockPaymentIntent, metadata, receiptUrl });
      } else if (kind === "event") {
        await handleEventSuccess({ paymentIntent: mockPaymentIntent, metadata, receiptUrl });
      } else {
        await handleMaintenanceSuccess({ paymentIntent: mockPaymentIntent, metadata, receiptUrl });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      console.error("Payment failed:", paymentIntent.last_payment_error?.message);
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object;
      const paymentIntentId = charge.payment_intent;
      
      // Ensure the orders reflect the final refunded state
      const bOrder = await BookingOrder.findOneAndUpdate(
          { paymentIntentId },
          { status: 'Refunded' }
      );
      
      const eOrder = await EventOrder.findOneAndUpdate(
          { paymentIntentId },
          { status: 'Refunded' }
      );

      if (eOrder?.eventId && eOrder?.userId) {
        const updatedEvent = await Event.findByIdAndUpdate(
          eOrder.eventId,
          { $pull: { readyUsers: eOrder.userId } },
          { new: true }
        );

        if (updatedEvent) {
          updatedEvent.totalHouseReady = updatedEvent.readyUsers.length;
          await updatedEvent.save();
        }
      }
      
      const reqRecord = await RefundRequest.findOne({ paymentIntentId });
      if (reqRecord && reqRecord.status === 'Approved') {
        reqRecord.status = 'Refunded';
        await reqRecord.save();
      }

      console.log(`[Webhook] charge.refunded for PI: ${paymentIntentId}. bOrder found: ${!!bOrder}, eOrder found: ${!!eOrder}`);

      const order = bOrder || eOrder;
      if (order && order.email) {
          console.log(`[Webhook] Sending refund email using order.email: ${order.email}`);
          const type = bOrder ? 'Venue Booking' : 'Event Registration';
          sendRefundProcessedEmail(order.email, order.amount, type, paymentIntentId).catch(console.error);
      } else if (order) {
          // Fallback if email wasn't directly saved on the order document
          console.log(`[Webhook] order.email is empty, populating userId...`);
          await order.populate('userId');
          if (order.userId && order.userId.email) {
            console.log(`[Webhook] Sending refund email using populated userId.email: ${order.userId.email}`);
            const type = bOrder ? 'Venue Booking' : 'Event Registration';
            sendRefundProcessedEmail(order.userId.email, order.amount, type, paymentIntentId).catch(console.error);
          } else {
             console.log(`[Webhook] Could not find email even after populating userId.`);
          }
      } else {
          console.log(`[Webhook] No matching BookingOrder or EventOrder found for this refund. Email aborted.`);
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// Returns admin-facing payment data with payer details for the current society.
const getAdminData = async (req, res) => {
  try {
    const payments = await Payment.find({ societyId: req.user.societyId }).populate("paidBy", "name phoneNo houseNo block -_id").select(" -updatedAt -__v -societyId -_id").lean();

    res.status(200).json(new ApiResponse(200, payments, "Payments fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch payments");
  }
};

export { getPayments, getUserPayments, createPayment, deletePayment, updatePayment, getAdminData, payPayment, stripeWebhook, paymentStream };