import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
import { Security } from "../models/security.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
      // console.log("Verifying JWT...");
      // console.log("Request cookies:", req.cookies);
      // console.log("Request headers:", req.headers);
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
      // console.log("Received token:", token);
  
      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }
  
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // console.log("Decoded token:", decodedToken);
  
      // Check both User and Security collections
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken") 
                || await Security.findById(decodedToken?._id).select("-password -refreshToken");
  
      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }
  
      req.user = user;
      next();
    } catch (error) {
      // console.error('Token verification error:', error.message);
      throw new ApiError(401, error.message || "Invalid access token");
    }
  });
  