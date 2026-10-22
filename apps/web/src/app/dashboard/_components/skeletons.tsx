const PULSE = "animate-pulse motion-reduce:animate-none";

export function SummarySkeleton() {
  return <div className={`h-5 w-80 max-w-full rounded bg-line ${PULSE}`} />;
}

export function KpiGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className={`h-44 rounded-lg border border-line bg-panel p-5 ${PULSE}`}>
          <div className="h-3 w-24 rounded bg-line" />
          <div className="mt-6 h-9 w-32 rounded bg-line" />
          <div className="mt-4 h-3 w-40 rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

export function DealerTableSkeleton() {
  return (
    <div className="space-y-px" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className={`h-14 border-b border-line bg-panel px-4 py-3 ${PULSE}`}>
          <div className="h-3 w-48 rounded bg-line" />
          <div className="mt-2 h-3 w-24 rounded bg-line" />
        </div>
      ))}
    </div>
  );
}
