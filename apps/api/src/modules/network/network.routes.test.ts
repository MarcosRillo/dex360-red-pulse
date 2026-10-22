import request from "supertest";
import { describe, expect, it } from "vitest";
import { DealersResponseSchema, KpisResponseSchema } from "@red-pulse/contracts";
import { DEMO, testApp } from "../../test-support.js";

async function authCookie() {
  const res = await request(testApp()).post("/api/auth/login").send(DEMO);
  return ([] as string[]).concat(res.headers["set-cookie"] ?? [])[0]!.split(";")[0]!;
}

describe.each(["/api/network/kpis", "/api/network/dealers"])("GET %s", (path) => {
  it("returns 401 without a session", async () => {
    const res = await request(testApp()).get(path);

    expect(res.status).toBe(401);
  });
});

describe("GET /api/network/kpis", () => {
  it("returns the four KPIs in display order, matching the contract", async () => {
    const res = await request(testApp()).get("/api/network/kpis").set("Cookie", await authCookie());

    expect(res.status).toBe(200);
    const body = KpisResponseSchema.parse(res.body);
    expect(body.kpis.map((kpi) => kpi.id)).toEqual(["leads", "firstResponse", "testDrives", "conversion"]);
  });
});

describe("GET /api/network/dealers", () => {
  it("returns the dealers ranked by conversion, matching the contract", async () => {
    const res = await request(testApp()).get("/api/network/dealers").set("Cookie", await authCookie());

    expect(res.status).toBe(200);
    const { dealers } = DealersResponseSchema.parse(res.body);
    expect(dealers).toHaveLength(12);
    expect(dealers.map((dealer) => dealer.rank)).toEqual(dealers.map((_, index) => index + 1));
    const conversions = dealers.map((dealer) => dealer.conversion);
    expect(conversions).toEqual([...conversions].sort((a, b) => b - a));
  });
});
