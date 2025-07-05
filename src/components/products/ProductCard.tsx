'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Eye, Truck, Shield } from 'lucide-react';
import { Product } from '@/types';
import ProductImage from '@/components/ui/ProductImage';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart, addToWishlist, wishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isWishlisted = wishlist.some(item => item._id === product._id);

  const handleAddToCart = async () => {
    setIsLoading(true);
    addToCart(product, 1);
    setIsLoading(false);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <div
        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          {/* Product Image Container */}
          <div className="relative w-48 h-48 overflow-hidden bg-gray-50 flex-shrink-0">
            <Link href={`/product/${product._id}`} className="block h-full">
              <ProductImage
                product={product}
                className="h-full transition-transform duration-500 group-hover:scale-110"
              />
            </Link>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.pricing.discount_percentage > 0 && (
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  -{product.pricing.discount_percentage}%
                </div>
              )}
              {product.specifications.blouse_included && (
                <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  Blouse Included
                </div>
              )}
            </div>

            {/* Action Buttons - Desktop (hover) and Mobile (always visible) */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {/* Desktop: Hidden by default, shown on hover */}
              <div className="hidden lg:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={handleAddToWishlist}
                  className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                    isWishlisted
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                
                <Link
                  href={`/product/${product._id}`}
                  className="p-2 bg-white text-gray-600 rounded-full shadow-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>

              {/* Mobile/Tablet: Always visible */}
              <div className="flex lg:hidden flex-col gap-2">
                <button
                  onClick={handleAddToWishlist}
                  className={`p-2 rounded-full shadow-lg transition-all duration-200 active:scale-95 focus:scale-95 ${
                    isWishlisted
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                
                <Link
                  href={`/product/${product._id}`}
                  className="p-2 bg-white text-gray-600 rounded-full shadow-lg transition-all duration-200 hover:bg-gray-100 active:scale-95 focus:scale-95"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                {/* Category */}
                <p className="text-xs text-primary-600 font-medium uppercase tracking-wider mb-2">
                  {product.category}
                </p>

                {/* Product Name */}
                <Link href={`/product/${product._id}`}>
                  <h3 className="font-poppins font-semibold text-gray-900 hover:text-primary-800 transition-colors text-lg mb-3">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.ratings.average_rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.ratings.total_reviews} reviews)
                  </span>
                </div>

                {/* Specifications */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {product.specifications.fabric}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {product.specifications.occasion}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {product.specifications.length} m
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {product.description}
                </p>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Truck className="w-4 h-4" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Authentic</span>
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="text-right ml-6">
                {/* Price */}
                <div className="mb-4">
                  <span className="font-poppins font-bold text-2xl text-gray-900">
                    {formatPrice(product.pricing.selling_price)}
                  </span>
                  {product.pricing.discount_percentage > 0 && (
                    <div className="mt-1">
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.pricing.base_price)}
                      </span>
                      <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded ml-2">
                        {product.pricing.discount_percentage}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || product.inventory.available_stock === 0}
                  className="w-full py-3 px-6 bg-primary-800 text-white font-poppins font-medium hover:bg-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rounded-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isLoading ? 'Adding...' : product.inventory.available_stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Link href={`/product/${product._id}`} className="block h-full">
          <ProductImage
            product={product}
            className="h-full transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.pricing.discount_percentage > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              -{product.pricing.discount_percentage}%
            </div>
          )}
          {product.specifications.blouse_included && (
            <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              Blouse Included
            </div>
          )}
        </div>

        {/* Action Buttons - Desktop (hover) and Mobile (always visible) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Desktop: Hidden by default, shown on hover */}
          <div className="hidden lg:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToWishlist}
              className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            <Link
              href={`/product/${product._id}`}
              className="p-2 bg-white text-gray-600 rounded-full shadow-lg transition-all duration-200 hover:bg-gray-100"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile/Tablet: Always visible */}
          <div className="flex lg:hidden flex-col gap-2">
            <button
              onClick={handleAddToWishlist}
              className={`p-2 rounded-full shadow-lg transition-all duration-200 active:scale-95 focus:scale-95 ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            <Link
              href={`/product/${product._id}`}
              className="p-2 bg-white text-gray-600 rounded-full shadow-lg transition-all duration-200 hover:bg-gray-100 active:scale-95 focus:scale-95"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Add to Cart */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white transform transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isLoading || product.inventory.available_stock === 0}
            className="w-full py-3 px-4 bg-primary-800 text-white font-poppins font-medium hover:bg-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isLoading ? 'Adding...' : product.inventory.available_stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-primary-600 font-medium uppercase tracking-wider mb-2">
          {product.category}
        </p>

        {/* Product Name */}
        <Link href={`/product/${product._id}`}>
          <h3 className="font-poppins font-semibold text-gray-900 hover:text-primary-800 transition-colors line-clamp-2 mb-3 text-sm leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(product.ratings.average_rating)}
          </div>
          <span className="text-xs text-gray-500">
            ({product.ratings.total_reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="font-poppins font-bold text-lg text-gray-900">
            {formatPrice(product.pricing.selling_price)}
          </span>
          {product.pricing.discount_percentage > 0 && (
            <>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.pricing.base_price)}
              </span>
              <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">
                {product.pricing.discount_percentage}% OFF
              </span>
            </>
          )}
        </div>

        {/* Specifications */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {product.specifications.fabric}
          </span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {product.specifications.occasion}
          </span>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Truck className="w-3 h-3" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Authentic</span>
          </div>
        </div>
      </div>
    </div>
  );
} 