import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, ...updates } = data;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Filter out fields that shouldn't be updated directly or map them if needed
    // The Host model fields: realName, phone, lineId, paypayId, snsAccounts, preferredContactTime (not in schema? check schema)
    
    // Schema check:
    // realName, nickname, phone, email, country, gender, lineId, paypayId, snsAccounts, level, legendStatus
    // preferredContactTime is NOT in schema. We might need to store it in snsAccounts or ignore it for now.
    // Or we can add it to schema. But modifying schema requires migration.
    // For now, let's assume we only update what's in schema.
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (updates.fullName) updateData.realName = updates.fullName; // Map fullName to realName
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.lineId) updateData.lineId = updates.lineId;
    if (updates.whatsapp) updateData.whatsapp = updates.whatsapp;
    if (updates.paypayId) updateData.paypayId = updates.paypayId;
    if (updates.snsAccounts) updateData.snsAccounts = updates.snsAccounts;
    if (updates.specialTags) updateData.specialTags = JSON.stringify(updates.specialTags);
    if (updates.nickname) updateData.nickname = updates.nickname;
    if (updates.country) updateData.country = updates.country;
    if (updates.gender) updateData.gender = updates.gender;
    if (updates.ageRange) updateData.ageRange = updates.ageRange;

    const updatedHost = await prisma.host.update({
      where: { email },
      data: updateData
    });

    return NextResponse.json({ success: true, host: updatedHost });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
