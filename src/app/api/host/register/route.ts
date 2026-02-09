import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, nickname, country, gender } = await request.json();
    
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if exists
    const existing = await prisma.host.findUnique({ where: { email } });
    if (existing) {
       return NextResponse.json({ success: true, host: existing });
    }
    
    // Create Level 0 Host
    // We use a mock userId for now since we don't have a full auth system
    const host = await prisma.host.create({
      data: {
        email,
        buddyId: `host_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        level: 0,
        nickname,
        country,
        gender
      }
    });
    
    return NextResponse.json({ success: true, host });
  } catch (error) {
     console.error("Registration error:", error);
     return NextResponse.json({ error: 'Failed to register host' }, { status: 500 });
  }
}
