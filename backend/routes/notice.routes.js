import { Router } from "express";
import { addNotice, getNotices, deleteNotice,getAllNotices } from "../controllers/notice.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/addNotice").post(verifyJWT, addNotice);
router.route("/getNotices").get(verifyJWT, getNotices); 
router.route("/deleteNotice/:id").patch(verifyJWT, deleteNotice);
router.route("/getAllNotices").get(verifyJWT, getAllNotices);
export default router