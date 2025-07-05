'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ProductCard from '@/components/products/ProductCard';
import { Product, Category } from '@/types';
import { getProducts, getCategories } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Star, Truck, Shield, RotateCcw, Award, Clock, Users, CheckCircle } from 'lucide-react';
import { mockBanners } from '@/data/mockData';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData.products || productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Mock cart and wishlist handlers
  const handleAddToCart = async (product: Product) => {
    // TODO: Implement cart functionality with API
    console.log('Adding to cart:', product.name);
  };

  const handleAddToWishlist = (product: Product) => {
    // TODO: Implement wishlist functionality with API
    console.log('Adding to wishlist:', product.name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-16 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary-800 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors"
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
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection banners={mockBanners} />

        {/* Trust Features Section */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-8 h-8 text-primary-800" />
                </div>
                <h3 className="font-poppins font-semibold text-lg mb-1">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders above ₹2000</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-secondary-800" />
                </div>
                <h3 className="font-poppins font-semibold text-lg mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure checkout</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RotateCcw className="w-8 h-8 text-green-800" />
                </div>
                <h3 className="font-poppins font-semibold text-lg mb-1">Easy Returns</h3>
                <p className="text-sm text-gray-600">7-day return policy</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-accent-800" />
                </div>
                <h3 className="font-poppins font-semibold text-lg mb-1">Authentic</h3>
                <p className="text-sm text-gray-600">100% genuine products</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-playfair font-bold text-4xl mb-4">Shop by Category</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our curated collection of sarees for every occasion, from traditional handlooms to modern designer pieces.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug}`}
                  className="group bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-poppins font-semibold text-lg mb-2 group-hover:text-primary-800 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {category.product_count} Products
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-playfair font-bold text-4xl mb-2">Featured Products</h2>
                <p className="text-lg text-gray-600">
                  Handpicked sarees from our premium collection
                </p>
              </div>
              <Link
                href="/products"
                className="hidden md:inline-flex items-center space-x-2 bg-primary-800 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.slice(0, 5).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
            
            <div className="text-center mt-8 md:hidden">
              <Link href="/products" className="inline-flex items-center space-x-2 bg-primary-800 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors">
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-playfair font-bold text-4xl mb-4">Why Choose Elegant Sarees?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We bring you the finest collection of authentic Indian sarees with unmatched quality and service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-primary-800" />
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3">Expert Curation</h3>
                <p className="text-gray-600">
                  Each saree is handpicked by our experts to ensure the highest quality and authentic craftsmanship.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-secondary-800" />
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3">Fast Delivery</h3>
                <p className="text-gray-600">
                  Get your sarees delivered within 3-5 business days with our express shipping service.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-800" />
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3">Quality Assured</h3>
                <p className="text-gray-600">
                  Every product comes with our quality guarantee and 7-day return policy for your peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-playfair font-bold text-4xl mb-4">What Our Customers Say</h2>
              <p className="text-lg text-gray-600">
                Real reviews from satisfied customers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0</span>
                </div>
                <p className="text-gray-700 mb-4">
                  "Absolutely stunning sarees! The quality is exceptional and the delivery was super fast. Will definitely shop again!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-800 font-semibold">P</span>
                  </div>
                  <div>
                    <p className="font-semibold">Priya Sharma</p>
                    <p className="text-sm text-gray-600">Verified Buyer</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0</span>
                </div>
                <p className="text-gray-700 mb-4">
                  "The Banarasi silk saree I ordered is simply gorgeous. Perfect for my sister's wedding. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-secondary-800 font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold">Anjali Patel</p>
                    <p className="text-sm text-gray-600">Verified Buyer</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0</span>
                </div>
                <p className="text-gray-700 mb-4">
                  "Amazing collection and excellent customer service. The cotton sarees are perfect for daily wear."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-800 font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold">Meera Reddy</p>
                    <p className="text-sm text-gray-600">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-primary-800 to-secondary-800 text-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-playfair font-bold text-4xl mb-4">Stay Updated</h2>
              <p className="text-xl mb-8 opacity-90">
                Subscribe to our newsletter for exclusive offers, new arrivals, and styling tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-primary-800 font-poppins font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-sm opacity-75 mt-4">
                Get 10% off on your first order when you subscribe!
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
