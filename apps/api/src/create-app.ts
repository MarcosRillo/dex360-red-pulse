import cookieParser from "cookie-parser";
import express, { type ErrorRequestHandler } from "express";
import type { HealthResponse } from "@red-pulse/contracts";
import { loadConfig, type AppConfig } from "./config.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { InMemoryUserRepository } from "./modules/auth/user.repository.js";
import { requireSession } from "./middleware/require-session.js";
import { InMemoryDealerRepository } from "./modules/network/dealer.repository.js";
import { networkRoutes } from "./modules/network/network.routes.js";
import { NetworkService } from "./modules/network/network.service.js";

// Composition root: wires repositories → services → routes.
export function createApp(config: AppConfig = loadConfig()) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    const body: HealthResponse = { status: "ok", service: "red-pulse-api" };
    res.json(body);
  });

  app.use("/api/auth", authRoutes(new AuthService(new InMemoryUserRepository()), config));
  app.use(
    "/api/network",
    requireSession(config.sessionSecret),
    networkRoutes(new NetworkService(new InMemoryDealerRepository())),
  );

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Never leak stack traces: log server-side, answer with a generic message.
  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  };
  app.use(errorHandler);

  return app;
}
