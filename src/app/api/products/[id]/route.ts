import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import ProductModel from '@/models/Product';
import { 
  successResponse, 
  errorResponse, 
  handleDatabaseError 
} from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await connectDB();
    
    const product = await ProductModel.findById(params.id).lean();
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (!product.is_active) {
      return NextResponse.json(
        { success: false, error: 'Product is not available' },
        { status: 404 }
      );
    }

    // Sanitize images: ensure they have proper structure
    if (Array.isArray(product.images)) {
      product.images = product.images.map((img: any) => ({
        url: img.url,
        view_type: img.view_type,
        alt_text: img.alt_text
      }));
    }
    
    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await connectDB();
    
    const { id: productId } = params;
    const body = await request.json();
    
    // Check if product exists
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return errorResponse('Product not found', 404, 'The requested product does not exist');
    }
    
    // Update product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { ...body },
      { new: true, runValidators: true }
    );
    
    return successResponse(updatedProduct, { message: 'Product updated successfully' });
    
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await connectDB();
    
    const { id: productId } = params;
    
    // Check if product exists
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return errorResponse('Product not found', 404, 'The requested product does not exist');
    }
    
    // Soft delete by setting is_active to false
    await ProductModel.findByIdAndUpdate(productId, { is_active: false });
    
    return successResponse({}, { message: 'Product deleted successfully' });
    
  } catch (error) {
    return handleDatabaseError(error);
  }
} 