
import mongoose , {Schema} from 'mongoose'

const eventSchema = new Schema({

    eventName : {
        type : String,
        required : true,
        unique : true
    },
    eventDate : {
        type : Date,
        required : true,
        unique : true
    },
    venue : {
        type : String,
        required : true
    },
    amtPerPerson : {
        type : Number,
        required : true
    },
    totalHouseReady : {
        type : Number,
        required : true,
        default : 0
    },
    description : {
        type : String,
        required : true
    },
    time : {
        type : String,
        required : true
    },
    lastDateOfPay : {
        type : Date,
        required : true
    },
    readyUsers : [
        {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    category : {
        type : String,
        required : true
    },
    societyId : {
    type : String,
    }
} , {
    timestamps : true
})

export const Event =  mongoose.model("Event", eventSchema);