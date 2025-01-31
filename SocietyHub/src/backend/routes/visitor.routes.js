import {Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createVisitor} from "../controllers/visitor.controllers.js";

const router = Router();

router.route("/createVisitor").post(verifyJWT, createVisitor);

export default router