"use client";

import { useEffect } from "react";

export default function DashboardError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <span aria-hidden="true" className="status-light size-3 rounded-full text-critical" />
      <h1 className="text-xl font-semibold">No pudimos cargar el tablero</h1>
      <p className="text-sm text-muted">Hubo un problema al consultar los datos de la red. Probá de nuevo en unos segundos.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded border border-line px-4 py-2 text-sm text-foreground hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        Reintentar
      </button>
    </main>
  );
}
