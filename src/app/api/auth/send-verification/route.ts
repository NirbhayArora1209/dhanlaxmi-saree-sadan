import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import { userEmailSchema, validateSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate request body
    const validation = validateSchema(userEmailSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address', details: validation.errors },
        { status: 400 }
      );
    }
    
    const { email } = validation.data;
    
    // Find user by email
    const user = await UserModel.findOne({ 
      email: email.toLowerCase(),
      is_active: true 
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.email_verified) {
      return NextResponse.json(
        { success: false, error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await UserModel.findByIdAndUpdate(user._id, {
      verification_otp: otp,
      verification_otp_expiry: otpExpiry
    });

    // In a real application, you would send an email here
    // For now, we'll just log it for development
    console.log('Email verification OTP for', email, ':', otp);
    console.log('OTP expires at:', otpExpiry);

    // TODO: Send email with OTP
    // await sendVerificationEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: 'Verification OTP sent to your email address'
    });

  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}