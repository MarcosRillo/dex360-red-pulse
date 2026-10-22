import { createApp } from "./create-app.js";
import type { AppConfig } from "./config.js";

export const TEST_CONFIG: AppConfig = {
  sessionSecret: "test-secret-with-at-least-32-characters!!",
  secureCookies: false,
  sessionTtlSeconds: 60 * 60 * 8,
};

export const DEMO = { email: "gerencia@australmotors.test", password: "redpulse-demo" };

export const testApp = () => createApp(TEST_CONFIG);
