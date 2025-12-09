import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// Disable body parsing for this route
// This is necessary for Next.js API routes when using form data
// and the new App Router

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in the User model
    });

    await user.save();

    // Return user data without password
    const { password: _, ...userData } = user.toObject();

    return NextResponse.json(
      { user: userData, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
