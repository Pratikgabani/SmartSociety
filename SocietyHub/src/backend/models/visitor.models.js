import mongoose, { Schema } from "mongoose";

const visitorSchema = new Schema({
   
    visitorName: {
        type: String,
        required: true,
    },
    
    visitorPhone: {
        type: Number,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    visitingBlock : {
        type : String,
        required : true
    },
    visitingAdd : {
        type : Number,
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
 
    duration : {
        type : String,
        default : "00:00:00",
        required : true
    },
    isActive : {
        type : String,
        default : true
    },
    societyId : {
        type : String,
        
    }

    
},{timestamps : true});

export const Visitor = mongoose.model("Visitor", visitorSchema);