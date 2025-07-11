import {
    createEvent,
    getAllEvents,
    deleteEvent,
    updateEvent,
    toggleResponse,
    getUpcomingEvents,
    getPastEvents,
    payEvent,
    saveEventOrder,
    paymentStatus
} from "../controllers/event.controllers.js";
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();
router.route("/createEvent").post(verifyJWT, createEvent);
router.route("/getAllEvent").get(verifyJWT, getAllEvents);
router.route("/deleteEvent/:id").delete(verifyJWT, deleteEvent);
router.route("/updateEvent/:id").patch(verifyJWT, updateEvent);
router.route("/toggleResponse/:eventId").put(verifyJWT, toggleResponse);
router.route("/getUpcomingEvents").get(verifyJWT, getUpcomingEvents);
router.route("/getPastEvents").get(verifyJWT, getPastEvents);
router.post('/payEvent/:eventId', verifyJWT, payEvent);
router.post('/save-event-order', verifyJWT, saveEventOrder);
router.get('/paymentStatus/:eventId', verifyJWT, paymentStatus);

export default router 