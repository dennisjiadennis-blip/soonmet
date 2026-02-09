import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const host = await prisma.host.findUnique({
      where: { email },
      include: {
        _count: {
          select: { guides: true },
        },
      },
    });

    if (!host) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 });
    }

    // Transform to HostProfile interface expected by frontend
    const hostProfile = {
      hostId: host.buddyId || host.id,
      currentLevel: host.level,
      guideCount: host._count.guides,
      nickname: host.nickname,
              country: host.country,
              gender: host.gender,
              ageRange: host.ageRange,
              paypayId: host.paypayId,
              realName: host.realName,
      phone: host.phone,
      email: host.email,
      lineId: host.lineId,
      whatsapp: host.whatsapp,
      snsAccounts: host.snsAccounts,
      specialTags: host.specialTags ? JSON.parse(host.specialTags) : [],
    };

    return NextResponse.json(hostProfile);
  } catch (error) {
    console.error('Error fetching host profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
