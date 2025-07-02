import { Event } from "../models/event.models.js";
import {asyncHandler} from "./../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import Stripe from "stripe";
import dotenv from "dotenv";

import toast from "react-hot-toast";

dotenv.config({
    path : "./.env"
})
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createEvent = asyncHandler(async (req, res) => {
    const { eventName, eventDate, venue, amtPerPerson, description, time, lastDateOfPay , category} = req.body;

    if(!eventName || !eventDate || !venue || !amtPerPerson || !description || !time || !lastDateOfPay || !category) {
        res.status(400);
        throw new ApiError("Please fill all the fields");
    }

    // Have checked it in frontend
    // if(new Date(eventDate) < new Date()){
    //     throw new ApiError(400 , "Event date should be greater than current date");
    // }

    // if(new Date(lastDateOfPay).toDateString() < new Date(eventDate).toDateString()){
    //     throw new ApiError(400 , "Last date of payment should be less than event date");
    // }
    
    const event = await Event.create({
        eventName,
        eventDate,
        venue,
        amtPerPerson,
        description,
        time,
        lastDateOfPay,
        category,
        societyId : req.user.societyId
    })

    if(!event){
        throw new ApiError( 400 ,"Event not created");
    }

    return res
    .status(201)
    .json(new ApiResponse(200 , event , "Event created successfully"));
});

const getUpcomingEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({eventDate : {$gte : new Date()} , societyId : req.user.societyId})
    if(!events){
        return new ApiError( 500 ,"No events found" );
    }

    return res
    .status(200)
    .json(new ApiResponse(200, events, "Upcoming Events found successfully"));
    })

const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({societyId : req.user.societyId}).select("-_id -updatedAt -__v -societyId -isActive").populate("readyUsers" , "houseNo block -_id" )
    // console.log(events)
    if(!events){
        return new ApiError( 500 ,"No events found" );
    }

    return res
    .status(200)
    .json(new ApiResponse(200, events, "Events found successfully"));
})

const getPastEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({eventDate : {$lt : new Date()} , societyId : req.user.societyId}).select("-_id -updatedAt -__v -societyId -isActive").populate("readyUsers" , "houseNo block -_id" )
    if(!events){
        return new ApiError( 500 ,"No events found" );
    }

    return res
    .status(200)
    .json(new ApiResponse(200, events, "Past Events found successfully"));
})

const deleteEvent = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const event = await Event.findByIdAndDelete(id)

    if(!event){
        throw new ApiError(400 , "Event not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , event , "Event deleted successfully"));
    
    
})

const updateEvent = asyncHandler(async (req, res) => {
    const {eventName , eventDate, venue, amtPerPerson, description, time, lastDateOfPay} = req.body;

    const id = req.params.id;
    if(!eventName || !eventDate || !venue || !amtPerPerson || !description || !time || !lastDateOfPay ) {
        res.status(400);
        throw new ApiError("Please fill all the fields");
    }

    const event = await Event.findByIdAndUpdate(id, {
        $set : {
            eventName,
            eventDate,
            venue,
            amtPerPerson,
            description,
            time,
            lastDateOfPay,
        }
    }, {
        new : true
    })

    if(!event){
        throw new ApiError(400 ,"Event not updated" );
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , event , "Event updated successfully"));
})


import { EventOrder } from "../models/eventOrder.model.js";


// ====================================================
// ✅ Initiate Event Payment (Similar to payPayment)
// ====================================================
const payEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;   // ✅ Make sure your auth middleware is setting this correctly

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // ✅ Check if THIS user already paid for THIS event
  const existingOrder = await EventOrder.findOne({ userId, eventId });
  if (existingOrder) {
    return res.status(400).json({ errors: "You have already paid for this event." });
  }

  // ✅ Proceed to create Stripe payment intent...
  const paymentIntent = await stripe.paymentIntents.create({
    amount: event.amtPerPerson * 100,  // Convert to paise or cents
    currency: "inr",
    payment_method_types: ["card"],
  });

  res.status(201).json({
    message: "Event payment intent created successfully",
    event,
    clientSecret: paymentIntent.client_secret,
  });
});


const saveEventOrder = asyncHandler(async (req, res) => {
  const {
    paymentDoneId,   // Stripe's PaymentIntent ID
    eventId,
    amount,
    status,
    paidOn,
  } = req.body;

  if (!paymentDoneId || !eventId || !amount || !status) {
    throw new ApiError(400, "Missing required payment/order fields");
  }

  await EventOrder.create({
    userId: req.user._id,
    eventId,
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


const toggleResponse = asyncHandler(async (req, res) => {
    const {eventId} = req.params
    const userId = req.user._id // Get logged-in user

    if (!eventId) {
        throw new ApiError(400, "Event ID not found");
    }

    const event = await Event.findById(eventId);
    
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Check if user has already responded
    const userIndex = event.readyUsers.indexOf(userId);
    
    if (userIndex === -1) {
        event.readyUsers.push(userId);
        event.totalHouseReady += 1;
    } else {
        event.readyUsers.splice(userIndex, 1);
        event.totalHouseReady -= 1;
    }

    await event.save();

    return res.status(200).json(new ApiResponse(200, event, "Response toggled successfully"));
});


export { createEvent , getAllEvents , deleteEvent , updateEvent , toggleResponse , getUpcomingEvents , getPastEvents , payEvent , saveEventOrder }