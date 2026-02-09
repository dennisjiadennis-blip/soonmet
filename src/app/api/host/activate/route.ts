import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateHostId } from '@/lib/host-id';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, nickname, phone, realName, lineId } = body;

    if (!email || !nickname || !phone || !realName || !lineId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find host
    const host = await prisma.host.findUnique({
      where: { email },
    });

    if (!host) {
      // For dev/demo purposes, if host doesn't exist, create one at Level 0 first?
      // No, the flow assumes they are already registered (Level 0).
      // But in this dev env, maybe they aren't in DB yet?
      // Let's return 404.
      return NextResponse.json({ error: 'Host not found' }, { status: 404 });
    }

    // If already Level 1+, just return success
    if (host.level > 0) {
      return NextResponse.json({ 
        success: true, 
        hostId: host.buddyId,
        level: host.level
      });
    }

    // Generate Host ID
    const newHostId = generateHostId();

    // Update Host
    const updatedHost = await prisma.host.update({
      where: { email },
      data: {
        level: 1,
        buddyId: newHostId,
        nickname,
        phone,
        realName,
        lineId,
      },
    });

    return NextResponse.json({
      success: true,
      hostId: updatedHost.buddyId,
      level: updatedHost.level
    });

  } catch (error) {
    console.error('Activation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
