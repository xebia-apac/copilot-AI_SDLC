import { loginUser, registerUser } from "../../src/services/auth.service";
import { findUserByEmail } from "../../src/repositories/user.repository";
import bcrypt from "bcryptjs";

jest.mock("../../src/repositories/user.repository");
jest.mock("bcryptjs");

const findUserByEmailMock = findUserByEmail as jest.MockedFunction<typeof findUserByEmail>;
const bcryptCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;
const bcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;

describe("AuthService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("throws when login credentials are invalid", async () => {
    findUserByEmailMock.mockResolvedValue(null as any);

    await expect(loginUser({ email: "missing@example.com", password: "password" })).rejects.toThrow("Invalid credentials");
  });

  it("throws when password does not match", async () => {
    findUserByEmailMock.mockResolvedValue({
      id: "user-id",
      email: "test@example.com",
      name: "Test User",
      role: "DEVELOPER",
      passwordHash: "hash",
    } as any);
    bcryptCompare.mockResolvedValue(false);

    await expect(loginUser({ email: "test@example.com", password: "password" })).rejects.toThrow("Invalid credentials");
  });

  it("registers a new user when the email is not in use", async () => {
    findUserByEmailMock.mockResolvedValue(null as any);
    bcryptHash.mockResolvedValue("hashed-password" as any);

    await expect(
      registerUser({ email: "new@example.com", name: "New User", password: "password123" })
    ).resolves.toHaveProperty("token");
  });
});
