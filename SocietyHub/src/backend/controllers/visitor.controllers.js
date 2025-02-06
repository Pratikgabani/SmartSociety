import { Visitor } from "../models/visitor.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Security } from "../models/security.models.js";
import { User } from "../models/user.models.js";

const createVisitor = asyncHandler(async (req, res) => {
    const {visitorName, visitorPhone, visitingAdd, purpose,visitDate,visitTime} = req.body;

      const userId =  req.user._id
      const securityId = await Security.findById(userId)
      if(!securityId){
        throw new ApiError(404 , "User not found")
      }



        if(!visitorName || !visitorPhone || !visitingAdd || !purpose || !visitDate || !visitTime){
            throw new ApiError(400 , "All fields are required")
        }

        const newVisitor = await Visitor.create({
            visitorName,
            visitorPhone,   
            visitingAdd ,
            purpose,
            visitDate,  
            visitTime,
            isActive : true
        })

        if(!newVisitor){
            throw new ApiError(400 , "Visitor not created")
        }
        return res
        .status(200)
        .json(new ApiResponse(200, newVisitor, "Visitor created successfully"));

})

const removeVisitor = asyncHandler(async (req, res) => {
    const {id} = req.params
    const visitor = await Visitor.findByIdAndDelete(id)
    if(!visitor){
        throw new ApiError(400 , "Visitor not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, visitor, "Visitor removed successfully"));
})

const getAllVisitors = asyncHandler(async (req, res) => {
    //get the visiting add from visitors and match it to the users houseNo and then provide all the visitors with same houseNo as visitingAdd
   const houseNO  = req.user.houseNo

   const visitors = await Visitor.find({visitingAdd : houseNO})
   if(!visitors){
    throw new ApiError(400 , "Visitors not found")
   }
   return res
   .status(200)
   .json(new ApiResponse(200, visitors, "Visitors found successfully"));
    
})

const getVisitorById = asyncHandler(async (req, res) => {
    const {id} = req.params
    const visitor = await User.findById(id)
    if(!visitor){
        throw new ApiError(400 , "Visitor not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, visitor, "Visitor found successfully"));
})

export {createVisitor,removeVisitor,getAllVisitors,getVisitorById}