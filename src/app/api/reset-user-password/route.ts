import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
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
        error: 'User not found'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user with new password and verify email
    await UserModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      email_verified: true, // Also verify email to avoid verification issues
      verification_otp: undefined,
      verification_otp_expiry: undefined,
      updated_at: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully and email verified',
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        email_verified: true
      }
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}