import { SignJWT, jwtVerify } from "jose";
import "dotenv/config";
import { JWTPayload } from "jose";
export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
if (!JWT_SECRET) throw new Error("JWT_SECRET env variable is not set.");

export async function generateToken(
  userId: string,
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
): Promise<{ userId: string; email: string }> {
  const verifiedToken = await jwtVerify(token, JWT_SECRET);
  const payload = verifiedToken.payload as TokenPayload;
  return { userId: payload.userId, email: payload.email };
}
