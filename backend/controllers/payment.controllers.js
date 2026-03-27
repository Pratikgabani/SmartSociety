import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Payment } from "../models/payment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Purchase } from "../models/purchase.models .js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// In-memory SSE registry keyed by society. Keeps things simple and avoids a DB round-trip on each webhook event.
const paymentStreams = new Map(); // Map<societyId, Set<res>>

const sendPaymentEvent = (societyId, payload) => {
  const listeners = paymentStreams.get(societyId?.toString());
  if (!listeners || listeners.size === 0) return;
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of listeners) {
    res.write(data);
  }
};

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




// 1. Get all payments (Admin View)
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ societyId: req.user.societyId, });
    res.status(200).json(new ApiResponse(200, payments, "Payments fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch payments");
  }
};

// 2. Get payments for a specific user
const getUserPayments = async (req, res) => {
  const { userId } = req.params;
  try {
    const payments = await Payment.find({ userId, societyId: req.user.societyId });
    res.status(200).json(new ApiResponse(200, payments, "User payments fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch user payments");
  }
};

// 3. Create a new payment (Admin can add)
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
      payment_method_types: ["card"],
      metadata: {
        paymentId: paymentId.toString(),
        userId: userId.toString(),
        societyId: req.user.societyId.toString(),
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

const stripeWebhook = asyncHandler(async(req , res)=>{
  const sig = req.headers['stripe-signature'];
  let event;
  try{
    event = stripe.webhooks.constructEvent(
      req.body , 
      sig , 
      process.env.STRIPE_WEBHOOK_SECRET
      
    );
  }catch(err){
    console.log("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

    // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object; // full snapshot here
      const { paymentId, userId, societyId } = paymentIntent.metadata;

      // Retrieve receipt URL from the charge
      let receiptUrl = null;
      try {
        if (paymentIntent.latest_charge) {
          const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
          receiptUrl = charge.receipt_url;
        }
      } catch (chargeErr) {
        console.error("Failed to retrieve charge receipt:", chargeErr.message);
      }

      const payment = await Payment.findById(paymentId);
      if (payment && !payment.paidBy.includes(userId)) {
        payment.paidBy.push(userId);
        await payment.save();
      }

      // Idempotency guard: Stripe retries webhooks — only create Purchase once per PaymentIntent
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

      // Notify connected clients in this society that payments changed
      sendPaymentEvent(societyId, {
        type: "payment_intent.succeeded",
        paymentId,
        userId,
      });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      console.error("Payment failed:", paymentIntent.last_payment_error?.message);
      // optionally notify user
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
    }
    
      res.status(200).json({ received: true });

})

const getAdminData = async (req, res) => {
  try {
    const payments = await Payment.find({ societyId: req.user.societyId }).populate("paidBy", "name phoneNo houseNo block -_id").select(" -updatedAt -__v -societyId -_id");

    res.status(200).json(new ApiResponse(200, payments, "Payments fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch payments");
  }
};

export { getPayments, getUserPayments, createPayment, deletePayment, updatePayment, getAdminData, payPayment, stripeWebhook, paymentStream };