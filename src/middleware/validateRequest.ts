import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../errors/ApiError";

export function validateRequest(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = result.error.format();
      throw new ApiError("Request validation failed", 422, "VALIDATION_ERROR", issues);
    }

    next();
  };
}
