import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "../errors/ApiError";

type TokenPayload = {
  userId: string;
  role: string;
};

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    throw new ApiError("Authorization header missing or invalid", 401, "AUTHENTICATION_REQUIRED");
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;
    res.locals.user = { id: payload.userId, role: payload.role };
    next();
  } catch (error) {
    throw new ApiError("Invalid or expired token", 401, "INVALID_TOKEN");
  }
}

export function authorize(roles: string[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user;
    if (!user || !roles.includes(user.role)) {
      throw new ApiError("Forbidden", 403, "FORBIDDEN");
    }
    next();
  };
}
