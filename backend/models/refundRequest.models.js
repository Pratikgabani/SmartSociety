import mongoose from 'mongoose';

const refundRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Ref can be dynamic between EventOrder or BookingOrder
    },
    orderType: {
      type: String,
      enum: ['EventOrder', 'BookingOrder'],
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Refunded'],
      default: 'Pending',
      index: true
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const RefundRequest = mongoose.model('RefundRequest', refundRequestSchema);
