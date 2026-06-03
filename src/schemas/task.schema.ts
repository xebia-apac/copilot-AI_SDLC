import { z } from "zod";

export const createTaskSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"]).default("TODO"),
  assigneeId: z.string().uuid().optional(),
  estimatedCompletionDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"]).optional(),
  assigneeId: z.string().uuid().optional(),
  estimatedCompletionDate: z.string().optional(),
});

export const addDependencySchema = z.object({
  dependsOnTaskId: z.string().min(1, "Dependency task ID is required"),
});

export const taskStatusUpdateSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"]),
  note: z.string().optional(),
});

export const assignTaskSchema = z.object({
  assigneeId: z.string().uuid("Invalid assignee ID"),
});

export const taskFiltersSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  assigneeId: z.string().uuid().optional(),
  dueDateBefore: z.string().optional(),
  dueDateAfter: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type AddDependencyInput = z.infer<typeof addDependencySchema>;
export type TaskStatusUpdateInput = z.infer<typeof taskStatusUpdateSchema>;
export type TaskFilters = z.infer<typeof taskFiltersSchema>;
