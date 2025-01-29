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


export { createEvent }