import mongoose , {Schema} from "mongoose";

const pollSchema = new Schema({
    question : {
        type : String,
        required : true
    },
    options : [
        {
            option : {
                type : String,
                required : true
            },
            votes : {
                type : Number,
                default : 0
            }
        }
    ],
    totalVotes : {
        type : Number,
        default : 0
    },
    date : {
        type : Date,
        required : true
    },
    isClosed : {
        type : Boolean,
        default : false
    },
    owner : {
        type : String,
        required : true
    }
    })

    export const Poll = mongoose.model("Poll" , pollSchema)