import { findUserById } from "../repositories/user.repository";
import { ApiError } from "../errors/ApiError";

export async function getUserProfile(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError("User not found", 404, "USER_NOT_FOUND");
  }
  return user;
}
