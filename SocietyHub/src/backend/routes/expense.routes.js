import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { createExpense , getAllExpense , deleteExpenseById} from "../controllers/expense.controllers.js";
const router = Router()

router.route("/createExpense").post(verifyJWT , upload.single("proof") , createExpense);
router.route("/getAllExpense").get(verifyJWT , getAllExpense)
router.route("/deleteExpenseById/:expenseId").delete(verifyJWT , deleteExpenseById)
export default router