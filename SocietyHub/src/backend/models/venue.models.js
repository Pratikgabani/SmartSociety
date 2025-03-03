import mongoose , {Schema} from "mongoose";

const venueSchema = new Schema({
    venue : {
        type : String , 
        required : true
    },
    description : {
        type : String,
        required : true
    },
    amenities: {
        type: [String],
        required: true
      },
    capacity : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    societyId : {
        type : String,
        required : true
    }
})

export const Venue = mongoose.model("Venue" , venueSchema)
