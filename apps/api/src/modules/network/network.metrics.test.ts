import { describe, expect, it } from "vitest";
import {
  conversionRate,
  percentChange,
  statusForConversion,
  statusForFirstResponse,
  statusForTrend,
  weightedFirstResponse,
} from "./network.metrics.js";

describe("statusForFirstResponse", () => {
  it.each([
    [0, "ok"],
    [60, "ok"],
    [61, "warning"],
    [180, "warning"],
    [181, "critical"],
  ] as const)("%i minutes → %s", (minutes, status) => {
    expect(statusForFirstResponse(minutes)).toBe(status);
  });
});

describe("statusForConversion", () => {
  it.each([
    [12, "ok"],
    [10, "ok"],
    [9.9, "warning"],
    [6, "warning"],
    [5.9, "critical"],
  ] as const)("%d%% → %s", (conversion, status) => {
    expect(statusForConversion(conversion)).toBe(status);
  });
});

describe("statusForTrend", () => {
  it.each([
    [5, "ok"],
    [0, "ok"],
    [-0.1, "warning"],
    [-10, "warning"],
    [-10.1, "critical"],
  ] as const)("%d%% → %s", (trend, status) => {
    expect(statusForTrend(trend)).toBe(status);
  });
});

describe("conversionRate", () => {
  it("returns sales over leads as a percent with one decimal", () => {
    expect(conversionRate(37, 300)).toBe(12.3);
  });

  it("returns 0 when there are no leads", () => {
    expect(conversionRate(0, 0)).toBe(0);
  });
});

describe("percentChange", () => {
  it("returns the change against the previous value with one decimal", () => {
    expect(percentChange(110, 100)).toBe(10);
    expect(percentChange(90, 120)).toBe(-25);
    expect(percentChange(1, 3)).toBe(-66.7);
  });

  it("returns 0 when there is no previous value", () => {
    expect(percentChange(50, 0)).toBe(0);
  });
});

describe("weightedFirstResponse", () => {
  it("weights each dealer by its leads, so a small fast dealer cannot hide a big slow one", () => {
    const rows = [
      { leads: 400, firstResponseMinutes: 200 },
      { leads: 100, firstResponseMinutes: 20 },
    ];

    // Simple mean would say 110; weighted says (400*200 + 100*20) / 500 = 164.
    expect(weightedFirstResponse(rows)).toBe(164);
  });

  it("returns 0 for an empty network", () => {
    expect(weightedFirstResponse([])).toBe(0);
  });
});
