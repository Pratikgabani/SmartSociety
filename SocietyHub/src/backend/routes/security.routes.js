import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { registerSecurity, loginSecurity, logoutSecurity} from "../controllers/security.controllers.js";

const router = Router();

router.route("/registerSecurity").post( registerSecurity);
router.route("/loginSecurity").post( loginSecurity);
router.route("/logoutSecurity").post(verifyJWT, logoutSecurity);

export default router