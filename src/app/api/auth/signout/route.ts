import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Clear the session
    // In a real app, you might want to invalidate the session token here
    
    return NextResponse.json(
      { message: 'Successfully signed out' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
