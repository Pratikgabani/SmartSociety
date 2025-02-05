import { SocietyDetail } from "../models/societyDetail.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSocietyDetail = asyncHandler(async (req, res) => {
    const {societyId , societyName , societyAddress , adminPass , securityPass} = req.body;

    if(!societyId || !societyName || !societyAddress || !adminPass || !securityPass){
        throw new ApiError(400 , "All fields are required")
    }

    // const existingSocietyDetail = await SocietyDetail.findOne({societyId})
    // if(existingSocietyDetail){
    //     throw new ApiError(400 , "Society detail already exists")
    // }

    const newSocietyDetail = await SocietyDetail.create({
        societyId,
        societyName,
        societyAddress,
        adminPass,
        securityPass
    })

    if(!newSocietyDetail){
        throw new ApiError(500 , "Failed to create society detail")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , newSocietyDetail , "Society detail created successfully"))

})


export {createSocietyDetail}