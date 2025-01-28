import { NextResponse } from "next/server";

export async function POST() {
    try {
        console.log("Logout endpoint hit");
        const response = NextResponse.json({ message: "Logout successful" });

        // Clear the authToken cookie
        response.cookies.set("authToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0, // Remove the cookie
            path: "/", // Ensure it clears across the site
        });

        // Perform additional cleanup if necessary (optional)
        // Example: Log logout activity, invalidate tokens, etc.
        console.log("Logout successful");
        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
