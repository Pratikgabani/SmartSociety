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
            },
            percent : {
                type : Number,
                default : 0
            },
            voting : [
                {type : mongoose.Schema.Types.ObjectId, ref : "User"}
            ]
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
    },

    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    })

    export const Poll = mongoose.model("Poll" , pollSchema)

    // const pollSchema = new mongoose.Schema({
    //     question: String,
    //     options: [{ option: String, votes: { type: Number, default: 0 } }],
    //     totalVotes: { type: Number, default: 0 },
    //     voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Track voters
    // });
    