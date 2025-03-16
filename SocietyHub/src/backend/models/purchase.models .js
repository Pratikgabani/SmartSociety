import mongoose, { Schema } from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  paymentId : {
    type : Schema.Types.ObjectId,
    ref : "Payment",
  }
});

export const Purchase = mongoose.model('Purchase', purchaseSchema);
