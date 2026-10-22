import type { Kpi } from "@red-pulse/contracts";

export type TrendTone = "good" | "bad" | "neutral";

/** For these KPIs a lower number is the better one. */
const LOWER_IS_BETTER: ReadonlySet<Kpi["id"]> = new Set(["firstResponse"]);

/** Whether a change against the previous period is good news, independent of the KPI status. */
export function trendTone(id: Kpi["id"], trend: number): TrendTone {
  if (trend === 0) return "neutral";
  const improved = LOWER_IS_BETTER.has(id) ? trend < 0 : trend > 0;
  return improved ? "good" : "bad";
}
