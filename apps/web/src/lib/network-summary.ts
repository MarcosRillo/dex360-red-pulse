import type { Dealer, Kpi, Status } from "@red-pulse/contracts";

export interface NetworkSummary {
  text: string;
  /** The worst status found across KPIs and dealers. */
  status: Status;
}

const SEVERITY: Record<Status, number> = { ok: 0, warning: 1, critical: 2 };

function dealersPhrase(count: number, state: string): string {
  return `${count} ${count === 1 ? "concesionario" : "concesionarios"} ${state}`;
}

/** One line for the manager: what needs attention right now, derived from the statuses. */
export function summarizeNetwork(kpis: Kpi[], dealers: Dealer[]): NetworkSummary {
  const criticalDealers = dealers.filter((dealer) => dealer.status === "critical").length;
  const warningDealers = dealers.filter((dealer) => dealer.status === "warning").length;

  const parts: string[] = [];
  if (criticalDealers > 0) parts.push(dealersPhrase(criticalDealers, "en estado crítico"));
  if (warningDealers > 0) parts.push(dealersPhrase(warningDealers, "en atención"));
  for (const kpi of kpis) {
    if (kpi.status === "warning") parts.push(`${kpi.label.toLowerCase()} en atención`);
    if (kpi.status === "critical") parts.push(`${kpi.label.toLowerCase()} en estado crítico`);
  }

  const worst = [...kpis.map((kpi) => kpi.status), ...dealers.map((dealer) => dealer.status)].reduce<Status>(
    (acc, status) => (SEVERITY[status] > SEVERITY[acc] ? status : acc),
    "ok",
  );

  return { text: parts.length > 0 ? parts.join(" · ") : "Toda la red opera en rango", status: worst };
}
