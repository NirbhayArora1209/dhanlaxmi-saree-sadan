import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import { userLoginSchema, validateSchema } from '@/lib/validation';

// This API route is for custom login handling if needed
// NextAuth will handle most authentication through /api/auth/[...nextauth]
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate request body
    const validation = validateSchema(userLoginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid login data', details: validation.errors },
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data;
    
    // Find user by email
    const user = await UserModel.findOne({ 
      email: email.toLowerCase(),
      is_active: true
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data without password
    const userData = {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      emailVerified: user.email_verified
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 