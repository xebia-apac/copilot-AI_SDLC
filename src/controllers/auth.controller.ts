import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema";

export async function register(req: Request, res: Response): Promise<void> {
  const input = req.body as RegisterInput;
  const result = await registerUser(input);
  res.status(201).json({
    success: true,
    data: { user: result.user, token: result.token },
    error: null,
    meta: null,
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const input = req.body as LoginInput;
  const result = await loginUser(input);
  res.json({
    success: true,
    data: result,
    error: null,
    meta: null,
  });
}
