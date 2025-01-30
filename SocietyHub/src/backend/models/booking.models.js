import mongoose,{Schema} from "mongoose";
import { User } from "./user.models.js"; 

const bookingSchema = new Schema({
    bookingOwner : {
      type : Schema.Types.ObjectId,
      ref : "User"
      
    },
  bookingType : {
    type : String,
    required : true,
    unique : true
  },
  bookDescription : {
    type : String,
    required : true
  },
  noOfPersons : {
   type : Number,
   required : true  
},
duration : {
  type : String,
  required : true
},
date : {
  type : String,
  required : true,
  unique : true
},
bookingPrice : {
  type : Number,
  
},
isAccepted : {
  type : Boolean,
  default : false
}
 

  
},{
    timestamps: true
});

export const Booking =  mongoose.model("Booking", bookingSchema);