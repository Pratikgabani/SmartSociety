import { Booking } from "../models/booking.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Venue } from "../models/venue.models.js";

const createBooking = asyncHandler(async (req, res) => {
    const { bookingType, bookDescription, noOfPersons, duration, date} =  req.body;

    if( !bookingType || !bookDescription || !noOfPersons || !duration || !date){
        throw new ApiError(400 , "All fields are required")
    }

    const existingDate = await Booking.findOne({date,bookingType})
    if(existingDate){
        throw new ApiError(400 , "Date and bookingType already booked")
    }
    // const userId = req.user?._id
   
    const newBooking = await Booking.create({
        bookingOwner : req.user?._id,  // here ? is optional chaining for user._id to check if user is logged in or not 
        bookingType, 
        bookDescription,
        noOfPersons,
        duration,
        date,
    })
 
    // const bookingRes = await Booking.findById(newBooking._id)
    if(!newBooking){
        throw new ApiError(500 , "Failed to create booking")
    }


    return res
    .status(200)
    .json(new ApiResponse(200 , newBooking , "Booking created successfully"))
})

const createVenue = asyncHandler(async (req , res) =>{
    // Check if the user is admin or not 
    const role = req.user?.role

    if(role !== "admin"){
        throw new ApiError(403 , "You are not authorized to create a venue")
    }
    console.log(role)
    const {venue , description ,amenities , capacity , price} = req.body;
    const societyId = req.user?.societyId
    console.log(societyId)

    if(!societyId){
        throw new ApiError(400 , "Society Id is required")
    }
  
    if(!venue || !description || !amenities || !capacity || !price){
        throw new ApiError(400 , "All fields are required")
    }

    const newVenue = await Venue.create({
        venue,
        description,
        amenities,
        capacity,
        price
    })

    if(!newVenue){
        throw new ApiError(500 , "Failed to create venue")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , newVenue , "Venue created successfully"))
    
})

const getVenue = asyncHandler(async (req , res) => {
    const allVenues = await Venue.find({societyId : req.user?.societyId})
    if(!allVenues){
        throw new ApiError(500 , "Failed to get venues")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , allVenues , "Venues found successfully"))
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
    const {bookingId} = req.params

    if(!bookingId.trim()){
        throw new ApiError(400 , "Booking Id is required")
    }

    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if(!deletedBooking){
        throw new ApiError(500 , "Failed to delete booking")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , deletedBooking , "Booking deleted successfully"))
}); 

const bookingStatus = asyncHandler(async (req, res) => {
    const {bookingId} = req.params

    if(!bookingId.trim()){
        throw new ApiError(400 , "All fields are required")
    }

    const booking = await Booking.findById(bookingId);
    if(!booking){
        throw new ApiError(404 , "Booking not found")
    }

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId , 
        {
            isAccepted : !booking.isAccepted
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200 , updatedBooking , `Booking ${updatedBooking.isAccepted ? "accepted" : "rejected"} successfully`))

})

export { createBooking , getBookings , deleteBooking , bookingStatus , createVenue , getVenue}