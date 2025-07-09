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

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await UserModel.findByIdAndUpdate(user._id, {
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry
    });

    // In a real application, you would send an email here
    // For now, we'll just log it for development
    console.log('Password reset token for', email, ':', resetToken);
    console.log('Reset URL:', `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`);

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}