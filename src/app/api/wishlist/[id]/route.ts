import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import WishlistModel from '@/models/Wishlist';
import { successResponse, errorResponse, handleDatabaseError } from '@/lib/api';

// Remove specific item from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 Wishlist Item DELETE: Request received for product:', params.id);
    await connectDB();
    
    const productId = params.id;
    
    if (!productId) {
      return errorResponse('Product ID is required', 400);
    }
    
    // For now, use mock user ID
    // TODO: Get actual user from authentication
    const mockUserId = new mongoose.Types.ObjectId();
    
    const wishlist = await WishlistModel.findOne({ user_id: mockUserId });
    if (!wishlist) {
      return errorResponse('Wishlist not found', 404);
    }
    
    const itemIndex = wishlist.items.findIndex(
      item => item.product_id.toString() === productId
    );
    
    if (itemIndex === -1) {
      return errorResponse('Item not found in wishlist', 404);
    }
    
    // Remove item from wishlist
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();
    
    console.log('✅ Wishlist Item DELETE: Item removed from wishlist');
    
    // Transform response
    const response = {
      items: wishlist.items,
      total_items: wishlist.items.length
    };
    
    return successResponse(response, { message: 'Item removed from wishlist successfully' });
  } catch (error) {
    console.error('❌ Wishlist Item DELETE: Error:', error);
    return handleDatabaseError(error);
  }
}