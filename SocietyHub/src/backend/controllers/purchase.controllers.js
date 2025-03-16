import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Purchase } from "../models/purchase.models .js";
import { asyncHandler } from "../utils/asyncHandler.js";




const getPaymentFromPurchase = asyncHandler(async (req, res) => {
   const userId = req.user._id;
   console.log(userId);
    const purchase = await Purchase.find({userId}).populate("paymentId","amount description dueDate");
    console.log(purchase);
    if (!purchase) {
        throw new ApiError(404, "Purchase not found"); 
    }
    return res.status(200).json(new ApiResponse(true,purchase, "Payment found"));
});

export { getPaymentFromPurchase };