import { Event } from "../models/event.models.js";
import {asyncHandler} from "./../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

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
    .json(new ApiResponse("Event created successfully", event, true));
});

const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({societyId : req.user.societyId})
    console.log(events)
    if(!events){
        return new ApiError( 500 ,"No events found" );
    }

    return res
    .status(200)
    .json(new ApiResponse("Events found successfully", events, true));
})

const deleteEvent = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const event = await Event.findByIdAndDelete(id)

    if(!event){
        throw new ApiError(400 , "Event not found");
    }

    return res
    .status(200)
    .json(new ApiResponse("Event deleted successfully" , event , true ));
    
    
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
    .json(new ApiResponse("Event updated successfully" , event , true ));
})

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

    return res.status(200).json(new ApiResponse("Response submitted successfully", event, true));
});



export { createEvent , getAllEvents , deleteEvent , updateEvent , toggleResponse }