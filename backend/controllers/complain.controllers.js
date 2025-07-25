import { Complain } from "../models/complain.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import {upload} from "../middlewares/multer.middlewares.js"


// const createComplain = asyncHandler(async (req, res, next) => {
//     const { subject, description } = req.body;

//     console.log(subject, description);

//     if ([subject, description].some((field) => field?.trim() === "")) {
//         throw new ApiError(400, "All fields are required");
//     }

//     const existingComplain = await Complain.findOne({ subject });
//     if (existingComplain) {
//         throw new ApiError(400, "Complain already exists");
//     }

//     let proof;
//     const proofLocalPath = req.file?.path;

//     if (proofLocalPath) {
//         try {
//             proof = await uploadOnCloudinary(proofLocalPath);
//             console.log("Proof uploaded", proof);
//         } catch (error) {
//             console.log('Error uploading proof', error);
//             throw new ApiError(500, "Failed to upload proof");
//         }
//     }

//     try {
//         const complain = await Complain.create({
//             complainId: req.user._id,
//             subject,
//             description,
//             date : new Date().toLocaleDateString(),
//             byHouse: req.user?.houseNo,
//             proof: proof?.url || undefined // Only include if proof exists
//         });

//         if (!complain) {
//             throw new ApiError(400, "Complain not created");
//         }

//         return res
//             .status(200)
//             .json(new ApiResponse(200, complain, "Complain created successfully"));

//     } catch (error) {
//         if (proof) {
//             await deleteFromCloudinary(proof.public_id);
//         }
//         next(new ApiError(500, "Something went wrong"));
//     }
// });
const createComplain = asyncHandler(async (req, res, next) => {
    const { subject, description } = req.body;

    console.log("Received:", subject, description, req.file);

    if (!subject || !description) {
        throw new ApiError(400, "All fields are required");
    }

    const existingComplain = await Complain.findOne({ subject });
    if (existingComplain) {
        throw new ApiError(400, "Complaint already exists");
    }

    let proof = null;
    if (req.file) {
        try {
            proof = await uploadOnCloudinary(req.file.path);
            console.log("Proof uploaded", proof);
        } catch (error) {
            console.log("Error uploading proof", error);
            throw new ApiError(500, "Failed to upload proof");
        }
    }

    try {
        const complain = await Complain.create({
            complainId: req.user._id,
            subject,
            description,
            date: new Date(),
            byHouse: req.user.houseNo,
            proof : proof?.url,// Store Cloudinary URL
            societyId: req.user?.societyId ,
            
        });

        if (!complain) {
            throw new ApiError(400, "Complaint not created");
        }

        return res.status(200).json(new ApiResponse(200, complain, "Complaint created successfully"));

    } catch (error) {
        if (proof) {
            await deleteFromCloudinary(proof.public_id);
        }
        next(new ApiError(500, "Something went wrong"));
    }
});
// const createComplain = async (req, res) => {
//     // 1. Check if a file was uploaded. Multer adds the `file` object to `req`.
//     if (!req.file) {
//         return res.status(400).json({ error: "An image file is required for the complaint." });
//     }

//     try {
//         // 2. Upload the file buffer from memory to Cloudinary
//         const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer);

//         if (!cloudinaryResponse) {
//             return res.status(500).json({ error: "Failed to upload image, please try again." });
//         }

//         // 3. Extract necessary data from the form body and Cloudinary's response
//         const { title, description } = req.body;
//         const imageUrl = cloudinaryResponse.secure_url;
//         const imagePublicId = cloudinaryResponse.public_id;
//         const imageResourceType = cloudinaryResponse.resource_type;

//         // 4. Create a new entry in your database, saving the Cloudinary details
//         const newComplaint = await Complain.create({
//             title,
//             description,
//             author: req.user._id, // Assuming user is available from an auth middleware
//             attachment: {
//                 url: imageUrl,
//                 publicId: imagePublicId,
//                 resourceType: imageResourceType
//             }
//         });

//         return res.status(201).json({
//             message: "Complaint created successfully.",
//             data: newComplaint
//         });

//     } catch (error) {
//         console.error("Error creating complaint:", error);
//         return res.status(500).json({ error: "An internal server error occurred." });
//     }
// };

const getAllComplains = asyncHandler(async (req, res) => {
    const complains = await Complain.find({societyId: req.user?.societyId , isResolved : false}).select("-__v  -societyId -createdAt -updatedAt -complainId -byuser").sort({ createdAt: -1 });
  
    if (!complains) {
      throw new ApiError(404, "No complains found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, complains, "Complains fetched successfully"));
});

const getComplains = asyncHandler(async (req, res) => {
    const complains = await Complain.find({societyId: req.user?.societyId , isResolved : true }).select("-__v -_id -isResolved -isActive -societyId -createdAt -updatedAt -complainId -byuser ").sort({ createdAt: -1 });
  
    if (!complains) {
        throw new ApiError(404, "No complains found");
    }
  
    return res
        .status(200)
        .json(new ApiResponse(200, complains, "Complains fetched successfully"));
    }
);
const deleteComplain = asyncHandler(async (req, res) => {
    const { complainId } = req.params;
  console.log('complainId' + complainId);
    if (!complainId) {
      throw new ApiError(400, "Complain ID is required");
    }
  
  const deletedComplain = await Complain.findByIdAndDelete(complainId);
  
    if (!deletedComplain) {
      throw new ApiError(404, "Complain not found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, deletedComplain, "Complain deleted successfully"));

});

const toggleComplain = asyncHandler(async (req, res) => {
    const { complainId } = req.params;

    if (!complainId) {
        throw new ApiError(400, "Complain ID is required");
    }

    const complain = await Complain.findById(complainId);

    if (!complain) {
        throw new ApiError(404, "Complain not found");
    }

    // Toggle isResolved and update resolvedDate accordingly
    const updatedComplain = await Complain.findByIdAndUpdate(
        complainId,
        {
            isResolved: !complain.isResolved,
            resolvedDate: complain.isResolved ? null : new Date()
        },
        { new: true }
    );

    if (!updatedComplain) {
        throw new ApiError(500, "Failed to toggle complain");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedComplain,
            `Complain ${updatedComplain.isResolved ? "resolved" : "unresolved"} successfully`
        )
    );
});

export { createComplain , deleteComplain , getAllComplains ,toggleComplain, getComplains};