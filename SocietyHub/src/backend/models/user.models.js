import mongoose from "mongoose";
import { Schema } from "mongoose";
const userSchema = new Schema({
  block: {
    type: String,
    required: true,
  },
  houseNo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  societyId : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
 
  nameOfPersons: [
    {
        type : String,
        required : true
    }
  ],
  phoneNo : [
    {
        type : String,
        required : true
    }
  ],
  numberOfVeh : {
    type : Number,
    required : true
  },
  vehicleNo : [
    {
        type : String,
        required : true
    }
  ]
});

export default mongoose.model("User", userSchema);