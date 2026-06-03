import { Router } from "express";
import {
  addDependency,
  assignTaskToUser,
  createTask,
  exportTasks,
  getProgressSummary,
  getTaskById,
  listTasks,
  setTaskStatus,
  updateTask,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import {
  addDependencySchema,
  assignTaskSchema,
  createTaskSchema,
  taskFiltersSchema,
  taskStatusUpdateSchema,
  updateTaskSchema,
} from "../schemas/task.schema";

const router = Router();

router.post("/", authenticate, validateRequest(createTaskSchema), createTask);
router.get("/", authenticate, validateRequest(taskFiltersSchema), listTasks);
router.get("/export", authenticate, validateRequest(taskFiltersSchema), exportTasks);
router.get("/summary", authenticate, getProgressSummary);
router.get("/:taskId", authenticate, getTaskById);
router.patch("/:taskId", authenticate, validateRequest(updateTaskSchema), updateTask);
router.patch("/:taskId/status", authenticate, validateRequest(taskStatusUpdateSchema), setTaskStatus);
router.post("/:taskId/dependencies", authenticate, validateRequest(addDependencySchema), addDependency);
router.patch("/:taskId/assign", authenticate, validateRequest(assignTaskSchema), assignTaskToUser);

export default router;
