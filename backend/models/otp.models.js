import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    pendingData: {
        type: Object, // Stores registration fields (name, password, etc.)
        required: true,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // TTL index: Automatically deletes document after 5 minutes (300 seconds)
    },
});


export const OTP = mongoose.model("OTP", otpSchema);
