import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  Shield, 
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useStore } from '@/context/StoreContext';
import { Product as ProductType } from '@/types';
import { formatPrice } from '@/lib/utils';
import connectDB from '@/lib/db';
import ProductModel from '@/models/Product';
import HeroSlider from '@/components/layout/HeroSlider';
import FeaturedProductsGrid from '@/components/products/FeaturedProductsGrid';
import FeaturesGrid from '@/components/layout/FeaturesGrid';
import CategoriesGrid from '@/components/layout/CategoriesGrid';
import CtaSection from '@/components/layout/CtaSection';

export default async function HomePage() {
  await connectDB();
  const featuredProducts: ProductType[] = (
    await ProductModel.find({ is_featured: true, is_active: true })
      .sort({ created_at: -1 })
      .limit(8)
      .lean()
  ).map((product: any) => ({
    ...product,
    _id: product._id.toString(),
  }));
  // Categories can be static or fetched if needed
  const categories = [
    {
      name: "Banarasi Silk",
      image: "/images/products/categories/banarasi-silk.jpg",
      href: "/category/banarasi-silk",
      productCount: 45
    },
    {
      name: "Kanjeevaram Silk",
      image: "/images/products/categories/kanjeevaram-silk.jpg",
      href: "/category/kanjeevaram-silk",
      productCount: 32
    },
    {
      name: "Cotton Sarees",
      image: "/images/products/categories/cotton-sarees.jpg",
      href: "/category/cotton-sarees",
      productCount: 20
    },
    {
      name: "Designer Sarees",
      image: "/images/products/categories/designer-sarees.jpg",
      href: "/category/designer-sarees",
      productCount: 28
    },
    {
      name: "Party Wear",
      image: "/images/products/categories/party-wear.jpg",
      href: "/category/party-wear",
      productCount: 15
    },
    {
      name: "Silk Sarees",
      image: "/images/products/categories/silk-sarees.jpg",
      href: "/category/silk-sarees",
      productCount: 40
    },
    {
      name: "Wedding Sarees",
      image: "/images/products/categories/wedding-sarees.jpg",
      href: "/category/wedding-sarees",
      productCount: 56
    }
  ];
  const heroSlides = [
    {
      title: "Timeless Elegance in Every Drape",
      subtitle: "Discover our curated collection of premium sarees, where tradition meets contemporary luxury.",
      image: "/images/products/banners/new-arrivals-desktop.jpg",
      cta: "Shop Collection",
      ctaLink: "/products"
    },
    {
      title: "Wedding Collection 2024",
      subtitle: "Exquisite bridal sarees that make your special day unforgettable.",
      image: "/images/products/banners/wedding-collection-desktop.jpg",
      cta: "View Collection",
      ctaLink: "/products?category=wedding"
    },
    {
      title: "Silk Sale - Up to 50% Off",
      subtitle: "Premium silk sarees at unbeatable prices. Limited time offer.",
      image: "/images/products/banners/silk-sale-desktop.jpg",
      cta: "Shop Sale",
      ctaLink: "/sale"
    }
  ];

  const features = [
    {
      icon: "Star",
      title: "Premium Quality",
      description: "Handpicked sarees from the finest artisans across India"
    },
    {
      icon: "Truck",
      title: "Free Shipping",
      description: "Complimentary shipping on all orders above ₹2000"
    },
    {
      icon: "Shield",
      title: "Authentic Products",
      description: "Guaranteed authenticity with quality assurance"
    },
    {
      icon: "CreditCard",
      title: "Secure Payment",
      description: "100% secure checkout with multiple payment options"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header activePage="home" />
      <HeroSlider heroSlides={heroSlides} />

      {/* Features Section */}
      <FeaturesGrid features={features} />

      {/* Categories Section */}
      <CategoriesGrid categories={categories} />

      {/* Featured Products Section */}
      <FeaturedProductsGrid featuredProducts={featuredProducts} />

      {/* CTA Section */}
      <CtaSection />

      <Footer />
    </div>
  );
} 