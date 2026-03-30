import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { 
    requestRefund, 
    getPendingRefunds, 
    approveRefund, 
    rejectRefund 
} from "../controllers/refund.controllers.js";

const router = Router();

// User routes
router.route("/:id").post(verifyJWT, requestRefund);

// Admin routes
router.route("/admin/all").get(verifyJWT, getPendingRefunds);
router.route("/admin/:id/approve").post(verifyJWT, approveRefund);
router.route("/admin/:id/reject").post(verifyJWT, rejectRefund);

export default router;
