import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      );
    }

    // Mock verification logic
    // In a real app, check DB for this code associated with an active booking
    
    // Demo: Code "123456" is valid
    if (code === '123456') {
      return NextResponse.json({
        success: true,
        verified: true,
        bookingId: 'bk_' + Date.now(),
        visitorName: 'Alice Smith',
        amount: 5000,
        status: 'payout_processing'
      });
    } else {
      return NextResponse.json({
        success: false,
        verified: false,
        message: 'Invalid or expired code'
      }, { status: 400 });
    }

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
