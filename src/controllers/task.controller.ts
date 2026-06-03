import { Request, Response } from "express";
import {
  addTaskDependency,
  assignTask,
  createNewTask,
  findTasks,
  getMonthlyReport as fetchMonthlyReport,
  getProjectProgressSummary,
  getTask,
  serializeMonthlyReportToCsv,
  serializeTasksToCsv,
  updateTaskStatus,
  updateExistingTask,
} from "../services/task.service";
import type { CreateTaskInput, TaskStatusUpdateInput, TaskFilters, UpdateTaskInput, AddDependencyInput } from "../schemas/task.schema";

export async function createTask(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateTaskInput;
  const task = await createNewTask(input);
  res.status(201).json({ success: true, data: task, error: null, meta: null });
}

export async function listTasks(req: Request, res: Response): Promise<void> {
  const filters = req.query as TaskFilters;
  const tasks = await findTasks(filters);
  res.json({ success: true, data: tasks, error: null, meta: null });
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  const taskId = req.params.taskId;
  const task = await getTask(taskId);
  res.json({ success: true, data: task, error: null, meta: null });
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const taskId = req.params.taskId;
  const input = req.body as UpdateTaskInput & { note?: string };
  const task = await updateExistingTask(taskId, input);
  res.json({ success: true, data: task, error: null, meta: null });
}

export async function setTaskStatus(req: Request, res: Response): Promise<void> {
  const taskId = req.params.taskId;
  const input = req.body as TaskStatusUpdateInput;
  const userId = res.locals.user?.id as string;
  const task = await updateTaskStatus(taskId, input.status, userId, input.note);
  res.json({ success: true, data: task, error: null, meta: null });
}

export async function addDependency(req: Request, res: Response): Promise<void> {
  const taskId = req.params.taskId;
  const input = req.body as AddDependencyInput;
  const task = await addTaskDependency(taskId, input.dependsOnTaskId);
  res.json({ success: true, data: task, error: null, meta: null });
}

export async function assignTaskToUser(req: Request, res: Response): Promise<void> {
  const taskId = req.params.taskId;
  const assigneeId = req.body.assigneeId as string;
  const task = await assignTask(taskId, assigneeId);
  res.json({ success: true, data: task, error: null, meta: null });
}

export async function getProgressSummary(_req: Request, res: Response): Promise<void> {
  const summary = await getProjectProgressSummary();
  res.json({ success: true, data: summary, error: null, meta: null });
}

export async function exportTasks(req: Request, res: Response): Promise<void> {
  const filters = req.query as TaskFilters;
  const tasks = await findTasks(filters);
  const csv = serializeTasksToCsv(tasks);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=tasks-export.csv");
  res.send(csv);
}

export async function getMonthlyReport(req: Request, res: Response): Promise<void> {
  const { month, year } = req.query as unknown as { month?: string; year?: string };
  const report = await fetchMonthlyReport(month ? Number(month) : undefined, year ? Number(year) : undefined);
  res.json({ success: true, data: report, error: null, meta: null });
}

export async function exportMonthlyReport(req: Request, res: Response): Promise<void> {
  const { month, year } = req.query as unknown as { month?: string; year?: string };
  const report = await fetchMonthlyReport(month ? Number(month) : undefined, year ? Number(year) : undefined);
  const csv = serializeMonthlyReportToCsv(report as any);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=monthly-report.csv");
  res.send(csv);
}
