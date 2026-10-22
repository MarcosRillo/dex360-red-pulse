import { scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

// Format: scrypt$<salt base64url>$<hash base64url>
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, salt, hash] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64url");
  const actual = await scryptAsync(password, Buffer.from(salt, "base64url"), expected.length);
  return timingSafeEqual(actual, expected);
}

// Verified against when the email is unknown, so response time does not reveal which users exist.
export const DECOY_HASH =
  "scrypt$AAAAAAAAAAAAAAAAAAAAAA$kvkchhrZqeagouXc63PL-26Rso1fU-ra5p-BGB5S8hDfrQRKsbSYvnfLT4jfULOxFSe-nTepxbh3_QNr8dBNYQ";
