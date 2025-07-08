import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import CategoryModel from '@/models/Category';
import { ICategory } from '@/models/Category';
import { 
  successResponse, 
  errorResponse, 
  handleDatabaseError, 
  parseQueryParams,
  getPaginationInfo 
} from '@/lib/api';

// Fallback categories when database is not available
const fallbackCategories = [
  {
    _id: '1',
    name: 'Banarasi Silk',
    slug: 'banarasi-silk',
    description: 'Traditional Banarasi silk sarees with intricate zari work',
    image: '/images/categories/silk-sarees.jpg',
    product_count: 45,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '2',
    name: 'Kanjeevaram Silk',
    slug: 'kanjeevaram-silk',
    description: 'Classic Kanjeevaram silk sarees with temple borders',
    image: '/images/categories/silk-sarees.jpg',
    product_count: 32,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '3',
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    description: 'Modern designer sarees for contemporary women',
    image: '/images/categories/designer-sarees.jpg',
    product_count: 28,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '4',
    name: 'Wedding Collection',
    slug: 'wedding-sarees',
    description: 'Exquisite bridal sarees for your special day',
    image: '/images/categories/wedding-sarees.jpg',
    product_count: 56,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Categories API: Request received');
    
    let categories = [];
    
    try {
      console.log('🔄 Categories API: Attempting database connection...');
      await connectDB();
      
      categories = await CategoryModel.find({ is_active: true })
        .sort({ name: 1 })
        .lean();
        
      console.log('✅ Categories API: Database query successful, found', categories.length, 'categories');
        
    } catch (dbError) {
      console.warn('⚠️ Categories API: Database connection failed, using fallback data:', dbError);
      categories = fallbackCategories;
      console.log('✅ Categories API: Using fallback data, found', categories.length, 'categories');
    }
    
    const response = {
      success: true,
      data: categories,
    };
    
    console.log('✅ Categories API: Returning response with', categories.length, 'categories');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Categories API: Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.description) {
      return errorResponse('Missing required fields', 400, 'Name and description are required');
    }
    
    // Generate slug from name if not provided
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Create category
    const category = new CategoryModel(body);
    await category.save();
    
    return successResponse(category, { message: 'Category created successfully' });
    
  } catch (error) {
    return handleDatabaseError(error);
  }
} 