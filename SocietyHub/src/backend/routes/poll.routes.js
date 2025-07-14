import { createPoll , getAllPolls , deletePoll , votePoll ,getPolls, closePoll} from "../controllers/poll.controllers.js";
import {Router} from "express";
import { allowRole, verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/createPoll").post(verifyJWT,allowRole("admin") , createPoll);
router.route("/getAllPolls").get(verifyJWT, getAllPolls);
router.route("/deletePoll/:pollId").delete(verifyJWT, deletePoll);
router.route("/votePoll/:pollId/:optionId").patch(verifyJWT , votePoll);
router.route("/closePoll/:pollId" ).patch(verifyJWT , closePoll);
router.route("/getPolls").get(verifyJWT , getPolls);

export default router