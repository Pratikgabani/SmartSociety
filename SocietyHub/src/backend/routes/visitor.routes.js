import {Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createVisitor, getAllVisitors,removeVisitor, getVisitorById, getRecentVisitors, getRecentVisitorsByUserId} from "../controllers/visitor.controllers.js";

const router = Router();

router.route("/createVisitor").post(verifyJWT, createVisitor);
router.route("/getAllVisitors").get( verifyJWT,getAllVisitors);
router.route("/removeVisitor/:id").get(verifyJWT, removeVisitor);
router.route("/getVisitor").get(verifyJWT, getVisitorById);
router.route("/getRecentVisitors").get(verifyJWT, getRecentVisitors);
router.route("/getRecentVisitorsByUserId").get(verifyJWT, getRecentVisitorsByUserId);



export default router