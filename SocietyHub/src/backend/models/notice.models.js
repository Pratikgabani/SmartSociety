import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  Date: { type: Date, default: Date.now },
  societyId : {
    type : String,
  },
  isActive : {
    type : Boolean,
    default : true
  }
});

export default mongoose.model("Notice", noticeSchema);
