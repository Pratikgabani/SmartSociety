import { Router } from "express"
import { googleAuth } from "../controllers/user.controllers.js"

const router = Router()

router.route("/google").get(googleAuth)


export default router