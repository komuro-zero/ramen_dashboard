import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import path based on your setup

// GET: Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PUT: Update isAdmin or isApproved status for a user
export async function PUT(request: Request) {
  try {
    const { userId, isApproved, isAdmin } = await request.json();

    if (
      typeof userId !== "number" ||
      (typeof isApproved !== "boolean" && typeof isAdmin !== "boolean")
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(typeof isApproved === "boolean" && { isApproved }),
        ...(typeof isAdmin === "boolean" && { isAdmin }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
