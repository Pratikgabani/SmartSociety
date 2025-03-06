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
           const ifExist = await Visitor.findOne({visitorPhone,visitorName})
           if(ifExist){
            throw new ApiError(400 , "Visitor already exist")
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
            visitTime ,
            isActive : true,
            societyId : securityId.societyId
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

const deleteVisitor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    console.log("Deleting visitor with ID:", id); // Debugging log

    const visitor = await Visitor.findById(id);
    if (!visitor) {
        throw new ApiError(400, "Visitor not found");
    }

    await visitor.deleteOne(); // Ensuring deletion

    return res
        .status(200)
        .json(new ApiResponse(200, visitor, "Visitor removed successfully"));
});

const getRecentVisitors = asyncHandler(async (req, res) => {
    try {
        const visitors = await Visitor.find({ isActive: false ,societyId : req.user.societyId});

        if (!visitors || visitors.length === 0) {
            throw new ApiError(404, "No recent visitors found");
        }

        return res.status(200).json(new ApiResponse(200, visitors, "Recent visitors fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Error fetching recent visitors");
    }
});

const getRecentVisitorsByUserId = asyncHandler(async (req, res) => {
    const {userHouse} = req.params
  
    if(!userHouse){
        throw new ApiError(400 , "User not found")
    }
 
    try {
        const visitors = await Visitor.find({ isActive: false , visitingAdd : userHouse, societyId : req.user.societyId}).select("-isActive -societyId -__v -_id -createdAt -updatedAt");

        if (!visitors || visitors.length === 0) {
            return res.status(404).json({ message: "No recent visitors found" });
        }

        return res.status(200).json(new ApiResponse(200, visitors, "Recent visitors fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Error fetching recent visitors");
    }
});

const getActiveVisitors = asyncHandler(async (req, res) => {
    //get the visiting add from visitors and match it to the users houseNo and then provide all the visitors with same houseNo as visitingAdd
    const visitors = await Visitor.find({ isActive: true, societyId : req.user.societyId});
   if(!visitors){
   return res
   .status(404)
   .json(new ApiResponse(404, "Visitors not found"));
   }
   return res
   .status(200)
   .json(new ApiResponse(200, visitors, "Visitors found successfully"));
    
})

const getActiveVisitorsByUserId = asyncHandler(async (req, res) => {
    const {userHouse} = req.params
  
    if(!userHouse){
        throw new ApiError(400 , "User house not found")
    }
 
    try {
        const visitors = await Visitor.find({ societyId : req.user.societyId,isActive: true , visitingAdd : userHouse});

        if (!visitors || visitors.length === 0) {
            return res.status(404).json({ message: "No recent visitors found" });
        }

        return res.status(200).json(new ApiResponse(200, visitors, "Recent visitors fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error, "Error fetching recent visitors"));
    }
});


const getVisitorById = asyncHandler(async (req, res) => {
    const userHome = req.user.houseNo
    const visitor = await Visitor.find({visitingAdd : userHome, societyId : req.user.societyId})

    if(!visitor){
     return res
     .status(404) 
     .json(new ApiResponse(404, "Visitor not found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200, visitor, "Visitor found successfully"));
})

// Backend controller example for updating visitor duration

const updateVisitorDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body;
    
   
    // Find the visitor by ID and update the duration and checkoutDate
    const updatedUser = await Visitor.findById(id);
    updatedUser.duration = duration;
    updatedUser.isActive = false;
    const updatedVisitor = await updatedUser.save();

    if (!updatedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.status(200).json(new ApiResponse(200, updatedVisitor, "Visitor duration updated successfully"));
  } catch (error) {
    console.error('Error updating visitor:', error);
    res.status(500).json({ message: "Error updating visitor" });
  }
};


export {createVisitor,updateVisitorDuration,removeVisitor,getActiveVisitors,getVisitorById,getRecentVisitors,getRecentVisitorsByUserId ,deleteVisitor, getActiveVisitorsByUserId}