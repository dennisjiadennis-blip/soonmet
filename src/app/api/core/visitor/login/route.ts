import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, location, nickname } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Upsert visitor: Create if not exists, update if exists
    // Logic: visitCount + 1, update location
    const visitor = await prisma.visitor.upsert({
      where: { email },
      create: {
        email,
        visitorId: `TATAMI-VISITOR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        nickname: nickname || 'New Visitor',
        location: location || 'Unknown',
        visitCount: 1,
        loginStatus: true,
      },
      update: {
        visitCount: { increment: 1 },
        location: location,
        loginStatus: true,
        // Update nickname only if provided
        ...(nickname ? { nickname } : {}),
      },
    });

    return NextResponse.json({ success: true, visitor });
  } catch (error) {
    console.error('Visitor login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
