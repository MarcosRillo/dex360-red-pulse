import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Ingresá un email válido")),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const SessionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.string(),
});

export type SessionUser = z.infer<typeof SessionUserSchema>;

export const ApiErrorSchema = z.object({
  error: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const SESSION_COOKIE = "rp_session";
