"use client";

import React from 'react';
import { useProducts } from '@/hooks/useApiData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import { Sparkles, Tag, TrendingDown } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Product } from '@/types';

const SalePage = () => {
  const { data: productsData, loading, error } = useProducts();
  const products = Array.isArray(productsData) ? productsData : (productsData?.products || []);
  const saleProducts = products.filter((p: Product) => p.pricing.discount_percentage > 0);

  const categories = [
    { _id: '1', name: 'Silk Sarees', slug: 'silk-sarees', product_count: 3 },
    { _id: '2', name: 'Cotton Sarees', slug: 'cotton-sarees', product_count: 1 },
    { _id: '3', name: 'Designer Sarees', slug: 'designer-sarees', product_count: 1 },
    { _id: '4', name: 'Party Wear', slug: 'party-wear', product_count: 2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light">
        <Header activePage="sale" />
        <main className="pt-20">
          <div className="container-custom py-16">
            <LoadingSpinner size="large" text="Loading sale products..." />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light">
        <Header activePage="sale" />
        <main className="pt-20">
          <div className="container-custom py-16 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Sale Products</h1>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-amber-600 to-rose-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-amber-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background-light">
        <Header activePage="sale" />
        <main className="pt-20">
          <div className="container-custom py-8">
            {/* Sale Banner */}
            <div className="mb-8 text-center">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-full inline-block mb-4">
                <div className="flex items-center gap-2">
                  <Tag size={20} />
                  <span className="font-semibold">MEGA SALE</span>
                </div>
              </div>
              <h1 className="font-playfair font-bold text-4xl text-gray-900 mb-2">
                Special Sale Collection
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mb-6 mx-auto"></div>
              <p className="text-lg text-gray-600 mb-4">
                Discover our best deals on premium sarees. Limited time offers with up to 30% off!
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <TrendingDown size={16} />
                  <span>Up to 30% OFF</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles size={16} />
                  <span>Limited Time</span>
                </div>
              </div>
            </div>
            {saleProducts.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                  <ProductFilters 
                    categories={categories}
                    filters={{
                      category: '',
                      priceRange: [0, 50000],
                      sortBy: 'discount',
                      inStock: false,
                      isNew: false,
                      isFeatured: false
                    }}
                    onFilterChange={() => {}}
                  />
                </div>
                <div className="lg:w-3/4">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Sale Products ({saleProducts.length})
                      </h2>
                      <div className="text-sm text-gray-500 bg-yellow-100 px-3 py-1 rounded-full">
                        🔥 Hot Deals
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Handpicked sarees with exclusive discounts - Save big on premium collections!
                    </p>
                  </div>
                  <ProductGrid products={saleProducts} />
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-xl font-semibold text-gray-600 mb-4">No sale products found</h2>
                <p className="text-gray-500 mb-6">Check back later for more great deals!</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default SalePage; 