import type { RequestHandler } from "express";
import { SESSION_COOKIE, type SessionUser } from "@red-pulse/contracts";
import { verifySession } from "../modules/auth/session.js";

export type SessionLocals = { user: SessionUser };

export function requireSession(secret: string): RequestHandler<unknown, unknown, unknown, unknown, SessionLocals> {
  return async (req, res, next) => {
    const token: unknown = req.cookies?.[SESSION_COOKIE];
    const user = typeof token === "string" ? await verifySession(token, secret) : null;
    if (!user) {
      res.status(401).json({ error: "Sesión inválida o vencida" });
      return;
    }
    res.locals.user = user;
    next();
  };
}
