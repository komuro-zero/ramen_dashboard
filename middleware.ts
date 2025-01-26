import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("authToken");

    if (!token && !["/login", "/signup"].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|favicon.ico).*)"], // Protect all pages except API, static files, etc.
};
