import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { IUser } from '@/models/User';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleDatabaseError } from '@/lib/api';
import UserModel from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'password'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`Missing required field: ${field}`, 400);
      }
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return errorResponse('User with this email already exists', 409);
    }

    // Create new user
    const user = new UserModel({
      name: body.name,
      email: body.email.toLowerCase(),
      password: body.password,
      phone: body.phone
    });

    await user.save();

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