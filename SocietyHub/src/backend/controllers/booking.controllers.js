import { Booking } from "../models/booking.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";

const createBooking = asyncHandler(async (req, res) => {
    const { bookingType, bookDescription, noOfPersons, duration, date} =  req.body;

    if( !bookingType || !bookDescription || !noOfPersons || !duration || !date){
        throw new ApiError(400 , "All fields are required")
    }

    const existingDate = await Booking.findOne({date,bookingType})
    if(existingDate){
        throw new ApiError(400 , "Date and bookingType already booked")
    }
    const userId = req.user?._id
   
    const newBooking = await Booking.create({
        bookingOwner : req.user?._id,  // here ? is optional chaining for user._id to check if user is logged in or not 
        bookingType, 
        bookDescription,
        noOfPersons,
        duration,
        date,
    })
 
    const bookingRes = await Booking.findById(newBooking._id)
    if(!bookingRes){
        throw new ApiError(500 , "Failed to create booking")
    }


    return res
    .status(200)
    .json(new ApiResponse(200 , newBooking , "Booking created successfully"))
})

const getBookings = asyncHandler(async (req, res) => {
    const allBookings = await Booking.find().populate("bookingType")
    if(!allBookings){
        throw new ApiError(500 , "Failed to get bookings")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , allBookings , "Bookings found successfully"))
})

const deleteBooking = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const deletedBooking = await Booking.deleteOne({ bookingOwner: userId });
    if (!deletedBooking) {
        throw new ApiError(500, "Failed to delete booking");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedBooking, "Booking deleted successfully"));
}); 

export { createBooking , getBookings , deleteBooking }