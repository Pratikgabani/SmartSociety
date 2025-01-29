


import bcrypt from 'bcrypt';
import {User}  from '../models/user.models.js'; // Adjust the import path
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";




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
      nameOfPersons,
      phoneNo,
      numberOfVeh,
      vehicleNo
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if house number is unique within the society
    const existingHouse = await User.findOne({ societyId, houseNo });
    if (existingHouse) {
      return res.status(400).json({ 
        message: 'House number already registered in this society' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      block,
      houseNo,
      password: hashedPassword,
      societyId,
      email,
      nameOfPersons,
      phoneNo,
      numberOfVeh,
      vehicleNo
    });

    // Return user data without password
    const userResponse = {
      _id: newUser._id,
      block: newUser.block,
      houseNo: newUser.houseNo,
      societyId: newUser.societyId,
      email: newUser.email,
      nameOfPersons: newUser.nameOfPersons,
      phoneNo: newUser.phoneNo,
      numberOfVeh: newUser.numberOfVeh,
      vehicleNo: newUser.vehicleNo,
      createdAt: newUser.createdAt
    };


    if(!newUser){
      throw new ApiError(400, "User registration failed")
     }

    return res.status(201).json(
      new ApiResponse(200, userResponse, "User registered Successfully")
  )

  
   
})

const loginUser = asyncHandler (async (req, res) => {

const {email, password} = req.body;

const user = await User.findOne({email});

if(!user){
  throw new ApiError(400, "User not found")
}

const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch){
  throw new ApiError(400, "Invalid credentials")
}

return res.status(200).json(  
  new ApiResponse(200, user, "User logged in Successfully")
)



});




export { registerUser, loginUser, refreshAccessToken , generateAccessAndRefereshTokens};
