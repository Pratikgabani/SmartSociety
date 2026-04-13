import mongoose, { Schema } from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  paymentId : {
    type : Schema.Types.ObjectId,
    ref : "Payment",
  },
  societyId : {
    type : String,
    required : true
  },
  paymentIntentId  : {
    type: String,
    unique: true,
    sparse: true  // allows multiple null values (e.g. purchases not via Stripe)
  },
  receiptUrl : {
    type: String
  },
  paidOn : {
    type : Date,
    default : Date.now
  }

}, { timestamps: true });

export const Purchase = mongoose.model('Purchase', purchaseSchema);
