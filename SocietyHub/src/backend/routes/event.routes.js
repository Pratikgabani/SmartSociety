import {
    createEvent,
    getAllEvents,
    deleteEvent,
    updateEvent,
    toggleResponseToEvent
} from "../controllers/event.controllers.js";
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();
router.route("/createEvent").post(verifyJWT, createEvent);
router.route("/getAllEvent").get(verifyJWT, getAllEvents);
router.route("/deleteEvent").delete(verifyJWT, deleteEvent);
router.route("/updateEvent/:id").patch(verifyJWT, updateEvent);
router.route("/toggleResponse/:id").patch(verifyJWT, toggleResponseToEvent);
export default router