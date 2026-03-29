import mongoose from 'mongoose';
const eventOrderSchema = new mongoose.Schema({
  email: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  paymentIntentId: String,
  amount: Number,
  status: String,
  paidOn: Date,
  societyId: String,
  receiptUrl: String
});

export const EventOrder = mongoose.model('EventOrder', eventOrderSchema);