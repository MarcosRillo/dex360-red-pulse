// Vercel entry point: the Express app is the default export.
// Vercel detects the Express framework from an `express` import in this file.
import type { Express } from "express";
import { createApp } from "./create-app.js";

const app: Express = createApp();

export default app;
