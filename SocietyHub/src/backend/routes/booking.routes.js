import {Booking} from "../models/booking.models.js";
import {Router} from "express";
import { createBooking, getBookings, deleteBooking } from "../controllers/booking.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.route("/new-booking").post(verifyJWT,createBooking);
router.route("/all-bookings").get(getBookings);
router.route("/delete").delete(verifyJWT,deleteBooking); 

export default router 