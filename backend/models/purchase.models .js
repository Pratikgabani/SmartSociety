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
  paymentDoneId  : {
    type: String
  },
  paidOn : {
    type : Date,
    default : Date.now()
  }

});

export const Purchase = mongoose.model('Purchase', purchaseSchema);
