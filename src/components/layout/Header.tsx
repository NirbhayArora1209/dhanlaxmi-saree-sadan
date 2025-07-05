'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, User, Heart, ChevronDown, Phone, Mail, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'next/navigation';
import { mockCategories } from '@/data/mockData';

export default function Header() {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, wishlist } = useStore();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={toggleMobileMenu}
          />
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-[92vw] max-w-sm bg-gradient-to-b from-amber-50 to-rose-50 shadow-2xl transform transition-transform duration-300 ease-in-out rounded-r-2xl flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-amber-200">
              <h2 className="text-xl font-semibold text-gray-800 font-playfair">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-amber-100 active:bg-amber-100 focus:bg-amber-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            {/* Sidebar Search */}
            <form onSubmit={handleSearch} className="px-6 pt-4 pb-2">
              <div className="flex items-center w-full bg-white border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-amber-200 focus-within:border-amber-600 px-2">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for sarees, fabrics, occasions..."
                  className="flex-1 py-2 px-3 text-sm bg-transparent border-none outline-none placeholder-gray-400"
                />
                <button type="submit" className="p-2 hover:bg-amber-100 active:bg-amber-100 focus:bg-amber-100 rounded-full transition-colors">
                  <Search className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </form>
            {/* Sidebar Navigation */}
            <nav className="flex-1 px-6 py-2 space-y-8 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 font-poppins">Categories</h3>
                {mockCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-amber-100 active:bg-amber-100 focus:bg-amber-100 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-amber-200 to-rose-200 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 font-playfair text-base">{category.name}</h4>
                      <p className="text-xs text-gray-500">{category.product_count} products</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="space-y-4 mt-6">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 font-poppins">Quick Links</h3>
                <Link href="/products" className="block p-3 rounded-lg hover:bg-amber-100 active:bg-amber-100 focus:bg-amber-100 transition-colors text-gray-700 text-base font-medium" onClick={toggleMobileMenu}>All Products</Link>
                <Link href="/sale" className="block p-3 rounded-lg hover:bg-amber-100 active:bg-amber-100 focus:bg-amber-100 transition-colors text-gray-700 text-base font-medium" onClick={toggleMobileMenu}>Sale Items</Link>
                <Link href="/about" className="block p-3 rounded-lg hover:bg-amber-100 active:bg-amber-100 focus:bg-amber-100 transition-colors text-gray-700 text-base font-medium" onClick={toggleMobileMenu}>About Us</Link>
                <Link href="/contact" className="block p-3 rounded-lg hover:bg-amber-100 active:bg-amber-100 focus:bg-amber-100 transition-colors text-gray-700 text-base font-medium" onClick={toggleMobileMenu}>Contact</Link>
              </div>
            </nav>
            {/* Sidebar Footer */}
            <div className="p-6 border-t border-amber-200 mt-auto">
              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-600">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <Mail className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-600">info@dhanlaxmisareesadan.com</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Info Bar */}
      <div className="w-full bg-gradient-to-r from-amber-600 to-rose-600 text-white text-xs px-2 sm:px-4 py-1 border-b border-amber-300">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between h-8">
          <div className="flex items-center gap-2 justify-center h-8">
            <Phone className="w-4 h-4" />
            <span>+91 98765 43210</span>
            <span className="mx-2 hidden sm:inline-block">|</span>
            <Mail className="w-4 h-4" />
            <span>info@dhanlaxmisareesadan.com</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end h-8 w-full sm:w-auto mt-1 sm:mt-0">
            <span className="block sm:inline">Free shipping on orders above ₹2000</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-[#fffaf5] shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4 py-0 gap-2 md:gap-4 h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 h-full">
            <Link 
              href="/" 
              className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white h-12"
              tabIndex={0}
              style={{ outline: 'none' }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-rose-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent font-playfair">
                Dhanlaxmi Saree Sadan
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 flex-1 justify-center min-w-0 h-full">
            {/* Categories with Mega Menu */}
            <div className="relative group flex items-center h-full px-2">
              <button
                className="font-medium text-gray-700 hover:text-amber-600 transition-colors flex items-center space-x-1 h-full border-b-2 border-transparent group-hover:border-amber-600"
                onMouseEnter={() => setActiveMegaMenu('categories')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {/* Mega Menu */}
              {activeMegaMenu === 'categories' && (
                <div
                  className="absolute left-1/2 top-full z-40 -translate-x-1/2 mt-4 max-w-4xl w-[90vw] bg-gradient-to-br from-amber-50 via-white to-rose-50 shadow-2xl border-t-2 border-amber-200 rounded-xl animate-fade-in"
                  onMouseEnter={() => setActiveMegaMenu('categories')}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <div className="px-10 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Featured Categories */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-amber-300 pb-2 font-playfair">Featured Collections</h3>
                        <div className="space-y-4">
                          {mockCategories.slice(0, 3).map((category) => (
                            <Link
                              key={category._id}
                              href={`/category/${category.slug}`}
                              className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-amber-100 transition-all duration-300"
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-amber-200 to-rose-200 flex-shrink-0">
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 group-hover:text-amber-800 transition-colors font-playfair">{category.name}</h4>
                                <p className="text-sm text-gray-600">{category.product_count} products</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* All Categories */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-amber-300 pb-2 font-playfair">All Categories</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {mockCategories.map((category) => (
                            <Link
                              key={category._id}
                              href={`/category/${category.slug}`}
                              className="group p-3 rounded-lg hover:bg-amber-50 transition-all duration-300 border border-transparent hover:border-amber-200"
                            >
                              <h4 className="font-medium text-gray-700 group-hover:text-amber-800 transition-colors text-sm font-playfair">{category.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{category.product_count} items</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* Special Offers */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-amber-300 pb-2 font-playfair">Special Offers</h3>
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-4 rounded-lg border border-amber-200">
                            <h4 className="font-semibold text-amber-800 mb-2 font-playfair">Wedding Collection</h4>
                            <p className="text-sm text-amber-700 mb-3">Up to 40% off on bridal sarees</p>
                            <Link href="/category/wedding-sarees" className="inline-block bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-700 transition-colors">Shop Now</Link>
                          </div>
                          <div className="bg-gradient-to-r from-rose-100 to-purple-100 p-4 rounded-lg border border-rose-200">
                            <h4 className="font-semibold text-rose-800 mb-2 font-playfair">New Arrivals</h4>
                            <p className="text-sm text-rose-700 mb-3">Latest designer collection</p>
                            <Link href="/category/designer-sarees" className="inline-block bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-rose-700 transition-colors">Explore</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link href="/products" className="font-medium text-gray-700 hover:text-amber-600 transition-colors flex items-center h-full">Products</Link>
            <Link href="/sale" className="font-medium text-gray-700 hover:text-amber-600 transition-colors flex items-center h-full">Sale</Link>
            <Link href="/about" className="font-medium text-gray-700 hover:text-amber-600 transition-colors flex items-center h-full">About</Link>
            <Link href="/contact" className="font-medium text-gray-700 hover:text-amber-600 transition-colors flex items-center h-full">Contact</Link>
          </nav>
          {/* Search Bar (desktop/tablet only) */}
          <form onSubmit={handleSearch} className="hidden xl:flex items-center flex-1 max-w-md mx-4 min-w-0 h-full">
            <div className="flex items-center w-full bg-white border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-amber-200 focus-within:border-amber-600 px-2 h-12">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for sarees, fabrics, occasions..."
                className="flex-1 py-2 px-3 text-sm bg-transparent border-none outline-none placeholder-gray-400"
              />
              <button type="submit" className="p-2 hover:bg-amber-100 rounded-full transition-colors">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </form>
          {/* Right Side Icons */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 h-full">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="xl:hidden p-2 rounded-lg hover:bg-amber-100 transition-colors h-12 w-12 flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            {/* User Account */}
            <Link href="/account" className="hidden md:flex items-center p-2 rounded-lg hover:bg-amber-100 transition-colors h-12 w-12 justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </Link>
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-amber-100 transition-colors h-12 w-12 flex items-center justify-center">
              <Heart className="w-5 h-5 text-gray-600" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-amber-100 transition-colors h-12 w-12 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
} 