"use client";

import { useState } from "react";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      // Full document navigation on purpose: Next keeps visited routes alive (hidden) with
      // <Activity>, so a client-side navigation would leave the dashboard and its data in the DOM.
      window.location.replace("/login");
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="rounded border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:opacity-60"
    >
      Cerrar sesión
    </button>
  );
}
