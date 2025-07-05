'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { products } from '@/data/mockData';
import { Product } from '@/types';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  Package, 
  Truck, 
  CreditCard,
  Minus,
  Plus,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, addToWishlist } = useStore();

  const updateQuantity = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
  };

  const moveToWishlist = (productId: string) => {
    console.log('Moving to wishlist:', productId);
    removeFromCart(productId);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => 
    sum + (item.product.pricing.selling_price * item.quantity), 0
  );
  
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="container-custom">
            <div className="flex items-center mb-4">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <ShoppingCart className="w-12 h-12 mr-4" />
                <h1 className="font-playfair font-bold text-4xl md:text-5xl">
                  Shopping Cart
                </h1>
              </div>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Review your items and proceed to checkout
              </p>
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="container-custom">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any items to your cart yet. Start shopping to see items here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products" className="btn-primary">
                    <Package className="w-4 h-4 mr-2" />
                    Start Shopping
                  </Link>
                  <Link href="/" className="btn-secondary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Cart Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Cart Items ({cart.length})
                        </h2>
                        <button
                          onClick={clearCart}
                          className="text-red-600 hover:text-red-800 transition-colors text-sm"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="divide-y divide-gray-100">
                      {cart.map((item) => (
                        <div key={item.product._id} className="p-6">
                          <div className="flex space-x-4">
                            {/* Product Image */}
                            <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-2">
                                    {item.product.name}
                                  </h3>
                                  <div className="text-sm text-gray-600 space-y-1">
                                                        <p>Fabric: {item.product.specifications.fabric}</p>
                    <p>Occasion: {item.product.specifications.occasion}</p>
                                    <p>Size: {item.size}</p>
                                  </div>
                                </div>
                                
                                {/* Price */}
                                <div className="text-right ml-4">
                                  <div className="font-bold text-gray-900">
                                    ₹{(item.product.pricing.selling_price * item.quantity).toLocaleString()}
                                  </div>
                                  {item.product.pricing.base_price > item.product.pricing.selling_price && (
                                    <div className="text-sm text-gray-500 line-through">
                                      ₹{(item.product.pricing.base_price * item.quantity).toLocaleString()}
                                    </div>
                                  )}
                                  <div className="text-sm text-green-600 mt-1">
                                    Save ₹{((item.product.pricing.base_price - item.product.pricing.selling_price) * item.quantity).toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                      disabled={item.quantity >= item.product.inventory.available_stock}
                                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {item.product.inventory.available_stock} available
                                  </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => moveToWishlist(item.product._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Move to wishlist"
                                  >
                                    <Heart className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(item.product._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Remove from cart"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
                    
                    {/* Price Breakdown */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                      </div>
                      {shipping > 0 && (
                        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                          Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between font-bold text-lg text-gray-900">
                          <span>Total</span>
                          <span>₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Trust Features */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Truck className="w-5 h-5 text-green-600" />
                          <span className="text-sm">Free shipping on ₹2000+</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-green-600" />
                          <span className="text-sm">Secure payment</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Package className="w-5 h-5 text-green-600" />
                          <span className="text-sm">Easy returns</span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button className="w-full bg-primary-800 text-white py-4 px-6 rounded-lg hover:bg-primary-900 transition-colors font-semibold mb-4">
                      Proceed to Checkout
                    </button>
                    
                    <Link href="/products" className="w-full bg-gray-100 text-gray-800 py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold block text-center">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 