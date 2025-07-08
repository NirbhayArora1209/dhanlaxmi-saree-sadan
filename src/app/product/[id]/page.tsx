'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import Header from '@/components/layout/Header';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const store = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await store.getProduct(params.id);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, store.getProduct]);

  const handleAddToCart = () => {
    if (product) {
      store.addToCart(product, quantity);
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      store.addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link href="/products" className="btn btn-primary">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <ProductImageGallery 
              images={product.images} 
              productName={product.name} 
            />
          </div>

          {/* Product Details */}
          <div>
            <nav className="text-sm text-muted-foreground mb-4">
              <Link href="/products" className="hover:text-primary">
                Products
              </Link>
              {' / '}
              <Link href={`/category/${product.category}`} className="hover:text-primary">
                {product.category}
              </Link>
              {' / '}
              <span>{product.name}</span>
            </nav>

            <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground">
                ({product.ratings.total_reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl font-bold">
                  ₹{product.pricing.selling_price.toLocaleString()}
                </span>
                {product.pricing.discount_percentage > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{product.pricing.base_price.toLocaleString()}
                    </span>
                    <span className="badge badge-secondary">
                      {product.pricing.discount_percentage}% OFF
                    </span>
                  </>
                )}
              </div>
              {product.pricing.discount_percentage > 0 && (
                <p className="text-sm text-green-600">
                  You save ₹{(product.pricing.base_price - product.pricing.selling_price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Specifications */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Fabric:</span>
                  <span className="ml-2">{product.specifications.fabric}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Occasion:</span>
                  <span className="ml-2">{product.specifications.occasion}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Length:</span>
                  <span className="ml-2">{product.specifications.length} yards</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Blouse:</span>
                  <span className="ml-2">
                    {product.specifications.blouse_included ? 'Included' : 'Not included'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <span className={`text-sm ${
                product.inventory.available_stock > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {product.inventory.available_stock > 0 
                  ? `${product.inventory.available_stock} in stock` 
                  : 'Out of stock'
                }
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory.available_stock, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                {store.isInCart(product._id) ? (
                  <button
                    onClick={() => store.removeFromCart(product._id)}
                    disabled={product.inventory.available_stock === 0}
                    className="btn btn-secondary flex-1 py-3 text-lg"
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.inventory.available_stock === 0}
                    className="btn btn-primary flex-1 py-3 text-lg"
                  >
                    Add to Cart
                  </button>
                )}
                
                {store.isInWishlist(product._id) ? (
                  <button
                    onClick={() => store.removeFromWishlist(product._id)}
                    className="btn btn-outline px-6 py-3 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    ♥
                  </button>
                ) : (
                  <button
                    onClick={handleAddToWishlist}
                    className="btn btn-outline px-6 py-3"
                  >
                    ♥
                  </button>
                )}
              </div>
            </div>

            {/* Care Instructions */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Care Instructions</h3>
              <p className="text-sm text-muted-foreground">
                {product.specifications.care_instructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 