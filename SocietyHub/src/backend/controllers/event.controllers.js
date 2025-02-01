import { User } from "../models/user.models.js";
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

    const event = await Event.create({
        eventName,
        eventDate,
        venue,
        amtPerPerson,
        description,
        time,
        lastDateOfPay,
        category
    })

    if(!event){
        throw new ApiError( 400 ,"Event not created");
    }

    return res
    .status(201)
    .json(new ApiResponse("Event created successfully", event, true));
});

const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find()
    console.log(events)
    if(!events){
        return new ApiError( 500 ,"No events found" );
    }
    // if(!events){
    //     throw new ApiError("No events found", 500);
    // }

    return res
    .status(200)
    .json(new ApiResponse("Events found successfully", events, true));
})

const deleteEvent = asyncHandler(async (req, res) => {
    const {eventName} = req.body;

   if(!eventName.trim()){
    throw new ApiError(400 ,"Please enter event name" )
   }

   const eventExists = await Event.findOne({eventName : eventName})
    
    if(!eventExists){
        throw new ApiError(400 ,"Event does not exist " )
    }
    
    const event = await Event.findByIdAndDelete(eventExists._id);

    console.log(event)

    if(!event){
        throw new ApiError(400 ,"Event not found" );
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
        throw new ApiError(400 ,"Event not updated" );
    }

    return res
    .status(200)
    .json(new ApiResponse("Event updated successfully" , event , true ));
})

const toggleResponseToEvent = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if(!id){
        throw new ApiError( 400 ,"Event id not found");
    }

    const event = await Event.findById(id);
    
    if (!event) {
        throw new ApiError(404 ,"Event not found");
    }

    // Toggle the isReady field based on current value
    event.isReady = !event.isReady;
    // const count = 0
    if(event.isReady === true){
        event.totalHouseReady--;
        // count++;
        event.isReady = false
    }else{
        event.totalHouseReady++;
        // count++;
        event.isReady = true
    }

    // Save the updated event
    await event.save();

    return res
    .status(200)
    .json(new ApiResponse("Response submitted successfully" , event , true ));

}) 


export { createEvent , getAllEvents , deleteEvent , updateEvent , toggleResponseToEvent }