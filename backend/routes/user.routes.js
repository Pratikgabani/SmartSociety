import {User} from "../models/user.models.js";
import {registerUser, loginUser , logoutUser , getUserDetail ,updateAccountDetails, changeCurrentPassword, refreshAccessToken, sendOtp, resendOtp, verifyOtp, completeRegistration, forgotPassword, verifyForgotPasswordOtp, resetPassword} from "../controllers/user.controllers.js";
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT , logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/currentUser").get(verifyJWT , getUserDetail);
router.route("/changePassword").post(verifyJWT , changeCurrentPassword);
router.route("/updateAccountDetails").patch(verifyJWT , updateAccountDetails);

// OTP-based email verification routes (used during registration)
router.route("/send-otp").post(sendOtp);
router.route("/resend-otp").post(resendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/complete-registration").post(completeRegistration);

// Forgot Password routes
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-forgot-password-otp").post(verifyForgotPasswordOtp);
router.route("/reset-password").post(resetPassword);

export default router
