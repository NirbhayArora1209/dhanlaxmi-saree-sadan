import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import connectDB from '@/lib/db';
import ProductModel from '@/models/Product';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function getCategoryProducts(slug: string) {
  try {
    await connectDB();
    const products = await ProductModel.find({ 
      category: slug,
      is_active: true 
    }).lean();
    
    return products.map(product => ({
      ...product,
      _id: product._id.toString()
    }));
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const products = await getCategoryProducts(slug);
  
  const categoryName = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen">
      <Header activePage="categories" />

      {/* Category Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/products" className="hover:text-indigo-600">
              Products
            </Link>
            {' / '}
            <span>{categoryName}</span>
          </nav>
          <h1 className="text-3xl font-serif font-bold mb-2">{categoryName}</h1>
          <p className="text-gray-600">
            Discover our collection of {categoryName.toLowerCase()}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {products.length} Product{products.length !== 1 ? 's' : ''} Found
              </h2>
            </div>
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">No Products Found</h2>
            <p className="text-gray-600 mb-8">
              We're currently updating our {categoryName.toLowerCase()} collection. 
              Check back soon!
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}