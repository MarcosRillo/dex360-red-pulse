import { Suspense } from "react";
import { getSessionUser } from "@/lib/api/server";
import { LogoutButton } from "./logout-button";

// Placeholder: the real dashboard replaces this content in the next issue.
export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <header className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-red-500">Austral Motors · Red Pulse</p>
        <LogoutButton />
      </header>
      <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
        <Greeting />
      </Suspense>
    </main>
  );
}

async function Greeting() {
  const user = await getSessionUser();
  return <h1 className="text-2xl font-semibold">Hola, {user.name}</h1>;
}
