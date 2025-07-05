import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const featured = searchParams.get('featured');

    // Build query
    const query: any = { is_active: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query['pricing.selling_price'] = {};
      if (minPrice) query['pricing.selling_price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.selling_price'].$lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      query.is_featured = true;
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Execute query
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return serverErrorResponse('Failed to fetch products');
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'images', 'pricing', 'specifications', 'inventory'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`Missing required field: ${field}`);
      }
    }

    // Create new product
    const product = new Product(body);
    await product.save();

    return successResponse(product, 'Product created successfully');

  } catch (error: any) {
    console.error('Error creating product:', error);
    
    if (error.code === 11000) {
      return errorResponse('Product with this SKU already exists');
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return errorResponse(messages.join(', '));
    }

    return serverErrorResponse('Failed to create product');
  }
} 