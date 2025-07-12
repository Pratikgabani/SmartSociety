import { Booking } from "../models/booking.models.js";
import {BookingOrder} from "../models/bookingOrder.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Venue } from "../models/venue.models.js";
  
const createBooking = asyncHandler(async (req, res) => {
    const {bookingType , bookDescription, duration, date } = req.body;
    // const bookingType = req.body.bookingType;  // Extract venue ID from request

    if (!bookDescription || !duration || !date || !bookingType) {
        throw new ApiError(400, "All fields are required.");
    }

    const checkVenue = await Venue.findOne({venue : bookingType});

    if (!checkVenue) {
        throw new ApiError(404, "Venue not found.");
    }

    // Check if the specific venue is already booked on the same date
    const existingBooking = await Booking.findOne({ date, bookingType });
    if (existingBooking) {
        throw new ApiError(400, "This venue is already booked for the selected date.");
    }
 
    const newBooking = await Booking.create({
        bookingOwner: req.user?._id,  // Logged-in user's ID
        bookingType,  // Venue ID from frontend
        bookDescription,
        duration,
        date,
        societyId : req.user?.societyId
    }); 
    // console.log(newBooking) 

    if (!newBooking) {
        throw new ApiError(500, "Failed to create booking.");
    }

    return res.status(200).json(new ApiResponse(200, newBooking, "Booking created successfully."));
});

const createVenue = asyncHandler(async (req , res) =>{
    // Check if the user is admin or not 
    const role = req.user?.role

    if(role !== "admin"){
        throw new ApiError(403 , "You are not authorized to create a venue")
    }
    // console.log(role)
    const {venue , description ,amenities , capacity , price} = req.body;
    const societyId = req.user?.societyId
    // console.log(societyId)

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
        price,
        societyId: req.user?.societyId
    })

    if(!newVenue){
        throw new ApiError(500 , "Failed to create venue")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , newVenue , "Venue created successfully"))
    
})

const getVenue = asyncHandler(async (req , res) => {
    const allVenues = await Venue.find({societyId: req.user?.societyId})
    if(!allVenues){
        throw new ApiError(500 , "Failed to get venues")
    }
    // console.log(allVenues)

    return res
    .status(200)
    .json(new ApiResponse(200 , allVenues , "Venues found successfully"))
})

const deleteVenue = asyncHandler(async (req , res) => {
    const {venueId} = req.params;

    if(!venueId.trim()){
        throw new ApiError(400 , "Venue Id is required")
    }

    const role = req.user?.role

    if(role !== "admin"){
        throw new ApiError(403 , "You are not authorized to delete a venue")
    }

    // Check if the venue exists
    const venue = await Venue.findOne({_id : venueId , societyId: req.user?.societyId});

    if(!venue){
        throw new ApiError(404 , "Venue not found")
    }

    const deletedVenue = await Venue.findByIdAndDelete(venueId);

    if(!deletedVenue){
        throw new ApiError(500 , "Failed to delete venue")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , deletedVenue , "Venue deleted successfully"))
})

const getBookings = asyncHandler(async (req, res) => {
    const allBookings = await Booking.find({ societyId: req.user?.societyId })
        .sort({ date: -1 }) // Sort by date in descending order
        .select("-__v -_id -updatedAt -societyId")
        .populate("bookingOwner", "houseNo block -_id" ); // Populating houseNo & block from User model

    if (!allBookings) {
        throw new ApiError(500, "Failed to get bookings");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, allBookings, "Bookings found successfully"));
});

// const getBookings = asyncHandler(async (req, res) => {
//     const allBookings = await Booking.aggregate([
//         {
//             $match: { societyId: req.user?.societyId } // Match bookings for the user's society
//         },
//         {
//             $lookup: {
//                 from: "users", // The name of the User collection in MongoDB
//                 localField: "bookingOwner",
//                 foreignField: "_id",
//                 as: "bookingOwnerDetails"
//             }
//         },
//         {
//             $unwind: "$bookingOwnerDetails" // Convert array to object
//         },
//         {
//             $project: {
//                 _id: 0, // Remove _id from booking
//                 bookingType: 1,
//                 bookDescription: 1,
//                 duration: 1,
//                 date: 1,
//                 createdAt: 1,
//                 "bookingOwner.block": "$bookingOwnerDetails.block",
//                 "bookingOwner.houseNo": "$bookingOwnerDetails.houseNo"
//             }
//         }
//     ]);

//     if (!allBookings) {
//         throw new ApiError(500, "Failed to get bookings");
//     }

//     return res.status(200).json(new ApiResponse(200, allBookings, "Bookings found successfully"));
// });
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({
    path : "./.env"
})
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const getPastBookings = asyncHandler(async (req, res) => {
    const allBooking = await Booking.find({
        societyId: req.user?.societyId,
        date: { $lt: new Date() },
      }).select("-__v -_id -updatedAt -societyId").populate("bookingOwner" , "houseNo block -_id" )
    if(!allBooking){
        throw new ApiError(500 , "Failed to get bookings")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , allBooking , "Past Bookings found successfully"))

})

const getPastBookingsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user._id 
    const allBookings = await Booking.find({societyId: req.user?.societyId , bookingOwner : userId , date: { $lt: new Date() }}).select("-__v -_id -updatedAt -bookingOwner -societyId")
    if(!allBookings){
        throw new ApiError(500 , "Failed to get bookings")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , allBookings , "My Bookings found successfully"))
})

const getBookingsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user._id 
    
    // console.log(userId)
    if(!userId){
        throw new ApiError(400 , "User not found")
    }

    const allBookings = await Booking.find({societyId: req.user?.societyId , bookingOwner : userId}).select("-__v -_id -updatedAt -bookingOwner -societyId")
    if(!allBookings){
        throw new ApiError(500 , "Failed to get bookings")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , allBookings , "My Bookings found successfully"))
})

const getUpcomingBookingsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const allBookings = await Booking.find({societyId: req.user?.societyId , bookingOwner : userId , date: { $gte: new Date() }}).select("-__v -_id -updatedAt -bookingOwner -societyId")
    if(!allBookings){
        throw new ApiError(500 , "Failed to get bookings")
    }
    return res
    .status(200)
    .json(new ApiResponse(200 , allBookings , "My Bookings found successfully"))
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
const payBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;   // ✅ Make sure your auth middleware is setting this correctly

  const bookings = await Booking.findById(bookingId);
  if (!bookings) {
    throw new ApiError(404, "bookings not found");
  }

  // ✅ Check if THIS user already paid for THIS event
  const existingOrder = await BookingOrder.findOne({ userId, bookingId });
  if (existingOrder) {
    return res.status(400).json({ errors: "You have already paid for this booking." });
  }
  
  const venues = await Venue.find({venue: bookings.bookingType, societyId: req.user?.societyId});
  console.log("Venues:", venues);
  const price = venues[0].price
  console.log("Price" , price)
  // ✅ Proceed to create Stripe payment intent...
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price * 100,  // Convert to paise or cents
    currency: "inr",
    payment_method_types: ["card"],
  });

  res.status(201).json({
    message: "Event payment intent created successfully",
    bookings,
    clientSecret: paymentIntent.client_secret,
  });
});


const saveBookingOrder = asyncHandler(async (req, res) => {
  const {
    paymentDoneId,   // Stripe's PaymentIntent ID
    bookingId,
    amount,
    status,
    paidOn,
  } = req.body;

  if (!paymentDoneId || !bookingId || !amount || !status) {
    throw new ApiError(400, "Missing required payment/order fields");
  }

  await BookingOrder.create({
    userId: req.user._id,
    bookingId,
    paymentDoneId,
    amount,
    status,
    paidOn,
    societyId: req.user.societyId,
    email: req.user.email,
  });

  res.status(201).json({
    message: "Event order saved successfully",
  });
});
// const bookingStatus = asyncHandler(async (req, res) => {
//     const {bookingId} = req.params

//     if(!bookingId.trim()){
//         throw new ApiError(400 , "All fields are required")
//     }

//     const booking = await Booking.findById(bookingId);
//     if(!booking){
//         throw new ApiError(404 , "Booking not found")
//     }

//     const updatedBooking = await Booking.findByIdAndUpdate(bookingId , 
//         {
//             isAccepted : !booking.isAccepted
//         }
//     )

//     return res
//     .status(200)
//     .json(new ApiResponse(200 , updatedBooking , `Booking ${updatedBooking.isAccepted ? "accepted" : "rejected"} successfully`))

// })

export { createBooking , getBookings , deleteBooking  , createVenue , getVenue , deleteVenue , getBookingsByUserId , getPastBookings , getPastBookingsByUserId , getUpcomingBookingsByUserId, payBooking , saveBookingOrder}