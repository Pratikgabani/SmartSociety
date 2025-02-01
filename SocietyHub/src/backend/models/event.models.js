// event:
// eventname
// eventDate
// venue,
// amt.perPerson
// totalHouseReady
// description
// time
// lastdateOfPay
// isReady
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
    isReady : {
        type : Boolean,
        required : true,
        default : false
    },
    category : {
        type : String,
        required : true
    }
})

export const Event =  mongoose.model("Event", eventSchema);