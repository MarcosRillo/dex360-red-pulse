import { describe, expect, it } from "vitest";
import { trendTone } from "./kpi-trend";

describe("trendTone", () => {
  it("treats growth as good for volume and conversion KPIs", () => {
    expect(trendTone("leads", 3)).toBe("good");
    expect(trendTone("testDrives", 1.1)).toBe("good");
    expect(trendTone("conversion", 2)).toBe("good");
  });

  it("treats a drop as bad for volume and conversion KPIs", () => {
    expect(trendTone("conversion", -1)).toBe("bad");
    expect(trendTone("leads", -0.1)).toBe("bad");
  });

  it("inverts the meaning for first response, where lower is better", () => {
    expect(trendTone("firstResponse", 7.4)).toBe("bad");
    expect(trendTone("firstResponse", -5)).toBe("good");
  });

  it("is neutral when nothing changed", () => {
    expect(trendTone("leads", 0)).toBe("neutral");
    expect(trendTone("firstResponse", 0)).toBe("neutral");
  });
});
