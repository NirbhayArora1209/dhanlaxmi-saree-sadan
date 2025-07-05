'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { products } from '@/data/mockData';
import ProductCard from '@/components/products/ProductCard';

export default function SalePage() {
  const saleProducts = products.filter(p => p.pricing.discount_percentage > 0);

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      <main className="pt-20">
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16 mb-8">
          <div className="container-custom text-center">
            <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">Sale</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Discover our best deals! Shop discounted sarees for a limited time only.
            </p>
          </div>
        </section>
        <section className="container-custom pb-16">
          {saleProducts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No products on sale right now.</h2>
              <p className="text-gray-500 mb-8">Check back soon for amazing deals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {saleProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
} 