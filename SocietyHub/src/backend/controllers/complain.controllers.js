import { Complain } from "../models/complain.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import {upload} from "./../middlewares/multer.middlewares.js"


const createComplain = asyncHandler(async (req, res) => {
    
    
        const { subject, description, date } = req.body;
        //fing house number existing in user
       console.log(subject , description , date)
        
        
       if([subject , description , date].some((field) => field?.trim() ==="")){
        // The ?. checks if field exists (i.e., it is not null or undefined) before trying to use .trim().If field is null or undefined, it does not run .trim() and instead returns undefined.
              throw new ApiError(400 , "Alll fields are required"); 
          }

        const existingComplain = await Complain.findOne({ subject });
        if (existingComplain) {
            throw new ApiError(400, "Complain already exists");
        }
        
        let proof;
        // Check if proof file exists in request
        const proofLocalPath = req.files?.proof?.[0]?.path;

        // Upload proof only if provided
        if (proofLocalPath) {
            try {
                proof = await uploadOnCloudinary(proofLocalPath);
                console.log("Proof uploaded", proof);
            } catch (error) {
                console.log('Error uploading proof', error);
                throw new ApiError(500, "Failed to upload proof");
            }
        }
        
        try {
        const complain = await Complain.create({
            complainId: req.user._id,
            subject,
            description,
            date,
            byHouse : req.user?.houseNo,
            proof: proof?.url || undefined // Only include if proof exists
        });

        if (!complain) {
            throw new ApiError(400, "Complain not created");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, complain, "Complain created successfully"));

    } catch (error) {
        // Cleanup uploaded proof if error occurred and proof was uploaded
        if (proof) {
            await deleteFromCloudinary(proof.public_id);
        }
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong");
       
    }
});

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