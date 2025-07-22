import { Expense } from "../models/expense.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";


const createExpense = asyncHandler(async(req , res , next) =>{
    const {subject , amount } = req.body;
    if(!subject || !amount ){
        throw new ApiError(404 , "Provide subject and amount !!")
    }

    let proof = null;
    if (req.file) {
        try {
            proof = await uploadOnCloudinary(req.file.path);
            // console.log("Proof uploaded", proof);
        } catch (error) {
            // console.log("Error uploading proof", error);
            throw new ApiError(500, "Failed to upload proof");
        }
    }
  
    try {
        // console.log("helll")
        const expense = await Expense.create({
            subject,
            proof : proof?.url,
            uploadedBy : req.user._id,
            amount ,
            paidOn : new Date().toLocaleDateString(),
            societyId : req.user?.societyId 
        })
        // console.log("hwlwjf"); 
        if(!expense){
            throw new ApiError(400 , "Can't create expense")
        }
        return res
        .status(200)
        .json(new ApiResponse(200 , expense , "Expense uploaded successfully"))
    } catch (error) {
        if(proof){
            await deleteFromCloudinary(proof.public_id)
        }
        next(new ApiError(400 , "Error creating expense"))
    }
})

const getAllExpense = asyncHandler(async(req , res ) =>{
    const allExpenses =await Expense.find({societyId : req.user.societyId})

    if(!allExpenses){
        throw new ApiError(400 , "No expenses found !")
    }

    res
    .status(200)
    .json(new ApiResponse(200 , allExpenses , "Expenses fetched successfully "))
})

const deleteExpenseById = asyncHandler(async(req , res) =>{
    const {expenseId} = req.params;
    if(!expenseId){
        throw new ApiError(400 , "Enter the expense id ")
    }

    const expenses = await Expense.findByIdAndDelete(expenseId);
    if(!expenses){
        throw new ApiError(400 , "Expenses not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , expenses , "Expense deleted successfully"))
})

export {createExpense , getAllExpense , deleteExpenseById}