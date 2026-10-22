import type { Kpi, Status } from "@red-pulse/contracts";
import { formatKpiValue, formatTrend } from "@/lib/format";
import { trendTone, type TrendTone } from "@/lib/kpi-trend";
import { StatusLight } from "./status-light";

const TONE_CLASS: Record<TrendTone, string> = {
  good: "text-ok",
  bad: "text-critical",
  neutral: "text-muted",
};

const TONE_LABEL: Record<TrendTone, string> = {
  good: "favorable",
  bad: "desfavorable",
  neutral: "sin cambios",
};

const GAUGE_SEGMENTS = 10;

/** How many segments light up: a health bar, fuller means closer to the target. */
const GAUGE_LEVEL: Record<Status, number> = { ok: 8, warning: 5, critical: 3 };

const GAUGE_COLOR: Record<Status, string> = {
  ok: "bg-ok",
  warning: "bg-warning",
  critical: "bg-critical",
};

function Gauge({ status }: { status: Status }) {
  return (
    <div aria-hidden="true" className="mt-5 flex gap-1">
      {Array.from({ length: GAUGE_SEGMENTS }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 flex-1 rounded-[1px] ${index < GAUGE_LEVEL[status] ? GAUGE_COLOR[status] : "bg-line"}`}
        />
      ))}
    </div>
  );
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const tone = trendTone(kpi.id, kpi.trend);

  return (
    <article
      aria-label={kpi.label}
      data-status={kpi.status}
      className="flex flex-col rounded-lg border border-line bg-panel p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted">{kpi.label}</h3>
        <StatusLight status={kpi.status} />
      </div>
      <p className="mt-4 whitespace-nowrap font-mono text-4xl font-semibold tracking-tight">{formatKpiValue(kpi)}</p>
      <p
        data-testid="kpi-trend"
        data-tone={tone}
        className={`mt-2 whitespace-nowrap font-mono text-xs ${TONE_CLASS[tone]}`}
      >
        {formatTrend(kpi.trend)} vs. período anterior
        {" "}
        <span className="sr-only">{TONE_LABEL[tone]}</span>
      </p>
      <div className="mt-auto" />
      <Gauge status={kpi.status} />
    </article>
  );
}
