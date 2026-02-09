import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hostId, action } = body;
    
    // action: "APPLY_L5" | "APPROVE_L5" | "REJECT_L5"
    
    if (!hostId) {
      return NextResponse.json({ error: "Host ID required" }, { status: 400 });
    }

    // Allow finding by internal ID or hostId (TATAMI-BUDDY...)
    const host = await prisma.host.findFirst({
      where: { 
        OR: [
          { buddyId: hostId },
          { id: hostId }
        ]
      },
    });

    if (!host) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    if (action === "UPGRADE_L3") {
      const { tags } = body;
      
      const updated = await prisma.host.update({
        where: { id: host.id },
        data: {
          level: 3,
          isIdentityVerified: true, // Assuming files are verified
          specialTags: JSON.stringify(tags || [])
        }
      });
      
      return NextResponse.json({ success: true, host: updated });
    }

    if (action === "APPLY_L5") {
      // Host applying for Legend Buddy
      // Ideally check if host.currentLevel === 4, but for dev/testing we might relax or strict check
      if (host.level < 4) {
         // return NextResponse.json({ error: "Must be Level 4 to apply" }, { status: 403 });
         // For now, allow it for testing if needed, or strictly follow rules.
         // Prompt says "Entrance: Only L4 users". I will enforce it.
         return NextResponse.json({ error: "Must be Level 4 to apply" }, { status: 403 });
      }
      
      // const { languages, exclusiveNetwork } = data;
      
      const updated = await prisma.host.update({
        where: { id: host.id },
        data: {
          legendStatus: "PENDING",
          // languages: languages || [], // Schema doesn't support yet
          // exclusiveNetwork: exclusiveNetwork || "", // Schema doesn't support yet
        }
      });
      
      return NextResponse.json({ success: true, host: updated });
    }
    
    if (action === "APPROVE_L5") {
      // Admin approving
      // In real app, check admin auth here.
      
      const updated = await prisma.host.update({
        where: { id: host.id },
        data: {
          legendStatus: "APPROVED",
          level: 5
        }
      });
      
      return NextResponse.json({ success: true, host: updated });
    }

    if (action === "REJECT_L5") {
        const updated = await prisma.host.update({
          where: { id: host.id },
          data: {
            legendStatus: "REJECTED"
            // Keep level as is (4)
          }
        });
        return NextResponse.json({ success: true, host: updated });
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Tier update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
