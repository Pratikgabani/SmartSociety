import { Router } from "express" // 7
import { googleAuth } from "../controllers/user.controllers.js"
import { authLimiter } from "../middlewares/rateLimit.middlewares.js"

const router = Router()

router.route("/google").get(authLimiter, googleAuth)


export default router