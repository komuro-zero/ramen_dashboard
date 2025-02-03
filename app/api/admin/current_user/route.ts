import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

interface DecodedToken extends JwtPayload {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  isApproved: boolean;
}

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const authToken = cookies
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!JWT_SECRET) {
      throw new Error("Missing JWT_SECRET");
    }

    const decoded = jwt.verify(authToken, JWT_SECRET) as DecodedToken;

    if (!decoded || !decoded.id) {
      throw new Error("Invalid token");
    }

    return NextResponse.json({
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      isAdmin: decoded.isAdmin,
      isApproved: decoded.isApproved,
    });
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
