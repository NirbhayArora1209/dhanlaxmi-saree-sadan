import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import { validateSchema } from '@/lib/validation';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate request body
    const validation = validateSchema(resetPasswordSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid reset data', details: validation.errors },
        { status: 400 }
      );
    }
    
    const { token, password } = validation.data;
    
    // Find user by reset token
    const user = await UserModel.findOne({
      reset_token: token,
      reset_token_expiry: { $gt: new Date() }, // Token should not be expired
      is_active: true
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user with new password and clear reset token
    await UserModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      reset_token: undefined,
      reset_token_expiry: undefined,
      updated_at: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully reset'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}