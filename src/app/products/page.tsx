'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingBag, 
  ChevronDown,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Product } from '@/types';
import { getProducts, productsApi } from '@/lib/client-api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Search from '@/components/ui/Search';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

export default function ProductsPage() {
  const store = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);

  // Get search query from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSearchQuery = urlParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let fetchedProducts: Product[] = [];
        
        if (searchQuery.trim()) {
          // Use API search when there's a search query
          console.log('🔍 Searching for:', searchQuery);
          fetchedProducts = await productsApi.searchProducts(searchQuery);
          console.log('🔍 Search results:', fetchedProducts);
        } else {
          // Fetch all products when no search query
          const response = await getProducts();
          fetchedProducts = response.data || [];
        }
        
        // Ensure fetchedProducts is always an array
        if (!Array.isArray(fetchedProducts)) {
          console.warn('⚠️ Products data is not an array:', fetchedProducts);
          fetchedProducts = [];
        }
        
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]); // Re-fetch when search query changes

  // Filter and sort products (search is handled by API)
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.pricing.selling_price >= priceRange.min &&
      product.pricing.selling_price <= priceRange.max
    );

    // Occasion filter
    if (selectedOccasions.length > 0) {
      filtered = filtered.filter(product =>
        selectedOccasions.includes(product.specifications.occasion)
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.pricing.selling_price - b.pricing.selling_price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricing.selling_price - a.pricing.selling_price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.ratings.average_rating - a.ratings.average_rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategories, priceRange, selectedOccasions, sortBy]); // Removed searchQuery since it's handled by API

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (product: Product) => {
    store.addToCart(product, 1);
  };

  const handleAddToWishlist = (product: Product) => {
    store.addToWishlist(product);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions(prev =>
      prev.includes(occasion)
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setPriceRange({ min: 0, max: 50000 });
    setSortBy('featured');
  };

  const categories = Array.from(new Set(products.map(p => p.category)));
  const occasions = Array.from(new Set(products.map(p => p.specifications.occasion)));

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header activePage="products" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header activePage="products" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header activePage="products" />

      {/* Page Header */}
      <section className="section-compact bg-premium">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-headline mb-4">Our Products</h1>
            <p className="text-body-large text-muted-foreground max-w-2xl">
              Discover our collection of premium sarees, each piece crafted with love and tradition
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="section-compact border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <Search
                onSearch={handleSearch}
                suggestions={[
                  'Banarasi Silk Sarees',
                  'Kanjeevaram Silk',
                  'Designer Sarees',
                  'Wedding Collection',
                  'Party Wear Sarees'
                ]}
                placeholder="Search for sarees..."
              />
            </div>

            {/* View Toggle and Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter size={16} />}
              >
                Filters
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || selectedOccasions.length > 0 || searchQuery) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {selectedCategories.map(category => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category} <X size={12} className="ml-1" />
                </Badge>
              ))}
              {selectedOccasions.map(occasion => (
                <Badge
                  key={occasion}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => toggleOccasion(occasion)}
                >
                  {occasion} <X size={12} className="ml-1" />
                </Badge>
              ))}
              {searchQuery && (
                <Badge
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery('')}
                >
                  Search: {searchQuery} <X size={12} className="ml-1" />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="small"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 320 }}
              exit={{ opacity: 0, width: 0 }}
              className="bg-white border-r border-gray-200 overflow-hidden"
            >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-medium mb-4">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasions */}
              <div className="mb-8">
                <h4 className="font-medium mb-4">Occasions</h4>
                <div className="space-y-2">
                  {occasions.map(occasion => (
                    <label key={occasion} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occasion)}
                        onChange={() => toggleOccasion(occasion)}
                        className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm">{occasion}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-medium mb-4">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowFilters(false)}
                className="lg:hidden"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Products Grid */}
        <div className="flex-1">
          <section className="section-compact">
            <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="premium" className="group cursor-pointer">
                    <div className="aspect-square overflow-hidden rounded-t-2xl relative">
                      <img
                        src={product.images[0]?.url || '/images/products/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Quick Actions */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToWishlist(product);
                          }}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Heart size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ShoppingBag size={18} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Discount Badge */}
                      {product.pricing.discount_percentage > 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute top-4 left-4"
                        >
                          {product.pricing.discount_percentage}% OFF
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({product.ratings.total_reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xl font-bold">
                            {formatPrice(product.pricing.selling_price)}
                          </span>
                          {product.pricing.discount_percentage > 0 && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              {formatPrice(product.pricing.base_price)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.inventory.available_stock} in stock
                        </span>
                      </div>

                      <Link href={`/product/${product._id}`}>
                        <Button variant="primary" fullWidth>
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="premium">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-square overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-t-none relative">
                        <img
                          src={product.images[0]?.url || '/images/products/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover object-top"
                        />
                        {product.pricing.discount_percentage > 0 && (
                          <Badge
                            variant="secondary"
                            className="absolute top-4 left-4"
                          >
                            {product.pricing.discount_percentage}% OFF
                          </Badge>
                        )}
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                            <p className="text-muted-foreground line-clamp-2 mb-3">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAddToWishlist(product)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Heart size={20} />
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <ShoppingBag size={20} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({product.ratings.total_reviews} reviews)
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold">
                              {formatPrice(product.pricing.selling_price)}
                            </span>
                            {product.pricing.discount_percentage > 0 && (
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                {formatPrice(product.pricing.base_price)}
                              </span>
                            )}
                          </div>
                          <Link href={`/product/${product._id}`}>
                            <Button variant="primary">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No products found.</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
} 