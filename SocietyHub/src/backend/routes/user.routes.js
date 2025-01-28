import User from "../models/user.models.js";
import {registerUser} from "../controllers/user.controllers.js";
import {Router} from "express";

const router = require("express").Router();

router.route("/register").post(registerUser);

export default router
