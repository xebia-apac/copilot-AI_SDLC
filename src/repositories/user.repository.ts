import prisma from "../db/prisma";
import type { UserRole } from "@prisma/client";

export type NewUserPayload = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export async function createUser(payload: NewUserPayload) {
  return prisma.user.create({
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
