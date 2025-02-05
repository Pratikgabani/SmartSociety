import {createSocietyDetail} from "../controllers/societyDetail.controllers.js"
import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/createSocietyDetail").post( createSocietyDetail);

export default router