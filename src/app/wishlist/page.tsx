'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { products } from '@/data/mockData';
import { Product } from '@/types';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, addToCart } = useStore();

  const handleMoveToCart = (product: Product) => {
    console.log('Moving to cart:', product.name);
    // In real app, this would add to cart and remove from wishlist
    removeFromWishlist(product._id);
  };

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product.name);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Adding to wishlist:', product.name);
  };

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-16">
          <div className="container-custom">
            <div className="flex items-center mb-4">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-12 h-12 mr-4" />
                <h1 className="font-playfair font-bold text-4xl md:text-5xl">
                  My Wishlist
                </h1>
              </div>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Save your favorite sarees and come back to them later
              </p>
            </div>
          </div>
        </section>

        {/* Wishlist Content */}
        <section className="py-12">
          <div className="container-custom">
            {wishlist.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Start exploring our beautiful collection of sarees and add your favorites to your wishlist
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products" className="btn-primary">
                    <Package className="w-4 h-4 mr-2" />
                    Browse Products
                  </Link>
                  <Link href="/" className="btn-secondary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Wishlist Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} in Wishlist
                    </h2>
                    <p className="text-gray-600">
                      Save items you love and purchase them later
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <button
                      onClick={clearWishlist}
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </button>
                    <Link href="/products" className="btn-primary">
                      <Package className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* Wishlist Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlist.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                      {/* Product Image */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                                                        src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        
                        {/* Quick Actions */}
                        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => removeFromWishlist(product._id)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                          <button
                            onClick={() => handleMoveToCart(product)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-green-50 transition-colors"
                            title="Move to cart"
                          >
                            <ShoppingCart className="w-4 h-4 text-green-600" />
                          </button>
                        </div>

                        {/* Sale Badge */}
                        {product.pricing.discount_percentage > 0 && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              {product.pricing.discount_percentage}% OFF
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.ratings.average_rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            ({product.ratings.total_reviews})
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{product.pricing.selling_price.toLocaleString()}
                            </span>
                            {product.pricing.base_price > product.pricing.selling_price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{product.pricing.base_price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {product.specifications.fabric} • {product.specifications.occasion}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.inventory.available_stock > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inventory.available_stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.inventory.available_stock === 0}
                            className="flex-1 bg-primary-800 text-white py-2 px-4 rounded-lg hover:bg-primary-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(product._id)}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="mt-12 text-center">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Ready to purchase your favorites?
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => {
                          wishlist.forEach(product => handleAddToCart(product));
                          clearWishlist();
                        }}
                        className="btn-primary"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add All to Cart
                      </button>
                      <Link href="/products" className="btn-secondary">
                        <Package className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 