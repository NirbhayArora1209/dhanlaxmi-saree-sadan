import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import CartModel, { ICart } from '@/models/Cart';
import ProductModel from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';
import { successResponse, errorResponse, handleDatabaseError } from '@/lib/api';

// Get user cart
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Cart API GET: Request received');
    await connectDB();
    
    // For now, return empty cart if no user authentication
    // TODO: Implement proper authentication
    const mockUserId = new mongoose.Types.ObjectId();
    
    let cart = await CartModel.findOne({ user_id: mockUserId }).lean();
    
    if (!cart) {
      console.log('ℹ️ Cart API GET: No cart found, creating empty cart response');
      return successResponse({
        items: [],
        total_items: 0,
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        currency: 'INR'
      });
    }
    
    console.log('✅ Cart API GET: Cart found with', cart.items.length, 'items');
    
    // Transform cart data to match frontend expectations
    const response = {
      items: cart.items,
      total_items: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cart.total_amount,
      discount: 0,
      shipping: cart.total_amount >= 2000 ? 0 : 100, // Free shipping over ₹2000
      total: cart.total_amount + (cart.total_amount >= 2000 ? 0 : 100),
      currency: 'INR'
    };
    
    return successResponse(response);
  } catch (error) {
    console.error('❌ Cart API GET: Error:', error);
    return handleDatabaseError(error);
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Cart API POST: Request received');
    await connectDB();
    
    const body = await request.json();
    const { productId, quantity = 1 } = body;
    
    if (!productId) {
      return errorResponse('Product ID is required', 400);
    }
    
    // Validate product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return errorResponse('Product not found', 404);
    }
    
    // Check stock availability
    if (product.inventory.available_stock < quantity) {
      return errorResponse('Insufficient stock', 400);
    }
    
    // For now, use mock user ID
    // TODO: Get actual user from authentication
    const mockUserId = new mongoose.Types.ObjectId();
    
    let cart = await CartModel.findOne({ user_id: mockUserId });
    
    if (!cart) {
      // Create new cart
      cart = new CartModel({
        user_id: mockUserId,
        items: []
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product_id.toString() === productId
    );
    
    if (existingItemIndex >= 0 && cart.items[existingItemIndex]) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product_id: new mongoose.Types.ObjectId(productId),
        name: product.name,
        price: product.pricing.selling_price,
        quantity: quantity,
        image: product.images[0]?.url || '/images/products/placeholder.jpg'
      } as any);
    }
    
    await cart.save();
    console.log('✅ Cart API POST: Item added to cart');
    
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
    
    return successResponse(response, { message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('❌ Cart API POST: Error:', error);
    return handleDatabaseError(error);
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 Cart API PUT: Request received');
    await connectDB();
    
    const body = await request.json();
    const { productId, quantity } = body;
    
    if (!productId || quantity === undefined) {
      return errorResponse('Product ID and quantity are required', 400);
    }
    
    if (quantity < 0) {
      return errorResponse('Quantity cannot be negative', 400);
    }
    
    // For now, use mock user ID
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
    
    if (quantity === 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else if (cart.items[itemIndex]) {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    console.log('✅ Cart API PUT: Cart updated');
    
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
    
    return successResponse(response, { message: 'Cart updated successfully' });
  } catch (error) {
    console.error('❌ Cart API PUT: Error:', error);
    return handleDatabaseError(error);
  }
}

// Clear cart
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔄 Cart API DELETE: Request received');
    await connectDB();
    
    // For now, use mock user ID
    const mockUserId = new mongoose.Types.ObjectId();
    
    await CartModel.findOneAndDelete({ user_id: mockUserId });
    console.log('✅ Cart API DELETE: Cart cleared');
    
    const response = {
      items: [],
      total_items: 0,
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0,
      currency: 'INR'
    };
    
    return successResponse(response, { message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('❌ Cart API DELETE: Error:', error);
    return handleDatabaseError(error);
  }
}