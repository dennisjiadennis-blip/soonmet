import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hostId, title, content, realName, phone } = body;

    if (!hostId || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const host = await prisma.host.findUnique({
      where: { id: hostId },
    });

    if (!host) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 });
    }

    let updatedHost = host;

    // Host Publishing Interceptor
    if (host.level === 0) {
      if (!realName || !phone) {
        return NextResponse.json({ 
          error: 'Level 0 hosts must provide realName and phone to publish.',
          requiredAction: 'COMPLETE_PROFILE' 
        }, { status: 403 });
      }

      // Upgrade Host
      updatedHost = await prisma.host.update({
        where: { id: hostId },
        data: {
          realName,
          phone,
          level: 1,
        },
      });
    }

    // Create Guide
    const guide = await prisma.guide.create({
      data: {
        title,
        content,
        status: 'UNDER_REVIEW', // Always enters UNDER_REVIEW as per instruction
        hostId: host.id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      guide, 
      hostLevel: updatedHost.level 
    });

  } catch (error) {
    console.error('Publish guide error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
