import mongoose, { Schema } from "mongoose";
const bookingSchema = new Schema({
  bookingOwner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  bookingType: {
    type : String,
    required : true,
    // sparse : true
  },
  bookDescription: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isAccepted: {
    type: Boolean,
    default: false
  } 
}, {
  timestamps: true
});
  
// Compound unique index to prevent duplicate bookings for the same venue on the same date
// bookingSchema.index({ bookingType: 1, date: 1 } , { unique: true });

export const Booking = mongoose.model("Booking", bookingSchema);
