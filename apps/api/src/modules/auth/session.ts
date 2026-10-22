import { SignJWT, jwtVerify } from "jose";
import { SessionUserSchema, type SessionUser } from "@red-pulse/contracts";

const key = (secret: string) => new TextEncoder().encode(secret);

export async function signSession(user: SessionUser, secret: string, ttlSeconds: number): Promise<string> {
  return new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(key(secret));
}

// Returns null for any invalid token: bad signature, expired, or wrong shape.
export async function verifySession(token: string, secret: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, key(secret), { algorithms: ["HS256"] });
    const parsed = SessionUserSchema.safeParse({ ...payload, id: payload.sub });
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
