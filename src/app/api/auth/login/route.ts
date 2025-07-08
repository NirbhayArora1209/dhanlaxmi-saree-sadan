import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { IUser } from '@/models/User';
import UserModel from '@/models/User';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleDatabaseError } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return errorResponse('Email and password are required', 400);
    }

    // Find user by email
    const user = await UserModel.findOne({ 
      email: body.email.toLowerCase(),
      is_active: true
    }) as IUser | null;

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(body.password);
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role
    });

    // Return user data without password
    const userData = {
      _id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      email_verified: user.email_verified
    };

    return successResponse({
      user: userData,
      token
    });

  } catch (error) {
    return handleDatabaseError(error);
  }
} 