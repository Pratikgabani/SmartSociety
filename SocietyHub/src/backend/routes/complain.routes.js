import {Router} from "express";
import { createComplain, deleteComplain, getAllEvents } from "../controllers/complain.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/createComplain").post(verifyJWT , createComplain);
router.route("/delete").delete(verifyJWT , deleteComplain);
router.route("/getAllComplains").get(verifyJWT , getAllEvents);

export default router