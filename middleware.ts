import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

async function verifyToken(token: string) {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload; // Return the decoded payload if verification succeeds
    } catch (err) {
        return null; // Return null if verification fails
    }
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
        // Redirect unauthenticated users trying to access protected pages
        if (!["/login", "/signup"].includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else {
        const payload = await verifyToken(token);

        if (!payload) {
            // If token verification fails, redirect to login
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Protect the /admin route
        if (request.nextUrl.pathname.startsWith("/admin")) {
            // Redirect non-admin users trying to access the admin panel
            if (!payload.isAdmin) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }

        // Redirect authenticated users away from login/signup
        if (["/login", "/signup"].includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|favicon.ico).*)"], // Protect all pages except API, static files, etc.
};
