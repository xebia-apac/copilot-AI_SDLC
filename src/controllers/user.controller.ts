import { Request, Response } from "express";
import { getUserProfile } from "../services/user.service";

export async function getProfile(_req: Request, res: Response): Promise<void> {
  const userId = res.locals.user?.id as string;
  const user = await getUserProfile(userId);
  res.json({
    success: true,
    data: user,
    error: null,
    meta: null,
  });
}
