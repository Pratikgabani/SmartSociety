import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createPayment , getPayments , getUserPayments , markPaymentAsPaid , deletePayment , updatePayment} from "../controllers/payment.controllers.js";

const router = Router();

router.route("/createPayment").post(verifyJWT, createPayment);
router.route("/getPayments").get(verifyJWT, getPayments);
router.route("/getUserPayments/:userId").get(verifyJWT, getUserPayments);       
router.route("/markPaymentAsPaid/:paymentId").patch(verifyJWT, markPaymentAsPaid);  
router.route("/deletePayment/:paymentId").delete(verifyJWT, deletePayment);
router.route("/updatePayment/:paymentId").patch(verifyJWT, updatePayment);

export default router