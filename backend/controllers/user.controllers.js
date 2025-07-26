import bcrypt from 'bcrypt';
import {User}  from '../models/user.models.js'; // Adjust the import path
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { SocietyDetail } from '../models/societyDetail.models.js';
import { Security } from '../models/security.models.js';
import { Visitor } from '../models/visitor.models.js';

import axios from 'axios';

import { oauth2Client } from '../utils/googleConfig.js';




const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


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
  
      const user = await User.findById(decodedToken?._id)
  
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
  
      const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
          new ApiResponse(
              200, 
              {accessToken, refreshToken: newRefreshToken},
              "Access token refreshed"
          )
      )
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})

const registerUser = asyncHandler (async (req, res) => {
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
    const existingHouse = await User.findOne({ societyId, houseNo , block });
    if (existingHouse) {
      return res.status(400).json({ 
        message: 'House number already registered in this society' 
      });
    }

    // check if role is "admin" or "security" and then check if rolePass is provided and matching with rolePass in database
    if (role === "admin" ) {
      if (!rolePass) {
        throw new ApiError(400, "Role pass is required");
      }
      
        const existingRolePass = await SocietyDetail.findOne({adminPass: rolePass });
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

    if(!userResponse){
      throw new ApiError(400, "User registration failed")
     }

    return res.status(201).json(
      new ApiResponse(200, userResponse, "User registered Successfully")
  )  
})

const loginUser = asyncHandler (async (req, res) => {

const {email, password } = req.body;

// const security = await Security.findOne({email});
// if(security){
//   throw new ApiError(400 , "Security already registered")
// }

const user = await User.findOne({email}) || await Security.findOne({email})
if(!user){
  throw new ApiError(400, "User not found")
}

const isPasswordValid = await user.isPasswordCorrect(password)
// console.log(password)
if(!isPasswordValid){
  throw new ApiError(401 , "Invalid password")
}

// const isMatch = await bcrypt.compare(password, user.password);
// if(!isMatch){
//   throw new ApiError(400, "Invalid credentials")
// }

const {accessToken , refreshToken } = await generateAccessAndRefereshTokens(user._id)
const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
if(!loggedInUser){
  throw new ApiError(500 , "Failed to login")
}

const options = {
httpOnly : true ,//This means that the cookie cannot be accessed by client-side scripts.
//secure : process.env.NODE_ENV === "production" ,// This means that the cookie will only be sent over HTTPS in production environments.
secure : true ,
sameSite : "none" // updated this line
}

return res
.status(200)
.cookie("accessToken" , accessToken , options)
.cookie("refreshToken" , refreshToken , options)
.json(new ApiResponse(200 , {user : loggedInUser , accessToken, refreshToken} , "User Logged in successfully")
)
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id , 
  {
    $set : {
      refreshToken : null, // made it undefined to null 
    }
  },
  {new : true}
  )

  const options = {
    httpOnly : true , 
    secure : true , 
    path : "/" // This ensures the cookie is cleared for all paths
  }

  return res
  .status(200)
  .clearCookie("accessToken" , options)
  .clearCookie("refreshToken" , options)
  .json(new ApiResponse(200 , {} , "User logged out successfully"))
})

const getUserDetail = asyncHandler(async (req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(200 , req.user , "User found successfully"))
})

const changeCurrentPassword = asyncHandler(async (req , res) =>{
  const {oldPassword , newPassword} = req.body
  
  const user = await User.findById(req.user?._id)
  
  const isPasswordValid = user.isPasswordCorrect(oldPassword)
  
  if(!isPasswordValid){
    throw new ApiError(400 , "Invalid old password")
  }
  
  user.password = newPassword
  
  await user.save({validateBeforeSave:false})
  
  return res
  .status(200)
  .json(new ApiResponse(200 , {} , "Password changed successfully"))
  
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {phoneNo , vehicleNo , numberOfVeh} = req.body

    if (!vehicleNo || !numberOfVeh || !phoneNo) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                phoneNo,
                vehicleNo,
                numberOfVeh
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const googleAuth = asyncHandler(async (req, res) => { // 6
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const { data: { email} } = await axios.get(
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

export {googleAuth, registerUser, loginUser, refreshAccessToken , generateAccessAndRefereshTokens , logoutUser , getUserDetail ,changeCurrentPassword, updateAccountDetails};
