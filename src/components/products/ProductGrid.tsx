'use client';

import { useState } from 'react';
import { Grid, List, Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  className?: string;
}

export default function ProductGrid({ 
  products, 
  loading = false, 
  viewMode = 'grid',
  onViewModeChange,
  className = "" 
}: ProductGridProps) {
  const [localViewMode, setLocalViewMode] = useState<'grid' | 'list'>(viewMode);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setLocalViewMode(mode);
    onViewModeChange?.(mode);
  };

  const currentViewMode = onViewModeChange ? viewMode : localViewMode;

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-800 mx-auto mb-4" />
          <p className="text-gray-600 font-poppins">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">No products found</h3>
          <p className="text-gray-600 font-poppins">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-poppins">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </span>
        </div>
        
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`p-2 rounded-md transition-colors ${
              currentViewMode === 'grid'
                ? 'bg-white text-primary-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`p-2 rounded-md transition-colors ${
              currentViewMode === 'list'
                ? 'bg-white text-primary-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Grid/List */}
      <div
        className={
          currentViewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={currentViewMode}
            onAddToCart={() => {
              // TODO: Implement add to cart functionality
              console.log('Add to cart:', product.id);
            }}
            onAddToWishlist={() => {
              // TODO: Implement add to wishlist functionality
              console.log('Add to wishlist:', product.id);
            }}
          />
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {products.length >= 20 && (
        <div className="text-center mt-8">
          <button className="bg-primary-800 text-white font-poppins font-semibold px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
} 