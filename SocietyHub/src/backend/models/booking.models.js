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
    default: "00:00:00",
    required : true
  },
  date: {
    type: Date,
    required: true
  }, 
  // isAccepted: {
  //   type: Boolean,
  //   default: false
  // } ,
  // Not keeping it because assuming that there will be a automatic booking acceptance if a venue is available at a particular date otherwise it will be rejected
  societyId : {
    type : String,
    required : true
  }
}, {
  timestamps: true
});
  
export const Booking = mongoose.model("Booking", bookingSchema);
