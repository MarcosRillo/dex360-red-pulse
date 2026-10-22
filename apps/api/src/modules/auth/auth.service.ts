import type { LoginRequest, SessionUser } from "@red-pulse/contracts";
import { DECOY_HASH, verifyPassword } from "./password.js";
import type { UserRepository } from "./user.repository.js";

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async login({ email, password }: LoginRequest): Promise<SessionUser | null> {
    const user = await this.users.findByEmail(email);
    const valid = await verifyPassword(password, user?.passwordHash ?? DECOY_HASH);
    if (!user || !valid) return null;

    const { passwordHash: _hash, ...sessionUser } = user;
    return sessionUser;
  }
}
