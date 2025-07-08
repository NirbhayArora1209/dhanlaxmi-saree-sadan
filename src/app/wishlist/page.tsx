'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import Header from '@/components/layout/Header';

export default function WishlistPage() {
  const store = useStore();
  const wishlist = store.wishlist;

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen">
        <Header activePage="wishlist" />

        {/* Empty Wishlist */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">♥</span>
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">
              Start adding sarees to your wishlist to save them for later.
            </p>
            <Link href="/products" className="btn btn-primary px-8 py-3 text-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header activePage="wishlist" />

      {/* Wishlist Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.product_id} className="card group">
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => store.addToCart({ _id: item.product_id, name: item.name, pricing: { selling_price: item.price }, images: [item.image] } as any, 1)}
                      className="btn btn-primary text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => store.removeFromWishlist(item.product_id)}
                      className="btn btn-outline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 