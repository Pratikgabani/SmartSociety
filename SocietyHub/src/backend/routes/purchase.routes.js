import express from "express";
import { getPaymentFromPurchase } from "../controllers/purchase.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/getAllPurchases").get(verifyJWT, getPaymentFromPurchase);

export default router;