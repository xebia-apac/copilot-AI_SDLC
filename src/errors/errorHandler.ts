import { NextFunction, Request, Response } from "express";
import { ApiError } from "./ApiError";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      data: null,
      error: {
        message: err.message,
        code: err.errorCode,
        details: err.details ?? null,
      },
      meta: null,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    data: null,
    error: { message: "Internal server error", code: "INTERNAL_ERROR", details: null },
    meta: null,
  });
}
