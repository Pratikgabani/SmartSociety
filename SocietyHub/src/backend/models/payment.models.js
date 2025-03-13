import { SourceCode } from "eslint";
import {mongoose, Schema} from "mongoose";

// Define the Payment Schema
const paymentSchema = new mongoose.Schema({
  societyId : {
    type : String,
    required : true
  },
  amount : {
    type : Number,
    required : true
  },
  paidBy : [{
    type : Schema.Types.ObjectId,
    ref : "User"
  }],
  dueDate : {
    type : Date,
    required : true
  },
  paidOn : {
    type : Date,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  paymentId: {
    type: String,
    required: true
  },
  status : {
    type : String,
    required : true,
    default : "Pending"
  }

});
// Create a model for the Payment schema
export const Payment = mongoose.model('Payment', paymentSchema);




