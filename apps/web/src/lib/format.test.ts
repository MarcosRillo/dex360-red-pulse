import { describe, expect, it } from "vitest";
import { formatCount, formatKpiValue, formatMinutes, formatPercent, formatTrend } from "./format";

describe("formatCount", () => {
  it("groups thousands with a dot, es-AR style", () => {
    expect(formatCount(2705)).toBe("2.705");
    expect(formatCount(759)).toBe("759");
    expect(formatCount(1234567)).toBe("1.234.567");
  });
});

describe("formatMinutes", () => {
  it("shows plain minutes under an hour", () => {
    expect(formatMinutes(45)).toBe("45 min");
    expect(formatMinutes(0)).toBe("0 min");
    expect(formatMinutes(59)).toBe("59 min");
  });

  it("shows hours and minutes from one hour up", () => {
    expect(formatMinutes(87)).toBe("1 h 27 min");
    expect(formatMinutes(212)).toBe("3 h 32 min");
  });

  it("drops the minutes on an exact hour", () => {
    expect(formatMinutes(60)).toBe("1 h");
    expect(formatMinutes(120)).toBe("2 h");
  });
});

describe("formatPercent", () => {
  it("uses a decimal comma, one decimal and a space before the sign", () => {
    expect(formatPercent(10)).toBe("10,0 %");
    expect(formatPercent(7.4)).toBe("7,4 %");
    expect(formatPercent(8.25)).toBe("8,3 %");
  });
});

describe("formatTrend", () => {
  it("prefixes an up arrow for growth", () => {
    expect(formatTrend(7.4)).toBe("▲ 7,4 %");
  });

  it("prefixes a down arrow and drops the minus sign for a drop", () => {
    expect(formatTrend(-1)).toBe("▼ 1,0 %");
  });

  it("uses a neutral marker when nothing changed", () => {
    expect(formatTrend(0)).toBe("● 0,0 %");
  });
});

describe("formatKpiValue", () => {
  it("formats by unit", () => {
    expect(formatKpiValue({ unit: "count", value: 2705 })).toBe("2.705");
    expect(formatKpiValue({ unit: "minutes", value: 87 })).toBe("1 h 27 min");
    expect(formatKpiValue({ unit: "percent", value: 10 })).toBe("10,0 %");
  });
});
