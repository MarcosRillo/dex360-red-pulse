import { Suspense } from "react";
import { DashboardHeader } from "./_components/dashboard-header";
import { DealersTable } from "./_components/dealers-section";
import { KpiGrid } from "./_components/kpi-grid";
import { NetworkSummary } from "./_components/network-summary";
import { DealerTableSkeleton, KpiGridSkeleton, SummarySkeleton } from "./_components/skeletons";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <DashboardHeader />

      <Suspense fallback={<SummarySkeleton />}>
        <NetworkSummary />
      </Suspense>

      <section aria-labelledby="kpis-heading">
        <h2 id="kpis-heading" className="sr-only">
          Indicadores de la red
        </h2>
        <Suspense fallback={<KpiGridSkeleton />}>
          <KpiGrid />
        </Suspense>
      </section>

      <section aria-labelledby="dealers-heading" className="overflow-hidden rounded-lg border border-line bg-panel">
        <div className="border-b border-line px-4 py-4 sm:px-5">
          <h2 id="dealers-heading" className="text-lg font-semibold">
            Red de concesionarios
          </h2>
          <p className="text-sm text-muted">Ranking por conversión</p>
        </div>
        <Suspense fallback={<DealerTableSkeleton />}>
          <DealersTable />
        </Suspense>
      </section>

      <footer className="pb-4 text-xs leading-relaxed text-muted">
        <p>
          1ª respuesta: en rango ≤ 60 min · atención ≤ 180 min · crítico &gt; 180 min. Conversión: en rango ≥ 10 %.
        </p>
      </footer>
    </main>
  );
}
