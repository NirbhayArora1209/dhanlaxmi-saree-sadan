import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import { validateSchema } from '@/lib/validation';
import { z } from 'zod';

const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate request body
    const validation = validateSchema(verifyEmailSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification data', details: validation.errors },
        { status: 400 }
      );
    }
    
    const { email, otp } = validation.data;
    
    // Find user by email and OTP
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
      verification_otp: otp,
      verification_otp_expiry: { $gt: new Date() }, // OTP should not be expired
      is_active: true
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Update user as verified and clear OTP
    await UserModel.findByIdAndUpdate(user._id, {
      email_verified: true,
      verification_otp: undefined,
      verification_otp_expiry: undefined,
      updated_at: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}