import {User} from "../models/user.models.js";
import {registerUser, loginUser , logoutUser , getUserDetail ,updateAccountDetails, changeCurrentPassword} from "../controllers/user.controllers.js";
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT , logoutUser);
router.route("/currentUser").get(verifyJWT , getUserDetail);
router.route("/changePassword").post(verifyJWT , changeCurrentPassword);
router.route("/updateAccountDetails").patch(verifyJWT , updateAccountDetails);
export default router
