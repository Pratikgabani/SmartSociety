import {Router} from "express";
import { createComplain,getComplains , deleteComplain, getAllComplains , toggleComplain} from "../controllers/complain.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {upload} from "./../middlewares/multer.middlewares.js"
const router = Router();
router.route("/getComplains").get(verifyJWT , getComplains);
router.route("/createComplain").post(verifyJWT, upload.single("proof"), createComplain);
router.route("/deleteComplain/:complainId").delete(verifyJWT , deleteComplain);
router.route("/getAllComplains").get(verifyJWT , getAllComplains);
router.route("/toggleComplain/:complainId").patch(verifyJWT , toggleComplain);

export default router