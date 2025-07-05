import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const categories = await Category.find({ is_active: true })
      .sort({ name: 1 })
      .lean();

    // Update product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ 
          category: category.slug, 
          is_active: true 
        });
        return { ...category, product_count: count };
      })
    );

    return successResponse(categoriesWithCounts);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return serverErrorResponse('Failed to fetch categories');
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'image'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`Missing required field: ${field}`);
      }
    }

    // Check if category with same slug already exists
    const existingCategory = await Category.findOne({ slug: body.slug });
    if (existingCategory) {
      return errorResponse('Category with this slug already exists');
    }

    // Create new category
    const category = new Category(body);
    await category.save();

    return successResponse(category, 'Category created successfully');

  } catch (error: any) {
    console.error('Error creating category:', error);
    
    if (error.code === 11000) {
      return errorResponse('Category with this slug already exists');
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return errorResponse(messages.join(', '));
    }

    return serverErrorResponse('Failed to create category');
  }
} 