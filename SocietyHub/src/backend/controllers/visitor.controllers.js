import { Visitor } from "../models/visitor.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Security } from "../models/security.models.js";

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
            visitingAdd,
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

export {createVisitor}