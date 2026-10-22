import { Suspense } from "react";
import { getKpis, getUser } from "@/lib/api/network";
import { LogoutButton } from "../logout-button";

export function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-line pb-5">
      <div>
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-muted">Austral Motors</p>
        <h1 className="mt-1 flex items-center gap-2.5 text-2xl font-semibold tracking-tight">
          <span aria-hidden="true" className="status-light pulse-dot size-2.5 rounded-full text-ok" />
          Red Pulse
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Suspense fallback={<HeaderMetaSkeleton />}>
          <HeaderMeta />
        </Suspense>
        <LogoutButton />
      </div>
    </header>
  );
}

async function HeaderMeta() {
  const [user, kpis] = await Promise.all([getUser(), getKpis()]);

  return (
    <>
      <p className="text-sm sm:text-right">
        <span className="block font-medium">{user.name}</span>
        <span className="block text-xs text-muted">{user.role}</span>
      </p>
      <p className="rounded border border-line bg-panel px-3 py-1.5 font-mono text-xs text-muted">{kpis.period}</p>
    </>
  );
}

function HeaderMetaSkeleton() {
  return (
    <>
      <div className="h-9 w-36 animate-pulse rounded bg-line motion-reduce:animate-none" />
      <div className="h-8 w-28 animate-pulse rounded bg-line motion-reduce:animate-none" />
    </>
  );
}
