"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiErrorSchema, LoginRequestSchema } from "@red-pulse/contracts";

const FALLBACK_ERROR = "No pudimos iniciar sesión. Intentá de nuevo.";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const parsed = LoginRequestSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? FALLBACK_ERROR);
      return;
    }

    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body = ApiErrorSchema.safeParse(await response.json().catch(() => null));
        setError(body.success ? body.data.error : FALLBACK_ERROR);
        setPending(false);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor. Intentá de nuevo.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-muted">
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="rounded border border-line bg-background px-3 py-2 font-mono text-foreground outline-none focus:border-ok focus-visible:ring-2 focus-visible:ring-ok/40"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-muted">
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded border border-line bg-background px-3 py-2 font-mono text-foreground outline-none focus:border-ok focus-visible:ring-2 focus-visible:ring-ok/40"
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-critical">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-ok px-4 py-2 font-medium text-background hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ok/60 focus-visible:ring-offset-2 focus-visible:ring-offset-panel disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
