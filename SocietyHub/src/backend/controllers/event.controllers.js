import { User } from "../models/user.models.js";
import { Event } from "../models/event.models.js";
import {asyncHandler} from "./../utils/asyncHandler.js"
import {ApiError} from "./../utils/apiError.js";
import {ApiResponse} from "./../utils/apiResponse.js";

const createEvent = asyncHandler(async (req, res) => {
    const { eventName, eventDate, venue, amtPerPerson, description, time, lastDateOfPay } = req.body;

    if(!eventName || !eventDate || !venue || !amtPerPerson || !description || !time || !lastDateOfPay ) {
        res.status(400);
        throw new ApiError("Please fill all the fields");
    }

    const event = await Event.create({
        eventName,
        eventDate,
        venue,
        amtPerPerson,
        description,
        time,
        lastDateOfPay,
        // isReady
    })

    if(!event){
        throw new ApiError("Event not created", 400);
    }

    return res
    .status(201)
    .json(new ApiResponse("Event created successfully", event, true));
});

const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find();

    if(!events){
        throw new ApiError("No events found", 400);
    }

    return res
    .status(200)
    .json(new ApiResponse("Events found successfully", events, true));
})

const deleteEvent = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const eventExists = await Event.findById({_id : id})
    
    if(!eventExists){
        throw new ApiError("Event does not exist " , 400)
    }
    
    const event = await Event.findByIdAndDelete(id);

    console.log(event)

    if(!event){
        throw new ApiError("Event not found", 400);
    }

    return res
    .status(200)
    .json(new ApiResponse("Event deleted successfully", event, true));

    
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
        throw new ApiError("Event not updated", 400);
    }

    return res
    .status(200)
    .json(new ApiResponse("Event updated successfully" , event , true ));
})

const toggleResponseToEvent = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if(!id){
        throw new ApiError("Event id not found", 400);
    }

    const event = await Event.findById(id);
    
    if (!event) {
        throw new ApiError("Event not found", 404);
    }

    // Toggle the isReady field based on current value
    event.isReady = !event.isReady;
    if(event.isReady === true){
        event.totalHouseReady++;
    }

    // Save the updated event
    await event.save();

    return res
    .status(200)
    .json(new ApiResponse("Response submitted successfully" , event , true ));

}) 


export { createEvent , getAllEvents , deleteEvent , updateEvent , toggleResponseToEvent }