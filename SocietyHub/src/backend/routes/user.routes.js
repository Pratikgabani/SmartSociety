import {User} from "../models/user.models.js";
import {registerUser, loginUser} from "../controllers/user.controllers.js";
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(verifyJWT,loginUser);
export default router
