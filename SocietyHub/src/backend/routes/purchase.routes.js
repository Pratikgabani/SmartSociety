import express from "express";
import { getPaymentFromPurchase ,getPaymentPurchase} from "../controllers/purchase.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/getAllPurchases").get(verifyJWT, getPaymentPurchase);
router.route("/getPaymentPurchase").get(verifyJWT, getPaymentPurchase);

export default router;