import { getKpis } from "@/lib/api/network";
import { KpiCard } from "./kpi-card";

export async function KpiGrid() {
  const { kpis } = await getKpis();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
