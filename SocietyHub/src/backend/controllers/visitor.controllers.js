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
    const { id } = req.params;

    const visitor = await Visitor.findById(id);
    if (!visitor) {
        throw new ApiError(400, "Visitor not found");
    }

    visitor.isActive = false; // Instead of deleting, mark as inactive
    await visitor.save();

    return res.status(200).json(new ApiResponse(200, visitor, "Visitor checked out successfully"));
});

// const removeVisitor = asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     console.log("Deleting visitor with ID:", id); // Debugging log

//     const visitor = await Visitor.findById(id);
//     if (!visitor) {
//         throw new ApiError(400, "Visitor not found");
//     }

//     await visitor.deleteOne(); // Ensuring deletion

//     return res
//         .status(200)
//         .json(new ApiResponse(200, visitor, "Visitor removed successfully"));
// });

const getRecentVisitors = asyncHandler(async (req, res) => {
    try {
        const visitors = await Visitor.find({ isActive: false });

        if (!visitors || visitors.length === 0) {
            throw new ApiError(404, "No recent visitors found");
        }

        return res.status(200).json(new ApiResponse(200, visitors, "Recent visitors fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Error fetching recent visitors");
    }
});

const getRecentVisitorsByUserId = asyncHandler(async (req, res) => {
    const userHouse = req.user.houseNo


    try {
        const visitors = await Visitor.find({ isActive: false , visitingAdd : userHouse});

        if (!visitors || visitors.length === 0) {
            throw new ApiError(404, "No recent visitors found");
        }

        return res.status(200).json(new ApiResponse(200, visitors, "Recent visitors fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Error fetching recent visitors");
    }
});

const getAllVisitors = asyncHandler(async (req, res) => {
    //get the visiting add from visitors and match it to the users houseNo and then provide all the visitors with same houseNo as visitingAdd
    const visitors = await Visitor.find({ isActive: true });
   if(!visitors){
    throw new ApiError(400 , "Visitors not found")
   }
   return res
   .status(200)
   .json(new ApiResponse(200, visitors, "Visitors found successfully"));
    
})

const getVisitorById = asyncHandler(async (req, res) => {
    const userHome = req.user.houseNo
    const visitor = await Visitor.find({visitingAdd : userHome})

    if(!visitor){
        throw new ApiError(400 , "Visitor not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, visitor, "Visitor found successfully"));
})

export {createVisitor,removeVisitor,getAllVisitors,getVisitorById,getRecentVisitors,getRecentVisitorsByUserId}