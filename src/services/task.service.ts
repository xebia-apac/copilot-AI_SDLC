import { ApiError } from "../errors/ApiError";
import {
  createTask,
  createTaskDependency,
  createTaskStatusHistory,
  getDependenciesForTask,
  getTaskByKey,
  listTasks,
  updateTask,
  countTasksByStatus,
  countAllTasks,
  countTasksCreatedInRange,
  countTasksCompletedInRange,
  countTasksDueInRange,
  TaskFilter,
} from "../repositories/task.repository";
import { findUserById } from "../repositories/user.repository";
import type { Priority, TaskStatus } from "@prisma/client";

function parseDate(value?: string) {
  return value ? new Date(value) : undefined;
}

async function verifyAssignee(assigneeId?: string) {
  if (!assigneeId) return undefined;
  const assignee = await findUserById(assigneeId);
  if (!assignee) {
    throw new ApiError("Assignee not found", 404, "ASSIGNEE_NOT_FOUND");
  }
  return assignee.id;
}

export async function createNewTask(input: {
  taskId: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  assigneeId?: string;
  estimatedCompletionDate?: string;
}) {
  const assigneeId = await verifyAssignee(input.assigneeId);
  const task = await createTask({
    taskKey: input.taskId,
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: input.status,
    estimatedCompletionDate: parseDate(input.estimatedCompletionDate),
    assigneeId,
  });
  return task;
}

export async function getTask(taskId: string) {
  const task = await getTaskByKey(taskId);
  if (!task) {
    throw new ApiError("Task not found", 404, "TASK_NOT_FOUND");
  }
  return task;
}

export async function updateExistingTask(taskId: string, input: {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  assigneeId?: string;
  estimatedCompletionDate?: string;
  note?: string;
  changedById?: string;
}) {
  const task = await getTask(taskId);
  const assigneeId = input.assigneeId ? await verifyAssignee(input.assigneeId) : task.assigneeId ?? undefined;
  const updateData: any = {
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: input.status,
    assigneeId,
    estimatedCompletionDate: parseDate(input.estimatedCompletionDate),
  };

  if (input.status && input.status !== task.status) {
    const changedById = input.changedById ?? task.assigneeId;
    if (!changedById) {
      throw new ApiError("Status change requires a valid user context", 400, "MISSING_USER_CONTEXT");
    }
    await createTaskStatusHistory(task.id, task.status, input.status, changedById, input.note);
  }

  return updateTask(task.id, updateData);
}

export async function assignTask(taskId: string, assigneeId: string) {
  const task = await getTask(taskId);
  await verifyAssignee(assigneeId);
  return updateTask(task.id, { assigneeId });
}

export async function addTaskDependency(taskId: string, dependsOnTaskId: string) {
  const task = await getTask(taskId);
  const dependent = await getTask(dependsOnTaskId);
  if (task.id === dependent.id) {
    throw new ApiError("Task cannot depend on itself", 400, "INVALID_DEPENDENCY");
  }
  const dependencies = await getDependenciesForTask(task.id);
  if (dependencies.some((item) => item.dependsOnTaskId === dependent.id)) {
    throw new ApiError("Dependency already exists", 409, "DEPENDENCY_EXISTS");
  }
  await createTaskDependency(task.id, dependent.id);
  return getTask(taskId);
}

export async function updateTaskStatus(taskId: string, newStatus: TaskStatus, changedById: string, note?: string) {
  const task = await getTask(taskId);
  const dependencies = (await getDependenciesForTask(task.id)) as Array<{
    dependsOnTaskId: string;
    dependsOn: { status: string; taskKey: string };
  }>;
  const incompleteDependencies = dependencies.filter((item) => item.dependsOn.status !== "COMPLETED");

  if (newStatus === "IN_PROGRESS" && incompleteDependencies.length > 0) {
    throw new ApiError(
      "Task has incomplete dependencies and cannot move to In Progress until dependencies are completed",
      409,
      "DEPENDENCIES_BLOCKING",
      incompleteDependencies.map((item) => item.dependsOn.taskKey)
    );
  }

  if (newStatus === "COMPLETED" && incompleteDependencies.length > 0) {
    throw new ApiError(
      "Task has incomplete dependencies and cannot be marked completed until dependencies are completed",
      409,
      "DEPENDENCIES_BLOCKING",
      incompleteDependencies.map((item) => item.dependsOn.taskKey)
    );
  }

  const updated = await updateTask(task.id, { status: newStatus });
  await createTaskStatusHistory(task.id, task.status, newStatus, changedById, note);
  return updated;
}

export async function findTasks(filters: TaskFilter) {
  return listTasks(filters);
}

export async function getProjectProgressSummary() {
  const total = await countAllTasks();
  const statusCounts = await countTasksByStatus();
  const summary = statusCounts.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    },
    { TODO: 0, IN_PROGRESS: 0, BLOCKED: 0, COMPLETED: 0 }
  );
  return {
    totalTasks: total,
    completedTasks: summary.COMPLETED,
    inProgress: summary.IN_PROGRESS,
    blocked: summary.BLOCKED,
    pending: summary.TODO,
  };
}

function buildMonthRange(month?: number, year?: number) {
  const now = new Date();
  const reportMonth = month !== undefined ? month - 1 : now.getMonth();
  const reportYear = year ?? now.getFullYear();
  const start = new Date(Date.UTC(reportYear, reportMonth, 1, 0, 0, 0));
  const end = new Date(Date.UTC(reportYear, reportMonth + 1, 1, 0, 0, 0));
  return { start, end };
}

export async function getMonthlyReport(month?: number, year?: number) {
  const { start, end } = buildMonthRange(month, year);
  const tasksCreated = await countTasksCreatedInRange(start, end);
  const tasksCompleted = await countTasksCompletedInRange(start, end);
  const tasksDue = await countTasksDueInRange(start, end);
  const summary = await getProjectProgressSummary();

  return {
    reportMonth: start.toISOString(),
    tasksCreated,
    tasksCompleted,
    tasksDue,
    currentProjectSummary: summary,
  };
}

export function serializeMonthlyReportToCsv(report: { reportMonth: string; tasksCreated: number; tasksCompleted: number; tasksDue: number; currentProjectSummary: Record<string, number> }) {
  const rows = [
    ["Report Month", report.reportMonth],
    ["Tasks Created", report.tasksCreated.toString()],
    ["Tasks Completed", report.tasksCompleted.toString()],
    ["Tasks Due", report.tasksDue.toString()],
    ["Total Tasks", report.currentProjectSummary.totalTasks?.toString() ?? "0"],
    ["Completed Tasks", report.currentProjectSummary.completedTasks?.toString() ?? "0"],
    ["In Progress", report.currentProjectSummary.inProgress?.toString() ?? "0"],
    ["Blocked", report.currentProjectSummary.blocked?.toString() ?? "0"],
    ["Pending", report.currentProjectSummary.pending?.toString() ?? "0"],
  ];
  return rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")).join("\n");
}

export function serializeTasksToCsv(tasks: Array<{ taskKey: string; title: string; status: TaskStatus; priority: Priority; estimatedCompletionDate: Date | null; assignee?: { name: string | null } | null }>) {
  const headers = ["Task ID", "Title", "Status", "Priority", "Estimated Completion", "Assignee"];
  const rows = tasks.map((task) => [
    task.taskKey,
    task.title,
    task.status,
    task.priority,
    task.estimatedCompletionDate?.toISOString() ?? "",
    task.assignee?.name ?? "",
  ]);
  return [headers.join(","), ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))].join("\n");
}
