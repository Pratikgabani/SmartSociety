import { Complain } from "../models/complain.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createComplain = asyncHandler(async (req, res) => {

const {subject , description , date , byHouse } = req.body;

if(!subject || !description || !date || !byHouse){
    throw new ApiError(400 , "All fields are required")
}

const existingComplain = await Complain.findOne({subject})
if(existingComplain){
    throw new ApiError(400 , "Complain already exists")
}

const complain = await Complain.create({
    complainId : req.user._id,
    subject,
    description,
    date,
    byHouse,
    
})

if(!complain){
    throw new ApiError(400 , "Complain not created")
}

return res
.status(200)
.json(new ApiResponse(200 , complain , "Complain created successfully"))

})

const getAllEvents = asyncHandler(async (req, res) => {
    const complains = await Complain.find();
  
    if (!complains) {
      throw new ApiError(404, "No complains found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, complains, "Complains fetched successfully"));
  });

const deleteComplain = asyncHandler(async (req, res) => {
    const {subject} = req.body;
    const userId = req.user._id;
    const deletedComplain = await Complain.findOne({subject : subject , complainId : userId});
  
    if (!deletedComplain) {
      throw new ApiError(404, "Complain not found");
    }
    const delComplain = await Complain.findByIdAndDelete(deletedComplain._id);
  
    if (!delComplain) {
      throw new ApiError(500, "Failed to delete complain");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, deletedComplain, "Complain deleted successfully"));
  });


    export { createComplain , deleteComplain , getAllEvents }