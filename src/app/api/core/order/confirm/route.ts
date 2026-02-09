import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, verificationCode } = body;

    if (!orderId || !verificationCode) {
      return NextResponse.json({ error: 'Missing orderId or verificationCode' }, { status: 400 });
    }

    // Mock Verification Logic
    // In real world, verify code against DB or logic
    if (verificationCode !== '123456') {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.orderStatus !== 'WAITING') {
      return NextResponse.json({ error: `Order status is ${order.orderStatus}, cannot execute.` }, { status: 400 });
    }

    // Update Status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 'EXECUTED',
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });

  } catch (error) {
    console.error('Confirm order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
