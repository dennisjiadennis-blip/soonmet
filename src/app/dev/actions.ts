'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getDevData() {
  const pendingGuides = await prisma.guide.findMany({
    where: { status: 'UNDER_REVIEW' },
    include: { host: true },
  });

  const hosts = await prisma.host.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const orders = await prisma.order.findMany({
    include: { host: true, visitor: true, guide: true },
    orderBy: { createdAt: 'desc' },
  });

  const visitors = await prisma.visitor.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return { pendingGuides, hosts, orders, visitors };
}

export async function approveGuide(guideId: string) {
  await prisma.guide.update({
    where: { id: guideId },
    data: { status: 'APPROVED' },
  });
  revalidatePath('/dev');
}

export async function upgradeHostToLegend(hostId: string) {
  await prisma.host.update({
    where: { id: hostId },
    data: { 
      level: 5,
      legendStatus: 'APPROVED'
    },
  });
  revalidatePath('/dev');
}

export async function resetOrder(orderId: string) {
    await prisma.order.update({
        where: { id: orderId },
        data: { orderStatus: 'WAITING' }
    });
    revalidatePath('/dev');
}

export async function updateVisitorLocation(formData: FormData) {
  const visitorId = formData.get('visitorId') as string;
  const location = formData.get('location') as string;
  
  await prisma.visitor.update({
    where: { id: visitorId },
    data: { location },
  });
  revalidatePath('/dev');
}
