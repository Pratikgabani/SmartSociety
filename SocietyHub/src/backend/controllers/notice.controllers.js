import Notice from "../models/notice.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get all notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ societyId : req.user.societyId}).sort({ timestamp: -1 }).select("-societyId -__v -_id");
    res.status(200).json(new ApiResponse(200, notices, "Notices found successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching notices", error);
  }
};

// Add a new notice
export const addNotice = async (req, res) => {
  const { topic, description } = req.body;

  if (!topic || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const notice = new Notice({ topic, description, societyId : req.user.societyId });
    await notice.save();
    res.status(201).json(new ApiResponse(201, notice, "Notice added successfully"));
  } catch (error) {
    throw new ApiError(500, "Error adding notice", error);
  }
};

// Delete a notice
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    res.status(200).json(new ApiResponse(200, null, "Notice deleted successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Error deleting notice", error });
  }
};
