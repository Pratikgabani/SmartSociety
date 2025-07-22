import mongoose, { Schema } from "mongoose";

const societyDetailSchema = new Schema({
    societyId : {
        type : String,
        required : true,
        unique : true,
    },
    societyName : {
        type : String,
        required : true
    },
    societyAddress : {
        type : String,
        required : true
    },
    adminPass : {
        type : String,
        required : true,
        unique : true,
        minLength : 6
    },
    securityPass : {
        type : String,
        required : true,
        unique : true,
        minLength : 6
    }
})


export const SocietyDetail = mongoose.model("SocietyDetail" , societyDetailSchema)