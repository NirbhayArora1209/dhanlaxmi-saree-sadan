import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import UserModel from '@/models/User';
import { userRegistrationSchema, validateSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate request body
    const validation = validateSchema(userRegistrationSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid registration data', details: validation.errors },
        { status: 400 }
      );
    }
    
    const { name, email, password, phone } = validation.data;
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const user = new UserModel({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: 'customer',
      is_active: true,
      email_verified: false
    });
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.email_verified
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 