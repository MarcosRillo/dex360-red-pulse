import { describe, expect, it } from "vitest";
import { HealthResponseSchema } from "./health.js";

describe("HealthResponseSchema", () => {
  it("accepts the API health payload", () => {
    expect(HealthResponseSchema.parse({ status: "ok", service: "red-pulse-api" })).toEqual({
      status: "ok",
      service: "red-pulse-api",
    });
  });

  it("rejects any other status", () => {
    expect(HealthResponseSchema.safeParse({ status: "down", service: "red-pulse-api" }).success).toBe(false);
  });
});
