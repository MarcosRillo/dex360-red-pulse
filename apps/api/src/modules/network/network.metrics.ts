import type { Status } from "@red-pulse/contracts";
import { THRESHOLDS } from "./network.thresholds.js";

const oneDecimal = (value: number) => Math.round(value * 10) / 10;

export function statusForFirstResponse(minutes: number): Status {
  const { okUpTo, warningUpTo } = THRESHOLDS.firstResponse;
  if (minutes <= okUpTo) return "ok";
  return minutes <= warningUpTo ? "warning" : "critical";
}

export function statusForConversion(percent: number): Status {
  const { okFrom, warningFrom } = THRESHOLDS.conversion;
  if (percent >= okFrom) return "ok";
  return percent >= warningFrom ? "warning" : "critical";
}

export function statusForTrend(percent: number): Status {
  const { okFrom, warningFrom } = THRESHOLDS.trend;
  if (percent >= okFrom) return "ok";
  return percent >= warningFrom ? "warning" : "critical";
}

export function conversionRate(sales: number, leads: number): number {
  return leads === 0 ? 0 : oneDecimal((sales / leads) * 100);
}

export function percentChange(current: number, previous: number): number {
  return previous === 0 ? 0 : oneDecimal(((current - previous) / previous) * 100);
}

/** Average first-response time weighted by leads, in whole minutes. */
export function weightedFirstResponse(rows: { leads: number; firstResponseMinutes: number }[]): number {
  const leads = rows.reduce((sum, row) => sum + row.leads, 0);
  if (leads === 0) return 0;
  return Math.round(rows.reduce((sum, row) => sum + row.leads * row.firstResponseMinutes, 0) / leads);
}
