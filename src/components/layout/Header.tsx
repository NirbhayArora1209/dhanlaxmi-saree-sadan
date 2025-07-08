'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Mail
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import Search from '@/components/ui/Search';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface HeaderProps {
  activePage?: 'home' | 'products' | 'categories' | 'cart' | 'wishlist' | 'about' | 'contact' | 'account' | 'sale';
}

export default function Header({ activePage = 'home' }: HeaderProps) {
  const store = useStore();
  const cartCount = store.getCartCount();
  const wishlistCount = store.wishlist.length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
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
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} />
                <span>info@dhanlaxmisarees.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>Free Shipping on Orders Above ₹2000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
            : 'bg-white'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gradient">
                  Dhanlaxmi Saree Sadan
                </h1>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${item.active ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <Search
                onSearch={handleSearch}
                suggestions={[
                  'Banarasi Silk Sarees',
                  'Kanjeevaram Silk',
                  'Designer Sarees',
                  'Wedding Collection',
                  'Party Wear Sarees'
                ]}
                variant="premium"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle for Mobile */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <SearchIcon size={20} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <Badge
                    variant="secondary"
                    size="small"
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <Badge
                    variant="primary"
                    size="small"
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {/* Account */}
              <Link href="/account" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <User size={20} />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4"
              >
                <Search
                  onSearch={handleSearch}
                  suggestions={[
                    'Banarasi Silk Sarees',
                    'Kanjeevaram Silk',
                    'Designer Sarees',
                    'Wedding Collection',
                    'Party Wear Sarees'
                  ]}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block py-3 px-4 rounded-lg transition-colors ${
                        item.active 
                          ? 'bg-amber-50 text-amber-600 font-medium' 
                          : 'text-foreground hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Link href="/wishlist" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <Heart size={16} />
                        <span>Wishlist ({wishlistCount})</span>
                      </Link>
                      <Link href="/cart" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ShoppingBag size={16} />
                        <span>Cart ({cartCount})</span>
                      </Link>
                    </div>
                    <Button variant="primary" size="small">
                      Login
                    </Button>
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