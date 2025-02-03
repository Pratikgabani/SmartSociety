import mongoose, { Schema } from "mongoose";

const visitorSchema = new Schema({
   
    visitorName: {
        type: String,
        required: true,
    },
    
    visitorPhone: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    visitingAdd : {
        type : String,
        required : true
    },
    visitDate : {
        type : Date,
        required : true
    },
    visitTime : {
        type : String,
        required : true
    },
    isActive : {
        type : String,
        default : true
    }

    
},{timestamps : true});

export const Visitor = mongoose.model("Visitor", visitorSchema);