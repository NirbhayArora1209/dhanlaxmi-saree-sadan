import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'password'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`Missing required field: ${field}`);
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return errorResponse('User with this email already exists');
    }

    // Create new user
    const user = new User({
      name: body.name,
      email: body.email.toLowerCase(),
      password: body.password,
      phone: body.phone
    });

    await user.save();

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
    }, 'User registered successfully');

  } catch (error: any) {
    console.error('Error registering user:', error);
    
    if (error.code === 11000) {
      return errorResponse('User with this email already exists');
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return errorResponse(messages.join(', '));
    }

    return serverErrorResponse('Failed to register user');
  }
} 