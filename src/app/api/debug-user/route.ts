import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await UserModel.findOne({ 
      email: email.toLowerCase() 
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        email: email.toLowerCase()
      });
    }

    // Return user details (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        email_verified: user.email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
        passwordStartsWith: user.password ? user.password.substring(0, 7) : null,
        hasComparePasswordMethod: typeof user.comparePassword === 'function',
        verification_otp: user.verification_otp,
        verification_otp_expiry: user.verification_otp_expiry
      }
    });

  } catch (error) {
    console.error('Debug user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}