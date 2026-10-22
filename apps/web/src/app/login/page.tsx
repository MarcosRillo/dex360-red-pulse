import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-red-500">Austral Motors · Red Pulse</p>
        <h1 className="mb-6 mt-2 text-xl font-semibold">Iniciar sesión</h1>
        <LoginForm />
        <div className="mt-6 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
          <p className="mb-1">Cuenta de demostración</p>
          <p className="font-mono">gerencia@australmotors.test</p>
          <p className="font-mono">redpulse-demo</p>
        </div>
      </div>
    </main>
  );
}
