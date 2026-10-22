import { Router, type CookieOptions } from "express";
import { LoginRequestSchema, SESSION_COOKIE } from "@red-pulse/contracts";
import type { AppConfig } from "../../config.js";
import { requireSession } from "../../middleware/require-session.js";
import type { AuthService } from "./auth.service.js";
import { signSession } from "./session.js";

export function authRoutes(auth: AuthService, config: AppConfig) {
  const router = Router();
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: config.secureCookies,
    path: "/",
  };

  router.post("/login", async (req, res) => {
    const body = LoginRequestSchema.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.issues[0]?.message ?? "Datos inválidos" });
      return;
    }

    const user = await auth.login(body.data);
    if (!user) {
      res.status(401).json({ error: "Email o contraseña incorrectos" });
      return;
    }

    const token = await signSession(user, config.sessionSecret, config.sessionTtlSeconds);
    res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: config.sessionTtlSeconds * 1000 });
    res.json(user);
  });

  router.post("/logout", (_req, res) => {
    res.clearCookie(SESSION_COOKIE, cookieOptions);
    res.status(204).end();
  });

  router.get("/me", requireSession(config.sessionSecret), (_req, res) => {
    res.json(res.locals.user);
  });

  return router;
}
