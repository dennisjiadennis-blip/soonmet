import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.orderStatus !== 'EXECUTED') {
      return NextResponse.json({ error: `Order status is ${order.orderStatus}, cannot submit to platform. Must be EXECUTED first.` }, { status: 400 });
    }

    // Simulate API Call to External Platform (ZESDA)
    // await fetch('https://api.zesda.jp/sync', ...)

    // Update Status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 'SUBMITTED',
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });

  } catch (error) {
    console.error('Submit platform error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
