import { Request, Response, NextFunction } from "express";
import { logInfo } from "../logger";

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  logInfo("Incoming request", {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
  });
  next();
}
