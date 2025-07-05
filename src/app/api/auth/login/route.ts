import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, serverErrorResponse, unauthorizedResponse } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return errorResponse('Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ 
      email: body.email.toLowerCase(),
      is_active: true
    });

    if (!user) {
      return unauthorizedResponse('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(body.password);
    if (!isPasswordValid) {
      return unauthorizedResponse('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Return user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      email_verified: user.email_verified
    };

    return successResponse({
      user: userData,
      token
    }, 'Login successful');

  } catch (error) {
    console.error('Error logging in:', error);
    return serverErrorResponse('Failed to login');
  }
} 