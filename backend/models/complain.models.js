import mongoose,{Schema} from "mongoose";
import { User } from "./user.models.js";

const complainSchema = new Schema({
    complainId : {
        type : Schema.Types.ObjectId,
        ref : "User"
        
      },
subject : {
    type : String,
    required : true,
    unique : true
},
description : {
    type : String,
    required : true
},
date : {
    type : String,
    required : true
},
isResolved : {
    type : Boolean,
    default : false
},
byHouse : {
    type : Number,
    required : true
},
proof : {
    type : String,
  
},
societyId : {
    type : String,
    
},
isActive : {
   type  : Boolean,
   default : true
},
resolvedDate : {
    type : Date,
    default : null
},
byuser : {
    type : Schema.Types.ObjectId,
    ref : "User"
}

 
},{ timestamps : true})

export const Complain =  mongoose.model("Complain",complainSchema );