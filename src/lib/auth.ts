import { SignJWT, jwtVerify } from "jose";

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "default_super_secret_key_buzzspire_media";
  if (!secret) {
    throw new Error("JWT Secret key is not set");
  }
  return new TextEncoder().encode(secret);
};

export async function signJwt(payload: any, expiresIn: string = "1d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecretKey());
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}
