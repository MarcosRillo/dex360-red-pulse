import { getDealers, getKpis } from "@/lib/api/network";
import { summarizeNetwork } from "@/lib/network-summary";
import { StatusDot } from "./status-light";

export async function NetworkSummary() {
  const [kpis, dealers] = await Promise.all([getKpis(), getDealers()]);
  const summary = summarizeNetwork(kpis.kpis, dealers.dealers);

  return (
    <p className="flex items-center gap-3 text-sm">
      <StatusDot status={summary.status} />
      <span>{summary.text}</span>
    </p>
  );
}
