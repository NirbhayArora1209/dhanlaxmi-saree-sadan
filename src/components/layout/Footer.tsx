"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Heart,
  Shield,
  Truck,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/products' },
        { label: 'New Arrivals', href: '/products?category=new-arrivals' },
        { label: 'Best Sellers', href: '/products?category=best-sellers' },
        { label: 'Sale Items', href: '/sale' },
        { label: 'Wedding Collection', href: '/products?category=wedding' },
        { label: 'Party Wear', href: '/products?category=party-wear' },
      ]
    },
    {
      title: 'Categories',
      links: [
        { label: 'Banarasi Silk', href: '/category/banarasi-silk' },
        { label: 'Kanjeevaram Silk', href: '/category/kanjeevaram-silk' },
        { label: 'Designer Sarees', href: '/category/designer-sarees' },
        { label: 'Cotton Sarees', href: '/category/cotton-sarees' },
        { label: 'Georgette Sarees', href: '/category/georgette-sarees' },
        { label: 'Chiffon Sarees', href: '/category/chiffon-sarees' },
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Shipping Info', href: '/shipping' },
        { label: 'Returns & Exchanges', href: '/returns' },
        { label: 'Size Guide', href: '/size-guide' },
        { label: 'Care Instructions', href: '/care-instructions' },
        { label: 'FAQ', href: '/faq' },
      ]
    },
    {
      title: 'About Us',
      links: [
        { label: 'Our Story', href: '/about' },
        { label: 'Craftsmanship', href: '/craftsmanship' },
        { label: 'Sustainability', href: '/sustainability' },
        { label: 'Press & Media', href: '/press' },
        { label: 'Careers', href: '/careers' },
        { label: 'Privacy Policy', href: '/privacy' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders above ₹2000'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure checkout'
    },
    {
      icon: CreditCard,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: Heart,
      title: 'Quality Assured',
      description: 'Premium craftsmanship'
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Features Section */}
      <section className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-4">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <Image
                  src="/images/Logo.png"
                  alt="Dhanlaxmi Saree Sadan"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h2 className="text-xl lg:text-2xl font-serif font-bold text-gradient leading-tight">
                    Dhanlaxmi Saree Sadan
                  </h2>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed text-sm lg:text-base">
                Discover the timeless elegance of traditional Indian sarees. 
                Handcrafted with love and premium materials for every special occasion.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-300">
                  <Phone size={16} className="flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-300">
                  <Mail size={16} className="flex-shrink-0" />
                  <span>info@dhanlaxmisarees.com</span>
                </div>
                <div className="flex items-start justify-center md:justify-start space-x-3 text-gray-300">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <span>123 Fashion Street, Mumbai, Maharashtra 400001</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center md:justify-start space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 rounded-lg flex items-center justify-center transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="text-center md:text-left"
            >
              <h3 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-amber-400 transition-colors duration-300 flex items-center justify-center md:justify-start group text-sm"
                    >
                      <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-serif font-bold mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter for exclusive offers, new arrivals, and styling tips.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Dhanlaxmi Saree Sadan. All rights reserved.
            </div>
            
            <div className="flex items-center justify-center md:justify-end space-x-4 lg:space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-amber-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 