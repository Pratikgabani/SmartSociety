import mongoose from 'mongoose';
const bookingOrderSchema = new mongoose.Schema({
  email: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    index: true
  },
  paymentIntentId: { type: String, unique: true, sparse: true },
  amount: Number,
  status: {
    type: String,
    enum: ["Paid", "succeeded", "Refund Initiated", "Refund_Pending_Approval", "Refunded"],
    default: "Paid"
  },
  paidOn: Date,
  societyId: String,
  receiptUrl: String
}, { timestamps: true });

export const BookingOrder = mongoose.model('BookingOrder', bookingOrderSchema);