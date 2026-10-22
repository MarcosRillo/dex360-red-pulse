import type { SessionUser } from "@red-pulse/contracts";

export interface UserRecord extends SessionUser {
  passwordHash: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | undefined>;
}

// Demo account. The credentials are public on purpose: they are shown on the login screen.
const SEED_USERS: UserRecord[] = [
  {
    id: "u-001",
    name: "Valentina Ríos",
    email: "gerencia@australmotors.test",
    role: "Gerente de Red Comercial",
    passwordHash:
      "scrypt$jum89iQOzq6SFoR8NABFDA$kvkchhrZqeagouXc63PL-26Rso1fU-ra5p-BGB5S8hDfrQRKsbSYvnfLT4jfULOxFSe-nTepxbh3_QNr8dBNYQ",
  },
];

export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly users: UserRecord[] = SEED_USERS) {}

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
