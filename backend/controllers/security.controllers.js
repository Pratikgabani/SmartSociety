import { Security } from "../models/security.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import { SocietyDetail } from "../models/societyDetail.models.js";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await Security.findById(userId)
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
  
      const user = await Security.findById(decodedToken?._id)
  
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
const registerSecurity = asyncHandler(async (req, res) => {
  const { societyId, securityPass, email, password } = req.body;
  if (!societyId || !securityPass || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }


  // const existingSecurity = await Security.findOne({ societyId, securityPass });
  // if (!existingSecurity) {
  //   throw new ApiError(400, "Security already registered");
  // }
  const existingSocietyDetail = await SocietyDetail.findOne({societyId,securityPass})
  if(!existingSocietyDetail){
      throw new ApiError(400 , "Society detail not found")
  }
 const existingEmail = await Security.findOne({email})
 if(existingEmail){
    throw new ApiError(400 , "Security already registered")
}

  const newSecurity = await Security.create({
    societyId,
    securityPass,
    email,
    role : "security",
    password,
  });

  const userResponse = await Security.findById(newSecurity._id).select(
    "-password -refreshToken" // This will select all the fields other than password and refreshToken
  );

  if (!userResponse) {
    throw new ApiError(400, "Security registration failed");
  }

  return res.status(201).json(
    new ApiResponse(200, userResponse, "Security registered successfully")
  );
});


// const registerSecurity = asyncHandler(async (req, res) => {
//     const {societyId, securityPass, email, password} = req.body;
//     if(!societyId || !securityPass || !email || !password){
//         throw new ApiError(400 , "All fields are required")
//     }

//   const existingSecurity = await Security.findOne({societyId, securityPass})
//     if(existingSecurity){
//         throw new ApiError(400 , "Security already registered")
//    }

//     const newSecurity = await Security.create({
//         societyId,
//         securityPass,
//         email,
//         password
//     })


   
//       const userResponse = await Security.findById(newSecurity._id).select(
//           // selecting the fields that we want to show in the response
//             "-password -refreshToken " // This will select all the fields other than password and refreshToken
//          )
    
//         if(!userResponse){
//           throw new ApiError(400, "security registration failed")
//          }
    
//         return res.status(201).json(
//           new ApiResponse(200, userResponse, "security registered Successfully")
//       )
// })

const loginSecurity = asyncHandler (async (req, res) =>{
    const { email, password} = req.body;
if(  !email || !password){
    throw new ApiError(400 , "All fields are required")
}

    const user = await Security.findOne({email});
    // console.log(user)
    if(!user){
      throw new ApiError(400, "User not found")
    }
    
    
    const isPasswordValid = await user.isPasswordCorrect(password)
    // console.log(password)
    if(!isPasswordValid){
      throw new ApiError(400 , "Invalid password")
    }
    
   
    
    const {accessToken , refreshToken } = await generateAccessAndRefereshTokens(user._id)
    const loggedInUser = await Security.findById(user._id).select("-password -refreshToken")
    if(!loggedInUser){
      throw new ApiError(500 , "Failed to login")
    }
    
    const options = {
    httpOnly : true ,//This means that the cookie cannot be accessed by client-side scripts.
    secure : process.env.NODE_ENV === "production" ,
    sameSite : "none"// This means that the cookie will only be sent over HTTPS in production environments.
    }
    
    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(new ApiResponse(200 , {user : loggedInUser , accessToken, refreshToken} , "security Logged in successfully")
    )

})

const logoutSecurity = asyncHandler(async (req, res) => {
    await Security.findByIdAndUpdate(
      req.user._id , 
    {
      $set : {
        refreshToken : undefined,
      }
    },
    {new : true}
    )
  
    const options = {
      httpOnly : true , 
      secure : process.env.NODE_ENV === "production",
      sameSite : "none",
        path: "/"
    }
  
    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200 , null , "security Logged out successfully"))
  })
    
export { registerSecurity ,generateAccessAndRefereshTokens, refreshAccessToken, loginSecurity, logoutSecurity}