import mongoose from 'mongoose';
const bookingOrderSchema = new mongoose.Schema({
  email: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  paymentDoneId: String,
  amount: Number,
  status: String,
  paidOn: Date,
  societyId: String
});

export const BookingOrder = mongoose.model('BookingOrder', bookingOrderSchema);