import { Order } from "../models/order.model.js";
import  {Purchase}  from "../models/purchase.models .js";

 const orderData = async (req, res) => {
  const order = req.body;
  try {
    const orderInfo = await Order.create(order);
    // console.log(orderInfo);
    const userId = orderInfo?.userId;
    const paymentId = orderInfo?.paymentId;
    const paidOn = orderInfo?.paidOn;
   
    const paymentDoneId = orderInfo?.paymentDoneId;
    if (orderInfo) {
    const purchase =  await Purchase.create({ userId, paymentId, paidOn, paymentDoneId });
    if (!purchase) {
      throw new ApiError(500, "Failed to create purchase");
    }
    }

    res.status(201).json({ message: "Order Details: ", orderInfo });
   
  } catch (error) {
    // console.log("Error in order: ", error);
    res.status(401).json({ errors: "Error in order creation" });
  }
};

export {orderData};