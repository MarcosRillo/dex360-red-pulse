import express, { type ErrorRequestHandler } from "express";
import type { HealthResponse } from "@red-pulse/contracts";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    const body: HealthResponse = { status: "ok", service: "red-pulse-api" };
    res.json(body);
  });

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
