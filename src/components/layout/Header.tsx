'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  Heart, 
  User, 
  Search as SearchIcon,
  ChevronDown,
  Phone,
  Mail,
  LogOut
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useStore } from '@/context/StoreContext';
import Search from '@/components/ui/Search';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface HeaderProps {
  activePage?: 'home' | 'products' | 'categories' | 'cart' | 'wishlist' | 'about' | 'contact' | 'account' | 'sale';
}

export default function Header({ activePage = 'home' }: HeaderProps) {
  const { data: session } = useSession();
  const store = useStore();
  const cartCount = store.getCartCount();
  const wishlistCount = store.wishlist.length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    const searchQuery = query.trim().toLowerCase();
    
    try {
      // First, check if it's a category match
      const categories = store.categories;
      const matchingCategory = categories.find(cat => 
        cat.name.toLowerCase().includes(searchQuery) ||
        cat.slug.toLowerCase().includes(searchQuery)
      );
      
      if (matchingCategory) {
        window.location.href = `/category/${matchingCategory.slug}`;
        return;
      }
      
      // Then check for exact product matches
      const products = store.products;
      const exactProductMatch = products.find(product => 
        product.name.toLowerCase() === searchQuery ||
        product.name.toLowerCase().includes(searchQuery)
      );
      
      if (exactProductMatch) {
        window.location.href = `/product/${exactProductMatch._id}`;
        return;
      }
      
      // Check for fabric/specification matches
      const fabricMatch = products.find(product => 
        product.specifications.fabric.toLowerCase().includes(searchQuery) ||
        product.specifications.occasion?.toLowerCase().includes(searchQuery)
      );
      
      if (fabricMatch) {
        window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
        return;
      }
      
      // Fallback to general products search
      window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to general search on error
      window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
    }
  };

  const navigationItems = [
    { href: '/products', label: 'Products', active: activePage === 'products' },
    { href: '/categories', label: 'Categories', active: activePage === 'categories' },
    { href: '/sale', label: 'Sale', active: activePage === 'sale' },
    { href: '/about', label: 'About', active: activePage === 'about' },
    { href: '/contact', label: 'Contact', active: activePage === 'contact' },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="hidden lg:flex items-center space-x-6 text-amber-800">
              <div className="flex items-center space-x-2">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} />
                <span>support@dhanlaxmi.com</span>
              </div>
            </div>
            <div className="text-amber-700 font-medium text-center lg:text-right flex-1 lg:flex-initial">
              Free Shipping on Orders Above ₹2000
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white shadow-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 lg:py-4 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <Image
                src="/images/Logo.png"
                alt="Dhanlaxmi Saree Sadan"
                width={50}
                height={50}
                className="w-12 h-12 object-contain"
                priority
                unoptimized
              />
              <div className="min-w-0">
                <h1 className="text-xl lg:text-2xl font-serif font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent leading-tight">
                  Dhanlaxmi Saree Sadan
                </h1>
                <p className="text-xs lg:text-sm text-amber-600/80 font-medium leading-tight">
                  Traditional Elegance, Modern Style
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                    item.active ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Search Bar */}
              <div className="hidden md:block w-64 lg:w-80">
                <Search
                  onSearch={handleSearch}
                  suggestions={[
                    ...store.categories.map(cat => cat.name),
                    'Banarasi Silk Sarees',
                    'Kanjeevaram Silk',
                    'Designer Sarees',
                    'Wedding Collection',
                    'Party Wear Sarees',
                    'Cotton Sarees',
                    'Silk Sarees',
                    'Georgette Sarees',
                    'Traditional',
                    'Festive',
                    'Casual',
                    'Party'
                  ].slice(0, 8)}
                  size="small"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 lg:space-x-3">
                {/* Mobile Search */}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="md:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  <SearchIcon size={20} className="text-amber-600" />
                </button>

                {/* Wishlist */}
                <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-amber-50 transition-colors">
                  <Heart size={20} className="text-amber-600" />
                  {wishlistCount > 0 && (
                    <Badge
                      variant="secondary"
                      size="small"
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs bg-red-500 text-white"
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>

                {/* Cart */}
                <Link href="/cart" className="relative p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <Badge
                      variant="primary"
                      size="small"
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs bg-red-500 text-white"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Link>

                {/* Account */}
                <div className="relative">
                  {session ? (
                    <>
                      <button
                        onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <User size={20} className="text-amber-600" />
                        <span className="hidden sm:block text-sm text-amber-700 font-medium">
                          {session.user.name?.split(' ')[0]}
                        </span>
                        <ChevronDown size={16} className="text-amber-600" />
                      </button>
                      
                      {showAccountDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-amber-100 py-2 z-50">
                          <Link
                            href="/account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                            onClick={() => setShowAccountDropdown(false)}
                          >
                            My Account
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                            onClick={() => setShowAccountDropdown(false)}
                          >
                            My Orders
                          </Link>
                          <div className="border-t border-amber-100 my-1"></div>
                          <button
                            onClick={() => {
                              setShowAccountDropdown(false);
                              signOut({ callbackUrl: '/' });
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href="/auth/login" className="p-2 rounded-lg hover:bg-amber-50 transition-colors">
                      <User size={20} className="text-amber-600" />
                    </Link>
                  )}
                </div>

                {/* Mobile Menu */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  {isMobileMenuOpen ? <X size={20} className="text-amber-600" /> : <Menu size={20} className="text-amber-600" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-amber-100 bg-amber-50/50 py-4"
            >
              <div className="container mx-auto px-4">
                <Search
                  onSearch={handleSearch}
                  suggestions={[
                    ...store.categories.map(cat => cat.name),
                    'Banarasi Silk Sarees',
                    'Kanjeevaram Silk',
                    'Designer Sarees',
                    'Wedding Collection',
                    'Party Wear Sarees',
                    'Cotton Sarees',
                    'Silk Sarees',
                    'Georgette Sarees',
                    'Traditional',
                    'Festive',
                    'Casual',
                    'Party'
                  ].slice(0, 8)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-amber-100 bg-gradient-to-b from-amber-50 to-white"
            >
              <div className="container mx-auto px-4 py-6">
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block py-3 px-4 rounded-lg transition-colors ${
                        item.active 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-md' 
                          : 'text-amber-700 hover:bg-amber-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Link href="/wishlist" className="flex items-center space-x-2 text-amber-700 hover:text-amber-800">
                        <Heart size={18} />
                        <span>Wishlist ({wishlistCount})</span>
                      </Link>
                      <Link href="/cart" className="flex items-center space-x-2 text-amber-700 hover:text-amber-800">
                        <ShoppingBag size={18} />
                        <span>Cart ({cartCount})</span>
                      </Link>
                    </div>
                    {session ? (
                      <div className="flex items-center space-x-3">
                        <Link href="/account" className="text-sm text-orange-600 font-medium hover:text-orange-700">
                          {session.user.name?.split(' ')[0]}
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="text-sm text-red-600 font-medium hover:text-red-700"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <Link href="/auth/login" className="text-sm text-orange-600 font-medium hover:text-orange-700">
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
} 