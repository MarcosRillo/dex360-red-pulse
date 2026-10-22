export interface AppConfig {
  sessionSecret: string;
  secureCookies: boolean;
  sessionTtlSeconds: number;
}

const DEV_SECRET = "red-pulse-local-development-secret-only";

export function loadConfig(env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env): AppConfig {
  const production = env.NODE_ENV === "production";
  const secret = env.SESSION_SECRET;

  if (production && !secret) throw new Error("SESSION_SECRET is required in production");
  if (secret !== undefined && secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");

  return {
    sessionSecret: secret ?? DEV_SECRET,
    secureCookies: production,
    sessionTtlSeconds: 60 * 60 * 8,
  };
}
