import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import connectDB from '@/lib/db';
import ProductModel from '@/models/Product';
import CategoryModel from '@/models/Category';
import HeroSlider from '@/components/layout/HeroSlider';
import FeaturedProductsGrid from '@/components/products/FeaturedProductsGrid';
import FeaturesGrid from '@/components/layout/FeaturesGrid';
import CategoriesGrid from '@/components/layout/CategoriesGrid';
import CtaSection from '@/components/layout/CtaSection';

// Add caching to improve performance
export const revalidate = 3600; // Revalidate every hour

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await ProductModel.find({ is_featured: true, is_active: true }).lean();
    return products.map(product => ({
      ...product,
      _id: product._id.toString()
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    await connectDB();
    const categories = await CategoryModel.find({ is_active: true }).lean();
    
    // Calculate actual product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await ProductModel.countDocuments({
          category: category.slug,
          is_active: true
        });
        
        return {
          name: category.name,
          image: category.image,
          href: `/category/${category.slug}`,
          productCount: productCount
        };
      })
    );
    
    return categoriesWithCounts;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage() {
  // Load data in parallel for better performance
  const [featuredProducts, categories] = await Promise.allSettled([
    getFeaturedProducts(),
    getCategories()
  ]);

  const resolvedFeaturedProducts = featuredProducts.status === 'fulfilled' ? featuredProducts.value : [];
  const resolvedCategories = categories.status === 'fulfilled' ? categories.value : [];

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
      <FeaturesGrid features={features} />
      <CategoriesGrid categories={resolvedCategories} />
      <FeaturedProductsGrid featuredProducts={resolvedFeaturedProducts} />
      <CtaSection />
      <Footer />
    </div>
  );
}