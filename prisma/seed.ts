import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Hosts
  const hostsData = [
    { nickname: 'Sakura', email: 'sakura@example.com', level: 0 },
    { nickname: 'Kenji', email: 'kenji@example.com', level: 1, realName: 'Kenji Tanaka', phone: '090-1111-2222' },
    { nickname: 'Yuki', email: 'yuki@example.com', level: 2, realName: 'Yuki Sato', phone: '090-3333-4444' },
    { nickname: 'Hiro', email: 'hiro@example.com', level: 4, realName: 'Hiro Suzuki', phone: '090-5555-6666' },
    { nickname: 'Master Ryu', email: 'ryu@example.com', level: 5, realName: 'Ryu Yamamoto', phone: '090-7777-8888', legendStatus: 'APPROVED' },
  ];

  for (const host of hostsData) {
    await prisma.host.upsert({
      where: { email: host.email },
      update: {},
      create: {
        nickname: host.nickname,
        email: host.email,
        level: host.level,
        realName: host.realName,
        phone: host.phone,
        legendStatus: host.legendStatus || 'NOT_APPLIED',
        buddyId: `TATAMI-BUDDY-JP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      },
    });
  }

  // 2. Create Visitors
  const visitorsData = [
    { email: 'visitor1@example.com', visitorId: 'TATAMI-VISITOR-0001', nickname: 'Alice' },
    { email: 'visitor2@example.com', visitorId: 'TATAMI-VISITOR-0002', nickname: 'Bob' },
  ];

  for (const visitor of visitorsData) {
    await prisma.visitor.upsert({
      where: { email: visitor.email },
      update: {},
      create: visitor,
    });
  }

  // 3. Create Guides
  const hostKenji = await prisma.host.findUnique({ where: { email: 'kenji@example.com' } });
  if (hostKenji) {
    await prisma.guide.create({
      data: {
        title: 'Hidden Bars in Shinjuku',
        content: 'Experience the best hidden bars...',
        status: 'APPROVED',
        hostId: hostKenji.id,
      },
    });
  }
  
  const hostYuki = await prisma.host.findUnique({ where: { email: 'yuki@example.com' } });
  if (hostYuki) {
     await prisma.guide.create({
      data: {
        title: 'Harajuku Fashion Walk',
        content: 'Walk through the fashion streets...',
        status: 'UNDER_REVIEW',
        hostId: hostYuki.id,
      },
    });
  }

  // 4. Create Orders
  // Need valid IDs
  const visitorAlice = await prisma.visitor.findUnique({ where: { email: 'visitor1@example.com' } });
  const guideShinjuku = await prisma.guide.findFirst({ where: { title: 'Hidden Bars in Shinjuku' } });

  if (visitorAlice && hostKenji && guideShinjuku) {
    await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-01`,
        orderStatus: 'WAITING',
        amount: 5000,
        meetingTime: new Date(Date.now() + 86400000), // Tomorrow
        hostId: hostKenji.id,
        visitorId: visitorAlice.id,
        guideId: guideShinjuku.id,
      },
    });
    
    await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-02`,
        orderStatus: 'EXECUTED',
        amount: 6000,
        meetingTime: new Date(Date.now() - 86400000), // Yesterday
        hostId: hostKenji.id,
        visitorId: visitorAlice.id,
        guideId: guideShinjuku.id,
      },
    });
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
