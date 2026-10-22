import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-panel p-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">Austral Motors</p>
        <p className="mt-1 flex items-center gap-2 text-xl font-semibold">
          <span aria-hidden="true" className="status-light pulse-dot size-2.5 rounded-full text-ok" />
          Red Pulse
        </p>
        <h1 className="mb-6 mt-4 text-sm text-muted">Ingresá para ver el estado de la red de concesionarios.</h1>
        <LoginForm />
        <div className="mt-6 border-t border-line pt-4 text-xs text-muted">
          <p className="mb-1">Cuenta de demostración</p>
          <p className="font-mono text-foreground">gerencia@australmotors.test</p>
          <p className="font-mono text-foreground">redpulse-demo</p>
        </div>
      </div>
    </main>
  );
}
