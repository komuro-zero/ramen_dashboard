import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
interface DecodedToken extends JwtPayload {
  isAdmin: boolean;
}

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const authToken = cookies
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!authToken) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }
    if (!JWT_SECRET) {
      throw new Error("Server Error");
    }

    const decoded = jwt.verify(authToken, JWT_SECRET) as DecodedToken;
    if (!decoded) {
      throw new Error("Invalid token");
    }
    return NextResponse.json({ isAdmin: decoded?.isAdmin }, { status: 200 });
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
}
