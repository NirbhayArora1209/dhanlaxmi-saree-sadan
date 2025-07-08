import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import CartModel from '@/models/Cart';
import { successResponse, errorResponse, handleDatabaseError } from '@/lib/api';

// Remove specific item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 Cart Item DELETE: Request received for product:', params.id);
    await connectDB();
    
    const productId = params.id;
    
    if (!productId) {
      return errorResponse('Product ID is required', 400);
    }
    
    // For now, use mock user ID
    // TODO: Get actual user from authentication
    const mockUserId = new mongoose.Types.ObjectId();
    
    const cart = await CartModel.findOne({ user_id: mockUserId });
    if (!cart) {
      return errorResponse('Cart not found', 404);
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product_id.toString() === productId
    );
    
    if (itemIndex === -1) {
      return errorResponse('Item not found in cart', 404);
    }
    
    // Remove item from cart
    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    console.log('✅ Cart Item DELETE: Item removed from cart');
    
    // Transform response
    const response = {
      items: cart.items,
      total_items: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cart.total_amount,
      discount: 0,
      shipping: cart.total_amount >= 2000 ? 0 : 100,
      total: cart.total_amount + (cart.total_amount >= 2000 ? 0 : 100),
      currency: 'INR'
    };
    
    return successResponse(response, { message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('❌ Cart Item DELETE: Error:', error);
    return handleDatabaseError(error);
  }
}