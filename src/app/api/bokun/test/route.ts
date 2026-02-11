import { NextResponse } from 'next/server';
import { getBokunClient } from '@/lib/bokun-client';

export async function GET() {
  try {
    const bokun = getBokunClient();
    
    // Test connection by fetching a simple search (e.g. limit=1)
    // This endpoint works on both v1 and v2 usually for basic check
    const data = await bokun.request('GET', '/activity.json/search?limit=1');
    
    return NextResponse.json({
      status: 'success',
      message: 'Connected to Bokun API successfully',
      data
    });
  } catch (error: any) {
    console.error('Bokun API Error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.message || 'Failed to connect to Bokun API' 
      },
      { status: 500 }
    );
  }
}
