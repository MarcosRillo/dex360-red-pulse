import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SessionUserSchema } from "@red-pulse/contracts";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

interface Schema<T> {
  parse(data: unknown): T;
}

/**
 * Calls the API from a Server Component, forwarding the browser's cookie.
 * A 401 means the session is gone, so it sends the user back to /login.
 */
export async function apiGet<T>(path: string, schema: Schema<T>): Promise<T> {
  const cookie = (await headers()).get("cookie");
  const response = await fetch(`${API_URL}${path}`, {
    headers: cookie ? { cookie } : {},
    cache: "no-store",
  });

  if (response.status === 401) redirect("/login?reason=expired");
  if (!response.ok) throw new Error(`API ${path} responded ${response.status}`);

  return schema.parse(await response.json());
}

export function getSessionUser() {
  return apiGet("/api/auth/me", SessionUserSchema);
}
