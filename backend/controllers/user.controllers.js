import bcrypt from 'bcrypt';
import { User } from '../models/user.models.js'; // Adjust the import path
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { SocietyDetail } from '../models/societyDetail.models.js';
import { Security } from '../models/security.models.js';
import { Visitor } from '../models/visitor.models.js';
import { OTP } from '../models/otp.models.js';

import axios from 'axios';
import { sendOtpEmail, sendResetPasswordEmail } from '../utils/mailer.js';

import { oauth2Client } from '../utils/googleConfig.js';

// ─── OTP Store moved to MongoDB (OTP Model with TTL index) ───────────────────




const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId) || await Security.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }


  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id) || await Security.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used")

    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})

const registerUser = asyncHandler(async (req, res) => {
  const {
    block,
    houseNo,
    password,
    societyId,
    email,
    name,
    role,
    rolePass,
    phoneNo,
    phoneNo2
  } = req.body;

  if (!block || !houseNo || !password || !societyId || !email || !name || !role || !phoneNo) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if society exists
  const existingSociety = await SocietyDetail.findOne({ societyId });
  if (!existingSociety) {
    throw new ApiError(400, "Society not found");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Check if house number is unique within the society
  const existingHouse = await User.findOne({ societyId, houseNo, block });
  if (existingHouse) {
    return res.status(400).json({
      message: 'House number already registered in this society'
    });
  }

  // check if role is "admin" or "security" and then check if rolePass is provided and matching with rolePass in database
  if (role === "admin") {
    if (!rolePass) {
      throw new ApiError(400, "Role pass is required");
    }

    const existingRolePass = await SocietyDetail.findOne({ adminPass: rolePass });
    if (!existingRolePass) {
      throw new ApiError(400, "Invalid role pass");
    }

  }

  // Hash password
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = await User.create({
    block,
    houseNo,
    password,
    societyId,
    email,
    name,
    role,
    rolePass,
    phoneNo,
    phoneNo2
  });

  const userResponse = await User.findById(newUser._id).select(
    // selecting the fields that we want to show in the response
    "-password -refreshToken " // This will select all the fields other than password and refreshToken
  )

  if (!userResponse) {
    throw new ApiError(400, "User registration failed")
  }

  return res.status(201).json(
    new ApiResponse(200, userResponse, "User registered Successfully")
  )
})

const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  // const security = await Security.findOne({email});
  // if(security){
  //   throw new ApiError(400 , "Security already registered")
  // }

  const user = await User.findOne({ email }) || await Security.findOne({ email })
  if (!user) {
    throw new ApiError(400, "User not found")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  // console.log(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password")
  }

  // const isMatch = await bcrypt.compare(password, user.password);
  // if(!isMatch){
  //   throw new ApiError(400, "Invalid credentials")
  // }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken") || await Security.findById(user._id).select("-password -refreshToken")
  if (!loggedInUser) {
    throw new ApiError(500, "Failed to login")
  }

  const options = {
    httpOnly: true,//This means that the cookie cannot be accessed by client-side scripts.
    //secure : process.env.NODE_ENV === "production" ,// This means that the cookie will only be sent over HTTPS in production environments.
    secure: true,
    sameSite: "none" // updated this line
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User Logged in successfully")
    )
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null, // made it undefined to null 
      }
    },
    { new: true }
  ) || await Security.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null, // made it undefined to null 
      }
    },
    { new: true }
  )



  // const options = {
  //   httpOnly : true , 
  //   secure : true , 
  //   path : "/" // This ensures the cookie is cleared for all paths
  // }
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const getUserDetail = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User found successfully"))
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required")
  }

  const user = await User.findById(req.user?._id)

  const isPasswordValid = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword

  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))

})

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { phoneNo, phoneNo2 } = req.body

  if (!phoneNo) {
    throw new ApiError(400, "Phone number is required")
  }

  const updateFields = { phoneNo };
  if (phoneNo2 !== undefined) {
    updateFields.phoneNo2 = phoneNo2;
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateFields },
    { new: true }
  ).select("-password -refreshToken")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const googleAuth = asyncHandler(async (req, res) => { // 6
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const { data: { email } } = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
  );

  // ✅ Check if user exists (was already registered manually)
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not registered. Please register manually first.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none" // updated this line
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "Google Login successful"));
});

// ─── Send OTP ─────────────────────────────────────────────────────────────────
const sendOtp = asyncHandler(async (req, res) => {
  const {
    block,
    houseNo,
    password,
    societyId,
    email,
    name,
    role,
    rolePass,
    phoneNo,
    phoneNo2,
  } = req.body;

  // Basic field validation
  if (!block || !houseNo || !password || !societyId || !email || !name || !role || !phoneNo) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Check society exists
  const existingSociety = await SocietyDetail.findOne({ societyId });
  if (!existingSociety) {
    throw new ApiError(404, "Society not found");
  }

  // Check duplicate email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Check duplicate house in society
  const existingHouse = await User.findOne({ societyId, houseNo, block });
  if (existingHouse) {
    throw new ApiError(400, "House number already registered in this society");
  }

  // Validate admin role pass
  if (role === "admin") {
    if (!rolePass) throw new ApiError(400, "Role pass is required for admin");
    const validRolePass = await SocietyDetail.findOne({ adminPass: rolePass });
    if (!validRolePass) throw new ApiError(400, "Invalid role pass");
  }

  // COOLDOWN CHECK: If an OTP exists and was created less than 30s ago
  const existingOtpDoc = await OTP.findOne({ email });
  if (existingOtpDoc) {
    const timeSinceLastOtp = (Date.now() - new Date(existingOtpDoc.createdAt).getTime()) / 1000;
    if (timeSinceLastOtp < 30) {
      throw new ApiError(429, `Please wait ${Math.ceil(30 - timeSinceLastOtp)} seconds before requesting a new OTP`);
    }
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Upsert OTP with pending data in DB
  // This overwrites any previous OTP for this email
  await OTP.findOneAndUpdate(
    { email },
    {
      otp,
      pendingData: { block, houseNo, password, societyId, email, name, role, rolePass, phoneNo, phoneNo2 },
      attempts: 0,
      isVerified: false,
      createdAt: Date.now() // resets the TTL timer
    },
    { upsert: true, new: true }
  );

  // Send OTP email
  await sendOtpEmail(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent to your email. Valid for 5 minutes."));
});

// ─── Resend OTP ───────────────────────────────────────────────────────────────
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const existingOtpDoc = await OTP.findOne({ email });
  if (!existingOtpDoc) {
    throw new ApiError(400, "No active registration process found. Please register again.");
  }

  // Cooldown check
  const timeSinceLastOtp = (Date.now() - new Date(existingOtpDoc.createdAt).getTime()) / 1000;
  if (timeSinceLastOtp < 30) {
    throw new ApiError(429, `Wait ${Math.ceil(30 - timeSinceLastOtp)}s before resending.`);
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

  existingOtpDoc.otp = newOtp;
  existingOtpDoc.createdAt = Date.now();
  existingOtpDoc.attempts = 0; // Reset attempts on resend
  await existingOtpDoc.save();

  await sendOtpEmail(email, newOtp);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP resent successfully."));
});

// ─── Verify OTP ──────────────────────────────────────────────────────────────
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const otpDoc = await OTP.findOne({ email });

  if (!otpDoc) {
    throw new ApiError(404, "OTP expired or not found. Request a new one.");
  }

  if (otpDoc.attempts >= 3) {
    await OTP.deleteOne({ email });
    throw new ApiError(400, "Max attempts exceeded. Please request a new OTP.");
  }

  if (otpDoc.otp !== otp.trim()) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    throw new ApiError(400, `Invalid OTP. ${3 - otpDoc.attempts} attempts remaining.`);
  }

  // Success: Mark as verified
  otpDoc.isVerified = true;
  await otpDoc.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP verified successfully."));
});

// ─── Complete Registration (creates user after OTP verified) ─────────────────
const completeRegistration = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const otpDoc = await OTP.findOneAndDelete({ email, isVerified: true });

  if (!otpDoc) {
    throw new ApiError(400, "Email not verified or session expired. Verify OTP first.");
  }

  // Create user using stored pending data
  const newUser = await User.create(otpDoc.pendingData);

  const userResponse = await User.findById(newUser._id).select("-password -refreshToken");
  if (!userResponse) {
    throw new ApiError(500, "Database error during final user creation");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, userResponse, "Email verified and user registered successfully"));
});

// ─── Forgot Password (Phase 1: Send OTP) ──────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  // Check if user exists (either User or Security)
  const user = await User.findOne({ email }) || await Security.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  // Cooldown check for OTP
  const existingOtpDoc = await OTP.findOne({ email });
  if (existingOtpDoc) {
    const timeSinceLastOtp = (Date.now() - new Date(existingOtpDoc.createdAt).getTime()) / 1000;
    if (timeSinceLastOtp < 30) {
      throw new ApiError(429, `Wait ${Math.ceil(30 - timeSinceLastOtp)}s before requesting again.`);
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP for password reset flow
  await OTP.findOneAndUpdate(
    { email },
    {
      otp,
      pendingData: { type: 'forgot-password' },
      attempts: 0,
      isVerified: false,
      createdAt: Date.now()
    },
    { upsert: true, new: true }
  );

  await sendResetPasswordEmail(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset OTP sent to your email."));
});

// ─── Verify Forgot Password OTP (Phase 2) ─────────────────────────────────────
const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const otpDoc = await OTP.findOne({ email });

  if (!otpDoc || otpDoc.pendingData?.type !== 'forgot-password') {
    throw new ApiError(404, "Invalid or expired reset session.");
  }

  if (otpDoc.attempts >= 3) {
    await OTP.deleteOne({ email });
    throw new ApiError(400, "Max attempts exceeded. Please restart the process.");
  }

  if (otpDoc.otp !== otp.trim()) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    throw new ApiError(400, `Invalid OTP. ${3 - otpDoc.attempts} attempts remaining.`);
  }

  otpDoc.isVerified = true;
  await otpDoc.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP verified successfully. You can now reset your password."));
});

// ─── Reset Password (Phase 3: Update Password) ───────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    throw new ApiError(400, "Email and new password are required");
  }

  // Validate that OTP was actually verified for this email
  const otpDoc = await OTP.findOneAndDelete({ email, isVerified: true, "pendingData.type": 'forgot-password' });
  if (!otpDoc) {
    throw new ApiError(400, "Unauthorized password reset. Please verify OTP first.");
  }

  const user = await User.findOne({ email }) || await Security.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update password (pre-save hook will handle hashing)
  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully. You can now login."));
});

export { googleAuth, registerUser, loginUser, refreshAccessToken, generateAccessAndRefereshTokens, logoutUser, getUserDetail, changeCurrentPassword, updateAccountDetails, sendOtp, resendOtp, verifyOtp, completeRegistration, forgotPassword, verifyForgotPasswordOtp, resetPassword };
