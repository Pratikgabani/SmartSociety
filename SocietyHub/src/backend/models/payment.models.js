import mongoose from "mongoose";

// Define the Payment Schema
const paymentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    required: true
  },
  receipt: {
    type: String,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for the Payment schema
export const Payment = mongoose.model('Payment', paymentSchema);




