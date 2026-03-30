import {User} from "../models/user.models.js";
import {registerUser, loginUser , logoutUser , getUserDetail ,updateAccountDetails, changeCurrentPassword, refreshAccessToken, sendOtp, resendOtp, verifyOtp, completeRegistration, forgotPassword, verifyForgotPasswordOtp, resetPassword} from "../controllers/user.controllers.js";
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { authLimiter } from "../middlewares/rateLimit.middlewares.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(authLimiter, loginUser);
router.route("/logout").post(verifyJWT , logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/currentUser").get(verifyJWT , getUserDetail);
router.route("/changePassword").post(verifyJWT , changeCurrentPassword);
router.route("/updateAccountDetails").patch(verifyJWT , updateAccountDetails);

// OTP-based email verification routes (used during registration)
router.route("/send-otp").post(authLimiter, sendOtp);
router.route("/resend-otp").post(authLimiter, resendOtp);
router.route("/verify-otp").post(authLimiter, verifyOtp);
router.route("/complete-registration").post(completeRegistration);

// Forgot Password routes
router.route("/forgot-password").post(authLimiter, forgotPassword);
router.route("/verify-forgot-password-otp").post(authLimiter, verifyForgotPasswordOtp);
router.route("/reset-password").post(authLimiter, resetPassword);

export default router
