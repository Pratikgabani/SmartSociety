import {Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createVisitor, getAllVisitors,removeVisitor} from "../controllers/visitor.controllers.js";

const router = Router();

router.route("/createVisitor").post(verifyJWT, createVisitor);
router.route("/getAllVisitors").get(verifyJWT, getAllVisitors);
router.route("/removeVisitor/:id").delete(verifyJWT, removeVisitor);

export default router