import {Booking} from "../models/booking.models.js";
import {Router} from "express";
import { createBooking, getBookings, deleteBooking , bookingStatus , createVenue , getVenue , getBookingsByUserId} from "../controllers/booking.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.route("/new-booking").post(verifyJWT,createBooking);
router.route("/all-bookings").get(getBookings);
router.route("/delete/:bookingId").delete(verifyJWT,deleteBooking); 
router.route("/bookingStatus/:bookingId").patch(verifyJWT, bookingStatus);
router.route("/createVenue").post(verifyJWT, createVenue);
router.route("/getVenue").get(getVenue);
router.route("/getBookingsByUserId").get(verifyJWT, getBookingsByUserId);
export default router 