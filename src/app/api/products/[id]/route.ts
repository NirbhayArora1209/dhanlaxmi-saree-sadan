import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const product = await Product.findById(params.id).lean();

    if (!product) {
      return notFoundResponse('Product not found');
    }

    return successResponse(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    return serverErrorResponse('Failed to fetch product');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      { ...body, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return notFoundResponse('Product not found');
    }

    return successResponse(product, 'Product updated successfully');

  } catch (error: any) {
    console.error('Error updating product:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return errorResponse(messages.join(', '));
    }

    return serverErrorResponse('Failed to update product');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      { is_active: false },
      { new: true }
    );

    if (!product) {
      return notFoundResponse('Product not found');
    }

    return successResponse(null, 'Product deleted successfully');

  } catch (error) {
    console.error('Error deleting product:', error);
    return serverErrorResponse('Failed to delete product');
  }
} 