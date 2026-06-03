import prisma from "../db/prisma";
import type { Priority, TaskStatus } from "@prisma/client";

export type TaskFilter = {
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  dueDateBefore?: string;
  dueDateAfter?: string;
};

export type NewTaskPayload = {
  taskKey: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  estimatedCompletionDate?: Date;
  assigneeId?: string | null;
};

export async function createTask(payload: NewTaskPayload) {
  return prisma.task.create({
    data: payload,
    include: {
      assignee: true,
      dependencies: { include: { dependsOn: true } },
    },
  });
}

export async function getTaskByKey(taskKey: string) {
  return prisma.task.findUnique({
    where: { taskKey },
    include: {
      assignee: true,
      dependencies: { include: { dependsOn: true } },
      statusHistory: true,
    },
  });
}

export async function findTaskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function updateTask(taskId: string, data: Partial<NewTaskPayload>) {
  return prisma.task.update({
    where: { id: taskId },
    data,
    include: {
      assignee: true,
      dependencies: { include: { dependsOn: true } },
      statusHistory: true,
    },
  });
}

export async function listTasks(filters: TaskFilter) {
  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.assigneeId) where.assigneeId = filters.assigneeId;
  if (filters.dueDateBefore || filters.dueDateAfter) {
    where.estimatedCompletionDate = {};
    if (filters.dueDateBefore) where.estimatedCompletionDate.lte = new Date(filters.dueDateBefore);
    if (filters.dueDateAfter) where.estimatedCompletionDate.gte = new Date(filters.dueDateAfter);
  }
  return prisma.task.findMany({
    where,
    include: {
      assignee: true,
      dependencies: { include: { dependsOn: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function countTasksCreatedInRange(start: Date, end: Date) {
  return prisma.task.count({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
}

export async function countTasksCompletedInRange(start: Date, end: Date) {
  return prisma.task.count({
    where: {
      status: "COMPLETED",
      updatedAt: {
        gte: start,
        lt: end,
      },
    },
  });
}

export async function countTasksDueInRange(start: Date, end: Date) {
  return prisma.task.count({
    where: {
      estimatedCompletionDate: {
        gte: start,
        lt: end,
      },
    },
  });
}

export async function createTaskDependency(taskId: string, dependsOnTaskId: string) {
  return prisma.taskDependency.create({
    data: {
      taskId,
      dependsOnTaskId,
    },
  });
}

export async function getDependenciesForTask(taskId: string) {
  return prisma.taskDependency.findMany({
    where: { taskId },
    include: { dependsOn: true },
  });
}

export async function findDependentTasks(taskId: string) {
  return prisma.taskDependency.findMany({
    where: { dependsOnTaskId: taskId },
    include: { task: true },
  });
}

export async function createTaskStatusHistory(taskId: string, previousStatus: TaskStatus, newStatus: TaskStatus, changedById: string, note?: string) {
  return prisma.taskStatusHistory.create({
    data: {
      taskId,
      previousStatus,
      newStatus,
      changedById,
      note,
    },
  });
}

export async function countTasksByStatus() {
  const statuses = await prisma.task.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  return statuses;
}

export async function countAllTasks() {
  return prisma.task.count();
}
