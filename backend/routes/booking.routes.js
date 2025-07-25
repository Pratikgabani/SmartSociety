import {Booking} from "../models/booking.models.js";
import {Router} from "express";
import { createBooking, getBookings, deleteBooking ,
    // bookingStatus,
     createVenue , getVenue , getBookingsByUserId, getPastBookings, getPastBookingsByUserId, getUpcomingBookingsByUserId,
     deleteVenue,payBooking, saveBookingOrder} from "../controllers/booking.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.route("/new-booking").post(verifyJWT,createBooking);
router.route("/all-bookings").get(verifyJWT,getBookings);
router.route("/delete/:bookingId").delete(verifyJWT,deleteBooking); 
// router.route("/bookingStatus/:bookingId").patch(verifyJWT, bookingStatus);
router.route("/createVenue").post(verifyJWT, createVenue);
router.route("/getVenue").get(verifyJWT, getVenue);
router.route("/deleteVenue/:venueId").delete(verifyJWT, deleteVenue);
router.route("/getBookingsByUserId").get(verifyJWT, getBookingsByUserId);
router.route("/getPastBookings").get(verifyJWT , getPastBookings)
router.route("/getPastBookingsByUserId").get(verifyJWT , getPastBookingsByUserId)
router.route("/getUpcomingBookingsByUserId").get(verifyJWT , getUpcomingBookingsByUserId)
router.post('/save-booking-order', verifyJWT, saveBookingOrder);
router.post('/payBooking/:bookingId', verifyJWT, payBooking);
export default router 