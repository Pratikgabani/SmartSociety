import {createSocietyDetail} from "../controllers/societyDetail.controllers.js"
import {Router} from "express" 

const router = Router();

router.route("/createSocietyDetail").post( createSocietyDetail);

export default router 