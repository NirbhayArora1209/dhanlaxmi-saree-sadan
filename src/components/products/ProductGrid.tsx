'use client';

import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import Button from '@/components/ui/Button';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import ErrorMessage from '@/components/ui/ErrorMessage';
import ProductCard from './ProductCard';
import { useStore } from '@/context/StoreContext';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onProductClick?: (product: Product) => void;
  onRetry?: () => void;
}

const ProductGrid = memo(function ProductGrid({ 
  products = [], 
  loading = false,
  error = null,
  emptyMessage = "No products found",
  onProductClick,
  onRetry
}: ProductGridProps) {
  // Memoize the filtered products to prevent unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [products]);

  if (loading) {
    return <SkeletonLoader variant="product" count={8} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load products"
        message={error}
        onRetry={onRetry}
        showHomeButton={false}
      />
    );
  }

  if (memoizedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products</h3>
        <p className="text-gray-500 mb-6">{emptyMessage}</p>
        <Link href="/products">
          <Button variant="primary">
            Browse All Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {memoizedProducts.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          index={index}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
});

export default ProductGrid;