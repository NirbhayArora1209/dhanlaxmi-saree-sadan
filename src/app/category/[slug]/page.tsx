'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params.slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen">
      <Header activePage="categories" />

      {/* Category Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            {' / '}
            <span>{categoryName}</span>
          </nav>
          <h1 className="text-3xl font-serif font-bold mb-2">{categoryName}</h1>
          <p className="text-muted-foreground">
            Discover our collection of {categoryName.toLowerCase()}
          </p>
        </div>

        {/* Coming Soon */}
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚧</span>
          </div>
          <h2 className="text-2xl font-serif font-bold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground mb-8">
            We're working on bringing you the best {categoryName.toLowerCase()}. 
            Check back soon!
          </p>
          <Link href="/products" className="btn btn-primary px-8 py-3 text-lg">
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  );
} 