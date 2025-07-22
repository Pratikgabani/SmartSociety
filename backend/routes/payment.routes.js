import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createPayment , getPayments , getUserPayments , getAdminData, deletePayment , updatePayment, payPayment} from "../controllers/payment.controllers.js";

const router = Router();
 router.route("/getAdminData").get(verifyJWT, getAdminData);
router.route("/createPayment").post(verifyJWT, createPayment);
router.route("/getPayments").get(verifyJWT, getPayments);
router.route("/getUserPayments/:userId").get(verifyJWT, getUserPayments);       
// router.route("/markPaymentAsPaid/:paymentId").patch(verifyJWT, markPaymentAsPaid);  
router.route("/deletePayment/:paymentId").delete(verifyJWT, deletePayment);
router.route("/updatePayment/:paymentId").patch(verifyJWT, updatePayment);
router.route("/payPayment/:paymentId").post(verifyJWT, payPayment);

export default router