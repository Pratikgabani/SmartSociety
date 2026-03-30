import Notice from "../models/notice.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { sendNoticeCreatedEmail } from "../utils/mailer.js";

// Get all notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ societyId : req.user.societyId, isActive : true}).sort({ Date: -1 }).select("-societyId -__v ");
    res.status(200).json(new ApiResponse(200, notices, "Notices found successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching notices", error);
  }
};

export const getAllNotices = async (req, res) => {
 try {
    const response = await Notice.find({societyId : req.user.societyId , isActive : false}).sort({ Date: -1 }).select("-_id -societyId -isActive -__v ");
    res.status(200).json(new ApiResponse(200, response, "Notices found successfully"));
 } catch (error) {
    throw new ApiError(500, "Error fetching notices", error);
 } 
}

// Add a new notice
export const addNotice = async (req, res) => {
  const { topic, description } = req.body;

  if (!topic || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const notice = new Notice({ topic, description, societyId : req.user.societyId });
    await notice.save();

    const societyMembers = await User.find({
      societyId: req.user.societyId,
      role: { $in: ["user", "admin"] },
      email: { $exists: true, $ne: "" },
    }).select("email");

    const memberEmails = [...new Set(societyMembers.map((member) => member.email).filter(Boolean))];

    // Fire-and-forget email dispatch so notice creation is not blocked by SMTP latency.
    if (memberEmails.length > 0) {
      sendNoticeCreatedEmail(
        memberEmails,
        notice.topic,
        notice.description,
        notice.Date,
        req.user?.name || "Society Admin"
      ).catch((mailErr) => {
        console.error("Failed to send notice email:", mailErr);
      });
    }

    res.status(201).json(new ApiResponse(201, notice, "Notice added successfully"));
  } catch (error) {
    throw new ApiError(500, "Error adding notice", error);
  }
};

// Delete a notice
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
   const response = await Notice.findById(id);
    response.isActive = false;
    await response.save();

    res.status(200).json(new ApiResponse(200, response, "Notice deleted successfully"));
  } catch (error) {
    return res.status(500).json({ message: "Error deleting notice", error });
  }
};
