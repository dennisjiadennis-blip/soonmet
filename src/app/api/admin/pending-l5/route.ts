import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendingHosts = await prisma.host.findMany({
      where: {
        legendStatus: "PENDING"
      },
      select: {
        id: true,
        buddyId: true,
        realName: true,
        level: true,
        createdAt: true,
        email: true
      }
    });

    return NextResponse.json({ hosts: pendingHosts });
  } catch (error) {
    console.error("Fetch pending error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
