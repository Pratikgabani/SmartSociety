import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: String,
  userId: String,
  paymentIntentId: String,
  amount: Number,
  status: String,
  paymentId: String,
  paidOn : Date,
  
  societyId : String
});

export const Order = mongoose.model("Order", orderSchema);