'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const store = useStore();
  const cart = store.cart;

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      store.removeFromCart(productId);
    } else {
      store.updateCartItem(productId, quantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <Header activePage="cart" />

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-amber-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4 text-gray-800">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added any sarees to your cart yet.
            </p>
            <Link href="/products">
              <Button variant="primary" size="large" className="px-8 py-4 text-lg">
                Start Shopping
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Header activePage="cart" />

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-serif font-bold mb-2 text-gray-800">Shopping Cart</h1>
          <p className="text-gray-600">
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card variant="premium" className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-amber-200 rounded-lg bg-white shadow-sm">
                              <button
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                className="px-3 py-2 hover:bg-amber-50 transition-colors"
                                disabled={store.loading.cart}
                              >
                                <Minus size={16} className="text-amber-600" />
                              </button>
                              <span className="px-4 py-2 border-x border-amber-200 min-w-[60px] text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                className="px-3 py-2 hover:bg-amber-50 transition-colors"
                                disabled={store.loading.cart}
                              >
                                <Plus size={16} className="text-amber-600" />
                              </button>
                            </div>
                            <button
                              onClick={() => store.removeFromCart(item.product_id)}
                              className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm transition-colors"
                              disabled={store.loading.cart}
                            >
                              <Trash2 size={16} />
                              <span>Remove</span>
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-800">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatPrice(item.price)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="sticky top-4"
            >
              <Card variant="premium" className="p-6">
                <h2 className="text-xl font-serif font-bold mb-4 text-gray-800">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(store.getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-amber-200 pt-3 flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span>
                    <span>{formatPrice(store.getCartTotal())}</span>
                  </div>
                </div>
                <Button variant="primary" fullWidth size="large" className="mb-3">
                  Proceed to Checkout
                  <ArrowRight size={20} className="ml-2" />
                </Button>
                <Link href="/products">
                  <Button variant="outline" fullWidth size="large">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 