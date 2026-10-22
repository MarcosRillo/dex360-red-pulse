import request from "supertest";
import { describe, expect, it } from "vitest";
import { HealthResponseSchema } from "@red-pulse/contracts";
import { testApp } from "./test-support.js";

describe("GET /api/health", () => {
  it("reports the API as healthy using the shared contract", async () => {
    const res = await request(testApp()).get("/api/health");

    expect(res.status).toBe(200);
    expect(HealthResponseSchema.parse(res.body)).toEqual({ status: "ok", service: "red-pulse-api" });
  });

  it("returns a JSON 404 for unknown routes", async () => {
    const res = await request(testApp()).get("/api/nope");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });
});
