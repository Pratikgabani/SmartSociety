import {
    createEvent,
} from "../controllers/event.controllers.js";
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();
router.route("/createEvent").post(verifyJWT, createEvent);

export default router