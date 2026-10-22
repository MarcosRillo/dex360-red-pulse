import { SignJWT } from "jose";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { SESSION_COOKIE, SessionUserSchema } from "@red-pulse/contracts";
import { DEMO, TEST_CONFIG, testApp } from "../../test-support.js";

const GENERIC_401 = { error: "Email o contraseña incorrectos" };

function sessionCookie(res: request.Response): string {
  const cookies = ([] as string[]).concat(res.headers["set-cookie"] ?? []);
  const cookie = cookies.find((value) => value.startsWith(`${SESSION_COOKIE}=`));
  if (!cookie) throw new Error("session cookie not set");
  return cookie;
}

async function login() {
  return request(testApp()).post("/api/auth/login").send(DEMO);
}

describe("POST /api/auth/login", () => {
  it("returns the user and sets an httpOnly session cookie", async () => {
    const res = await login();

    expect(res.status).toBe(200);
    expect(SessionUserSchema.parse(res.body)).toMatchObject({ email: DEMO.email });
    const cookie = sessionCookie(res);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Max-Age=28800");
  });

  it("rejects a wrong password and an unknown email with the same generic message", async () => {
    const wrongPassword = await request(testApp())
      .post("/api/auth/login")
      .send({ ...DEMO, password: "nope" });
    const unknownEmail = await request(testApp())
      .post("/api/auth/login")
      .send({ ...DEMO, email: "nadie@australmotors.test" });

    for (const res of [wrongPassword, unknownEmail]) {
      expect(res.status).toBe(401);
      expect(res.body).toEqual(GENERIC_401);
      expect(res.headers["set-cookie"]).toBeUndefined();
    }
  });

  it("rejects a malformed body with 400", async () => {
    const res = await request(testApp()).post("/api/auth/login").send({ email: "nope" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Ingresá un email válido" });
  });
});

describe("GET /api/auth/me", () => {
  it("returns the current user with a valid session", async () => {
    const cookie = sessionCookie(await login()).split(";")[0]!;

    const res = await request(testApp()).get("/api/auth/me").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: DEMO.email });
  });

  it("returns 401 without a cookie", async () => {
    const res = await request(testApp()).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Sesión inválida o vencida" });
  });

  it("returns 401 with a tampered cookie", async () => {
    const cookie = sessionCookie(await login()).split(";")[0]!;

    const res = await request(testApp()).get("/api/auth/me").set("Cookie", `${cookie}tampered`);

    expect(res.status).toBe(401);
  });

  it("returns 401 with an expired session", async () => {
    const expired = await new SignJWT({ name: "X", email: DEMO.email, role: "X" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("u-1")
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600)
      .sign(new TextEncoder().encode(TEST_CONFIG.sessionSecret));

    const res = await request(testApp()).get("/api/auth/me").set("Cookie", `${SESSION_COOKIE}=${expired}`);

    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the session cookie", async () => {
    const res = await request(testApp()).post("/api/auth/logout");

    expect(res.status).toBe(204);
    const cookie = sessionCookie(res);
    expect(cookie).toMatch(/Expires=Thu, 01 Jan 1970/);
  });
});
