import bcrypt from "bcryptjs";
import { sign, type SignOptions } from "jsonwebtoken";
import { ApiError } from "../errors/ApiError";
import { config } from "../config";
import { createUser, findUserByEmail, NewUserPayload } from "../repositories/user.repository";
import type { UserRole } from "@prisma/client";

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new ApiError("Email already in use", 409, "USER_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role ?? "DEVELOPER",
  } as NewUserPayload);

  return {
    user,
    token: signToken(user.id, user.role),
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new ApiError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token: signToken(user.id, user.role),
  };
}

function signToken(userId: string, role: UserRole) {
  const options = { expiresIn: config.jwtExpiresIn } as SignOptions;
  return sign({ userId, role }, config.jwtSecret as string, options);
}
