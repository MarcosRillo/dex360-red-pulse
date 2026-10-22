import { describe, expect, it } from "vitest";
import { LoginRequestSchema } from "./auth.js";

describe("LoginRequestSchema", () => {
  it("normalizes the email", () => {
    expect(LoginRequestSchema.parse({ email: "  Gerencia@AustralMotors.test ", password: "x" }).email).toBe(
      "gerencia@australmotors.test",
    );
  });

  it("rejects an invalid email and an empty password with Spanish messages", () => {
    const result = LoginRequestSchema.safeParse({ email: "nope", password: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Ingresá un email válido",
      "Ingresá tu contraseña",
    ]);
  });
});
