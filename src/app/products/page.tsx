'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSearch from '@/components/products/ProductSearch';
import { fabricOptions, occasionOptions, patternOptions, priceRanges } from '@/data/mockData';
import { Product, ProductFilters as FilterType } from '@/types';
import { getProducts } from '@/lib/api';
import { Grid, List, Filter, Search } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterType>({});
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'newest' | 'popular' | 'rating'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData.products || productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(product =>
        filters.category!.includes(product.category)
      );
    }

    // Price range filter
    if (filters.price_range) {
      filtered = filtered.filter(product =>
        product.pricing.selling_price >= filters.price_range!.min &&
        product.pricing.selling_price <= filters.price_range!.max
      );
    }

    // Fabric filter
    if (filters.fabric && filters.fabric.length > 0) {
      filtered = filtered.filter(product =>
        filters.fabric!.includes(product.specifications.fabric)
      );
    }

    // Occasion filter
    if (filters.occasion && filters.occasion.length > 0) {
      filtered = filtered.filter(product =>
        filters.occasion!.includes(product.specifications.occasion)
      );
    }

    // Pattern filter - removed as it's not in our schema
    // if (filters.pattern && filters.pattern.length > 0) {
    //   filtered = filtered.filter(product =>
    //     filters.pattern!.includes(product.pattern)
    //   );
    // }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(product =>
        product.ratings.average_rating >= filters.rating!
      );
    }

    // Availability filter
    if (filters.availability) {
      if (filters.availability === 'in_stock') {
        filtered = filtered.filter(product => product.inventory.available_stock > 0);
      } else if (filters.availability === 'out_of_stock') {
        filtered = filtered.filter(product => product.inventory.available_stock === 0);
      }
    }

    return filtered;
  }, [products, searchQuery, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.pricing.selling_price - b.pricing.selling_price);
      case 'price_high':
        return sorted.sort((a, b) => b.pricing.selling_price - a.pricing.selling_price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popular':
        return sorted.sort((a, b) => b.ratings.total_reviews - a.ratings.total_reviews);
      case 'rating':
        return sorted.sort((a, b) => b.ratings.average_rating - a.ratings.average_rating);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Mock handlers
  const handleAddToCart = async (product: Product) => {
    console.log('Adding to cart:', product.name);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Adding to wishlist:', product.name);
  };

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
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
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h1>
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
      
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-primary-800 to-secondary-800 text-white py-16">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">
                All Products
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Discover our complete collection of authentic Indian sarees
              </p>
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {products.length} Products Available
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Free Shipping on ₹2000+
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters Section */}
        <section className="bg-white border-b border-gray-200 py-6">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <ProductSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search for sarees, fabrics, occasions..."
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 bg-primary-800 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || Object.keys(filters).length > 0) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="lg:sticky lg:top-8">
                  <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    fabricOptions={fabricOptions}
                    occasionOptions={occasionOptions}
                    patternOptions={patternOptions}
                    priceRanges={priceRanges}
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-primary-800 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Results Summary */}
                    <div className="mb-6 flex items-center justify-between">
                      <p className="text-gray-600">
                        Showing {sortedProducts.length} of {products.length} products
                      </p>
                    </div>

                    {/* Products Grid */}
                    <div className={
                      viewMode === 'grid' 
                        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        : "space-y-6"
                    }>
                      {sortedProducts.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          viewMode={viewMode}
                          onAddToCart={handleAddToCart}
                          onAddToWishlist={handleAddToWishlist}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 