import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getMonthlyReport, exportMonthlyReport } from "../controllers/task.controller";
import { validateRequest } from "../middleware/validateRequest";
import { taskFiltersSchema } from "../schemas/task.schema";

const router = Router();

router.get("/monthly", authenticate, validateRequest(taskFiltersSchema), getMonthlyReport);
router.get("/monthly/export", authenticate, validateRequest(taskFiltersSchema), exportMonthlyReport);

export default router;
