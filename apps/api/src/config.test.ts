import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  it("refuses to start in production without SESSION_SECRET", () => {
    expect(() => loadConfig({ NODE_ENV: "production" })).toThrow("SESSION_SECRET is required in production");
  });

  it("refuses a short SESSION_SECRET", () => {
    expect(() => loadConfig({ SESSION_SECRET: "short" })).toThrow("SESSION_SECRET must be at least 32 characters");
  });

  it("uses secure cookies in production", () => {
    const secret = "x".repeat(32);
    expect(loadConfig({ NODE_ENV: "production", SESSION_SECRET: secret })).toEqual({
      sessionSecret: secret,
      secureCookies: true,
      sessionTtlSeconds: 28800,
    });
  });

  it("falls back to a development secret locally", () => {
    const config = loadConfig({});
    expect(config.secureCookies).toBe(false);
    expect(config.sessionSecret.length).toBeGreaterThanOrEqual(32);
  });
});
