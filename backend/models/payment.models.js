import { SourceCode } from "eslint";
import mongoose, { Schema } from "mongoose";


const paymentSchema = new mongoose.Schema({
  societyId : {
    type : String,
    // required : true
  },
  
   amount : {
    type : Number,
    required : true
  },

  description : {
    type : String,
    required : true
  },
  
  dueDate : {
    type : Date,
    required : true
  },

  paidBy : [{
    type :Schema.Types.ObjectId,
    ref : "User",
  }],
   

 

});

export const Payment = mongoose.model('Payment', paymentSchema);