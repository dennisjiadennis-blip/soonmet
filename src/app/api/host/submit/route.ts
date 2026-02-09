import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      title, 
      locations, 
      payoutId, 
      earliestServiceDate, 
      standards,
      hostProfile
    } = body;

    if (!title || !locations || !payoutId || !earliestServiceDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate Host Profile
    if (!hostProfile?.email || !hostProfile?.fullName || !hostProfile?.phone) {
        return NextResponse.json(
            { error: 'Missing required profile fields (Email, Name, Phone)' },
            { status: 400 }
        );
    }

    if (!standards?.noDiscrimination || !standards?.boundaryConfirmed) {
      return NextResponse.json(
        { error: 'Must agree to service standards' },
        { status: 400 }
      );
    }

    // Mock database save
    console.log('Received Host Application:', body);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: 'app_' + Date.now(),
      status: 'pending_audit'
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
