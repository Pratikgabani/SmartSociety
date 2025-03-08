import { mongoose , Schema} from "mongoose"

const expenseSchema = new Schema({
    subject :{
        type : String ,
        required : true
    },
    proof : {
        type : String ,
        required : true 
    },
    uploadedBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    amount : {
        type : Number,
        required : true
    },
    paidOn : {
        type : String , 
        required : true 
    },
    societyId :{
        type : String , 
        required : true
    }

} , {timestamps : true})

export const Expense = mongoose.model("Expense" , expenseSchema)