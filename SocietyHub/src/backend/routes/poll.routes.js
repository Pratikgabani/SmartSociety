import { createPoll , getAllPolls , deletePoll , votePoll} from "../controllers/poll.controllers.js";
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/createPoll").post(verifyJWT, createPoll);
router.route("/getAllPolls").get(verifyJWT, getAllPolls);
router.route("/deletePoll/:pollId").delete(verifyJWT, deletePoll);
router.route("/votePoll/:pollId/:optionId").patch(verifyJWT, votePoll);
export default router