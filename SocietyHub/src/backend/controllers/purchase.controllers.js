import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Purchase } from "../models/purchase.models .js";
import { asyncHandler } from "../utils/asyncHandler.js";




const getPaymentPurchase = asyncHandler(async (req, res) => {
   const userId = req.user._id;
//    console.log(userId);
    const purchase = await Purchase.find({userId}).select("-__v -_id -updatedAt -userId").populate("paymentId"," description dueDate amount ");
    // console.log(purchase);
    if (!purchase) {
        throw new ApiError(404, "Purchase not found"); 
    }
    return res.status(200).json(new ApiResponse(true,purchase, "Payment found"));
});
const getPaymentFromPurchase = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch purchase data with description populated from paymentId
  const rawPurchases = await Purchase.find({ userId })
    .select("-__v -_id -updatedAt -userId")
    .populate("paymentId", "description -_id");

  if (!rawPurchases || rawPurchases.length === 0) {
    throw new ApiError(404, "Purchase not found");
  }

  // Flatten paymentId to just the description string
  const cleanedPurchases = rawPurchases.map((entry) => {
    const obj = entry.toObject();
    return {
      ...obj,
      paymentId: obj.paymentId?.description || ""  // flattening
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(true, cleanedPurchases, "Payment found"));
});

export { getPaymentFromPurchase,getPaymentPurchase };