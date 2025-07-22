import express from "express";
import { orderData } from "../controllers/order.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/").post(verifyJWT, orderData);

export default router;