import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TIER_CONFIG } from '@/lib/credit-types';
import { generateGuideId, generateGuideNumber } from '@/lib/host-id';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hostProfile, meetupPrice, productPrice, payoutId, ...guideData } = body;

    if (!hostProfile?.email) {
       return NextResponse.json({ error: "Host email is required" }, { status: 400 });
    }

    // 1. Retrieve Host
    const host = await prisma.host.findUnique({ 
        where: { email: hostProfile.email } 
    });

    if (!host) {
        return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    // 2. Level Check
    if (host.level === 0) {
      return NextResponse.json(
        { error: "Please activate Level 1 first." },
        { status: 403 }
      );
    }

    // 3. Price Check
    const requestedPrice = Math.max(Number(meetupPrice || 0), Number(productPrice || 0));
    // Safe check for tier config existence
    const tierConfig = TIER_CONFIG[host.level as keyof typeof TIER_CONFIG];
    
    if (requestedPrice > tierConfig.maxPrice) {
      return NextResponse.json(
        { error: `Price exceeds your current tier limit (¥${tierConfig.maxPrice}). Upgrade to unlock higher rates.` },
        { status: 400 }
      );
    }

    // 4. Generate Guide ID & Number
    // We use the current guideCount + 1 for the new ID
    const guideCount = await prisma.guide.count({ where: { hostId: host.id } });
    const newGuideSequence = guideCount + 1;
    
    // Global sequence for the unique Guide Number to avoid collision
    const totalGuideCount = await prisma.guide.count();
    const globalSequence = totalGuideCount + 1;
    
    // Ensure hostId exists (it should if Level > 0)
    const hostIdString = host.buddyId || "UNKNOWN"; 
    const newGuideId = generateGuideId(hostIdString, newGuideSequence);
    
    // Generate Custom Guide Number (Country + Date + Time + GlobalSequence)
    const countryForId = hostProfile?.country || host.country || "Japan";
    const guideNumber = generateGuideNumber(countryForId, globalSequence);

    // 5. Create Guide & Update Host
    // Transaction to ensure atomicity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
        // Create Guide
        const guide = await tx.guide.create({
            data: {
                guideNumber: guideNumber, // Save the custom ID
                title: guideData.title || "Untitled Guide",
                content: JSON.stringify({
                    ...guideData,
                    guideId: newGuideId,
                    guideNumber: guideNumber, // Also store in content for easy access
                    locations: guideData.locations || [],
                    duration: guideData.duration || "",
                    meetingPoint: guideData.meetingPoint || "",
                    productPrice: Number(productPrice || 0),
                    meetupPrice: Number(meetupPrice || 0),
                    targetLanguage: guideData.targetLanguage || [],
                }),
                hostId: host.id,
                status: "PENDING_REVIEW", // Matches schema default "PENDING" but code used "PENDING_REVIEW"
                // Schema default is "PENDING". Code uses "PENDING_REVIEW". 
                // Status is String, so it's fine.
            }
        });

        // Update Host Stats and PayPay ID and Profile Info
        await tx.host.update({
            where: { id: host.id },
            data: {
                paypayId: payoutId || host.paypayId,
                realName: hostProfile?.fullName || host.realName,
                phone: hostProfile?.phone || host.phone,
                country: hostProfile?.country || host.country,
                gender: hostProfile?.gender || host.gender,
                lineId: hostProfile?.lineId || host.lineId,
                snsAccounts: hostProfile?.snsAccounts || host.snsAccounts,
            }
        });

        return { ...guide, guideId: newGuideId };
    });

    return NextResponse.json({
      success: true,
      message: 'Guide published successfully',
      guideId: result.guideId,
      status: result.status,
      hostLevel: host.level
    });

  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
