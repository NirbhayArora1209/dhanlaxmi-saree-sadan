import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import WishlistModel, { IWishlist } from '@/models/Wishlist';
import ProductModel from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';
import { successResponse, errorResponse, handleDatabaseError } from '@/lib/api';

// Get user wishlist
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Wishlist API GET: Request received');
    await connectDB();
    
    // For now, return empty wishlist if no user authentication
    // TODO: Implement proper authentication
    const mockUserId = new mongoose.Types.ObjectId();
    
    let wishlist = await WishlistModel.findOne({ user_id: mockUserId }).lean();
    
    if (!wishlist) {
      console.log('ℹ️ Wishlist API GET: No wishlist found, creating empty wishlist response');
      return successResponse({
        items: [],
        total_items: 0
      });
    }
    
    console.log('✅ Wishlist API GET: Wishlist found with', wishlist.items.length, 'items');
    
    // Transform wishlist data to match frontend expectations
    const response = {
      items: wishlist.items,
      total_items: wishlist.items.length
    };
    
    return successResponse(response);
  } catch (error) {
    console.error('❌ Wishlist API GET: Error:', error);
    return handleDatabaseError(error);
  }
}

// Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Wishlist API POST: Request received');
    await connectDB();
    
    const body = await request.json();
    const { productId } = body;
    
    if (!productId) {
      return errorResponse('Product ID is required', 400);
    }
    
    // Validate product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return errorResponse('Product not found', 404);
    }
    
    // For now, use mock user ID
    // TODO: Get actual user from authentication
    const mockUserId = new mongoose.Types.ObjectId();
    
    let wishlist = await WishlistModel.findOne({ user_id: mockUserId });
    
    if (!wishlist) {
      // Create new wishlist
      wishlist = new WishlistModel({
        user_id: mockUserId,
        items: []
      });
    }
    
    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(
      item => item.product_id.toString() === productId
    );
    
    if (existingItem) {
      return errorResponse('Item already in wishlist', 400);
    }
    
    // Add new item
    wishlist.items.push({
      product_id: new mongoose.Types.ObjectId(productId),
      name: product.name,
      price: product.pricing.selling_price,
      image: product.images[0]?.url || '/images/products/placeholder.jpg',
      added_at: new Date()
    } as any);
    
    await wishlist.save();
    console.log('✅ Wishlist API POST: Item added to wishlist');
    
    // Transform response
    const response = {
      items: wishlist.items,
      total_items: wishlist.items.length
    };
    
    return successResponse(response, { message: 'Item added to wishlist successfully' });
  } catch (error) {
    console.error('❌ Wishlist API POST: Error:', error);
    return handleDatabaseError(error);
  }
}

// Clear wishlist
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔄 Wishlist API DELETE: Request received');
    await connectDB();
    
    // For now, use mock user ID
    const mockUserId = new mongoose.Types.ObjectId();
    
    await WishlistModel.findOneAndDelete({ user_id: mockUserId });
    console.log('✅ Wishlist API DELETE: Wishlist cleared');
    
    const response = {
      items: [],
      total_items: 0
    };
    
    return successResponse(response, { message: 'Wishlist cleared successfully' });
  } catch (error) {
    console.error('❌ Wishlist API DELETE: Error:', error);
    return handleDatabaseError(error);
  }
}