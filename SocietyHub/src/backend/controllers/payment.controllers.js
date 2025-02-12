import { Payment } from "../models/payment.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// 1. Get all payments (Admin View)
 const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
    res.status(200).json(new ApiResponse(200, payments, "Payments fetched successfully"));
  } catch (error) {
   throw new ApiError(500, "Failed to fetch payments");
  }
};

// 2. Get payments for a specific user
 const getUserPayments = async (req, res) => {
  const { userId } = req.params;
  try {
    const payments = await Payment.find({ userId });
    res.status(200).json(new ApiResponse(200, payments, "User payments fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch user payments");
  }
};

// 3. Create a new payment (Admin can add)
 const createPayment = async (req, res) => {
  try {
    const { description, amount, dueDate} = req.body;

    const newPayment = new Payment({
      description,
      amount,
      dueDate,
      userId : req.user._id,
    });

    await newPayment.save();
    res.status(201).json(new  ApiResponse(201, newPayment, "Payment created successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to create payment");
  }
};

// 4. Mark a payment as paid
 const markPaymentAsPaid = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.status = "Paid";
    payment.paymentDate = new Date();
    payment.receipt = `#${Math.floor(Math.random() * 100000)}`; // Generate a random receipt number

    await payment.save();
    res.status(200).json(new ApiResponse(200, payment, "Payment marked as paid successfully"));
  } catch (error) {
   throw new ApiError(500, "Failed to mark payment as paid");
  }
};

// 5. Delete a payment (Admin only)
 const deletePayment = async (req, res) => {
  const { paymentId} = req.params;
if(!paymentId) return res.status(400).json({ error: "Payment ID is required" });
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

export { getPayments, getUserPayments, createPayment, markPaymentAsPaid, deletePayment, updatePayment };