import type { Kpi } from "@red-pulse/contracts";

const LOCALE = "es-AR";

const count = new Intl.NumberFormat(LOCALE);
const oneDecimal = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatCount(value: number): string {
  return count.format(value);
}

/** 45 -> "45 min", 87 -> "1 h 27 min", 120 -> "2 h". */
export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

/** 10 -> "10,0 %". */
export function formatPercent(value: number): string {
  return `${oneDecimal.format(value)} %`;
}

/** The sign lives in the arrow: 7.4 -> "▲ 7,4 %", -1 -> "▼ 1,0 %". */
export function formatTrend(trend: number): string {
  const arrow = trend > 0 ? "▲" : trend < 0 ? "▼" : "●";
  return `${arrow} ${formatPercent(Math.abs(trend))}`;
}

export function formatKpiValue({ unit, value }: Pick<Kpi, "unit" | "value">): string {
  switch (unit) {
    case "minutes":
      return formatMinutes(value);
    case "percent":
      return formatPercent(value);
    case "count":
      return formatCount(value);
  }
}
