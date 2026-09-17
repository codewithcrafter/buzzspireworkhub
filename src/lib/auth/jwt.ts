import { SignJWT, jwtVerify, JWTPayload } from "jose";

export interface AuthJwtPayload extends JWTPayload {
  sub: string;
  employeeId: string;
  email: string;
  role: string;
  sessionId: string;
}

export const getJwtSecretKey = (): Uint8Array => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: JWT_SECRET environment variable is missing in production.");
    }
    return new TextEncoder().encode("default_buzzspire_workhub_jwt_secret_key_2026_dev");
  }
  return new TextEncoder().encode(secret);
};

/**
 * Signs a JWT with standard claims.
 */
export async function signAuthToken(
  payload: Omit<AuthJwtPayload, "iat" | "exp">,
  expiresIn: string = "1d"
): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecretKey());
}

/**
 * Verifies and decodes a JWT token.
 */
export async function verifyAuthToken(token: string): Promise<AuthJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as unknown as AuthJwtPayload;
  } catch {
    return null;
  }
}
