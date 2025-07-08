'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  onProductClick?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products = [], 
  loading = false,
  emptyMessage = "No products found",
  onProductClick
}) => {
  const store = useStore();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    store.addToCart(product, 1);
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    store.addToWishlist(product);
  };

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
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
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -5 }}
          className="group"
        >
          <Card variant="premium" className="h-full cursor-pointer" onClick={() => handleProductClick(product)}>
            <div className="relative">
              {/* Product Image */}
              <div className="aspect-square overflow-hidden rounded-t-2xl relative">
                <img
                  src={product.images[0]?.url || '/images/products/placeholder.jpg'}
                  alt={product.images[0]?.alt_text || product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleAddToWishlist(e, product)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    title="Add to Wishlist"
                  >
                    <Heart 
                      size={18} 
                      className={`text-gray-600 ${store.isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    title="Add to Cart"
                  >
                    <ShoppingBag size={18} className="text-gray-600" />
                  </motion.button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.pricing.discount_percentage > 0 && (
                    <Badge variant="secondary" className="font-medium">
                      {product.pricing.discount_percentage}% OFF
                    </Badge>
                  )}
                  {product.is_featured && (
                    <Badge variant="primary" className="font-medium">
                      Featured
                    </Badge>
                  )}
                  {product.inventory.available_stock <= 5 && product.inventory.available_stock > 0 && (
                    <Badge variant="accent" className="font-medium">
                      Only {product.inventory.available_stock} left
                    </Badge>
                  )}
                  {product.inventory.available_stock === 0 && (
                    <Badge variant="outline" className="font-medium bg-gray-500 text-white">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <CardContent className="p-6 flex-1 flex flex-col">
                {/* Category */}
                <div className="text-sm text-amber-600 font-medium mb-2 capitalize">
                  {product.category.replace(/-/g, ' ')}
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 flex-1">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(product.ratings.average_rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.ratings.total_reviews})
                  </span>
                </div>

                {/* Specifications */}
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">{product.specifications.fabric}</span>
                  {product.specifications.occasion && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{product.specifications.occasion}</span>
                    </>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.pricing.selling_price)}
                    </span>
                    {product.pricing.discount_percentage > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.pricing.base_price)}
                      </span>
                    )}
                  </div>
                  {product.inventory.available_stock > 0 && (
                    <span className="text-sm text-green-600 font-medium">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link href={`/product/${product._id}`} className="flex-1">
                    <Button variant="outline" fullWidth size="small">
                      View Details
                    </Button>
                  </Link>
                  {product.inventory.available_stock > 0 && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={(e) => handleAddToCart(e, product)}
                      className="px-4"
                    >
                      <ShoppingBag size={16} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;