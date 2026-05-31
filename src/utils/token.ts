import { SignJWT, jwtVerify } from "jose";
import "dotenv/config";
import { JWTPayload } from "jose";
export interface TokenPayload extends JWTPayload {
  userId: number;
  email: string;
}
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_key=asc1scak4ubo1 u3813f8b038y071",
);

export async function generateToken(
  userId: number,
  email: string,
): Promise<string> {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .setIssuedAt()
    .sign(JWT_SECRET);

  return token;
}
export async function verifyToken(
  token: string,
): Promise<{ userId: number; email: string }> {
  const verifiedToken = await jwtVerify(token, JWT_SECRET);
  const payload = verifiedToken.payload as TokenPayload;
  return { userId: payload.userId, email: payload.email };
}
