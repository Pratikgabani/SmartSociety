import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Notice", noticeSchema);
