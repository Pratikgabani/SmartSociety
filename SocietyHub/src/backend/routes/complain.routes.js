import {Router} from "express";
import { createComplain, deleteComplain, getAllEvents } from "../controllers/complain.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {upload} from "./../middlewares/multer.middlewares.js"
const router = Router();

router.route("/createComplain").post(verifyJWT, upload.single("proof"), createComplain);
router.route("/delete").delete(verifyJWT , deleteComplain);
router.route("/getAllComplains").get(verifyJWT , getAllEvents);

export default router