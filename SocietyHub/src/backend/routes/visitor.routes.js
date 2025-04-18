import {Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { updateVisitorDuration,createVisitor,getHisAllRecentVisitors, getHisRecentVisitorsByUserId, getActiveVisitors,removeVisitor,deleteVisitor, getVisitorById, getRecentVisitors, getRecentVisitorsByUserId , getActiveVisitorsByUserId} from "../controllers/visitor.controllers.js";

const router = Router();

router.route("/createVisitor").post( verifyJWT,createVisitor);
router.route("/getActiveVisitors").get( verifyJWT,getActiveVisitors);
router.route("/removeVisitor/:id").get(verifyJWT, removeVisitor);
router.route("/getVisitor").get(verifyJWT, getVisitorById);
router.route("/getRecentVisitors").get(verifyJWT, getRecentVisitors);
router.route("/getRecentVisitorsByUserId").get(verifyJWT, getRecentVisitorsByUserId);
router.route("/getActiveVisitorsByUserId").get(verifyJWT, getActiveVisitorsByUserId);
router.route("/deleteVisitor/:id").delete(verifyJWT, deleteVisitor);
router.route("/updateVisitorDuration/:id").patch(verifyJWT, updateVisitorDuration);
router.route("/getHisRecentVisitorsByUserId").get(verifyJWT, getHisRecentVisitorsByUserId);
router.route("/getHisAllRecentVisitors").get(verifyJWT, getHisAllRecentVisitors);
export default router