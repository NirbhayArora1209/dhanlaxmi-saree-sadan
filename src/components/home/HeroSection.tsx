'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Truck, Shield, Sparkles } from 'lucide-react';
import { Banner } from '@/types';
import { products } from '@/data/mockData';

interface HeroSectionProps {
  banners: Banner[];
}

const categories = [
  {
    name: 'Silk Sarees',
    slug: 'silk-sarees',
    description: 'Luxurious silk sarees for special occasions',
            image: '/images/products/categories/silk-sarees.jpg',
  },
  {
    name: 'Cotton Sarees',
    slug: 'cotton-sarees',
    description: 'Comfortable cotton sarees for daily wear',
            image: '/images/products/categories/cotton-sarees.jpg',
  },
  {
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    description: 'Exclusive designer sarees with modern aesthetics',
            image: '/images/products/categories/designer-sarees.jpg',
  },
  {
    name: 'Wedding Sarees',
    slug: 'wedding-sarees',
    description: 'Bridal sarees for the most special day',
            image: '/images/products/categories/wedding-sarees.jpg',
  },
  {
    name: 'Party Wear',
    slug: 'party-wear',
    description: 'Glamorous sarees for parties and celebrations',
            image: '/images/products/categories/party-wear.jpg',
  },
];

export default function HeroSection({ banners }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!banners.length) {
    return null;
  }

  return (
    <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50">
      {/* Cultural Pattern Background */}
      <div className="absolute inset-0 opacity-5 bg-cultural-pattern"></div>
      
      {/* Banner Carousel */}
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image */}
            <div className="relative h-full">
              <img
                src={banner.image}
                alt={banner.title}
                loading="eager"
                decoding="async"
                className="object-cover w-full h-full absolute inset-0"
                style={{ 
                  zIndex: 0, 
                  objectPosition: 'center', 
                  imageRendering: 'auto',
                }}
                onError={(e) => {
                  // Fallback to gradient background if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.style.background = 'linear-gradient(135deg, #f27522 0%, #e11d48 100%)';
                }}
              />
              
              {/* Enhanced Cultural Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-800/60 to-rose-900/40" />
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-8 left-8 w-16 h-16 border-2 border-amber-300/30 rounded-full"></div>
                <div className="absolute top-16 left-16 w-8 h-8 border border-amber-200/40 rounded-full"></div>
                <div className="absolute bottom-16 right-16 w-12 h-12 border-2 border-rose-300/30 rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-6 h-6 border border-rose-200/40 rounded-full"></div>
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <div className="animate-fade-in">
                      {/* Badge */}
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        <span>Premium Collection</span>
                      </div>
                      
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        {banner.title}
                      </h1>
                      {banner.subtitle && (
                        <p className="text-lg sm:text-xl text-amber-100 mb-8 leading-relaxed drop-shadow-md font-poppins">
                          {banner.subtitle}
                        </p>
                      )}
                      
                      {/* Enhanced CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Link
                          href={banner.link}
                          className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-600 to-rose-600 text-white font-poppins font-semibold rounded-lg hover:from-amber-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <span>{banner.button_text || 'Shop Now'}</span>
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href="/products"
                          className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-poppins font-semibold rounded-lg hover:bg-white hover:text-amber-800 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                        >
                          View Collection
                        </Link>
                      </div>
                      
                      {/* Enhanced Trust Indicators */}
                      <div className="flex flex-wrap items-center gap-6 text-amber-100">
                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                          <Star className="w-4 h-4 text-amber-300 fill-current" />
                          <span className="text-sm font-medium">4.8/5 Rating</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                          <Truck className="w-4 h-4" />
                          <span className="text-sm font-medium">Free Shipping</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">100% Authentic</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm hover:scale-110 border border-amber-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-amber-800" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm hover:scale-110 border border-amber-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-amber-800" />
      </button>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-amber-400 scale-125 shadow-lg'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Enhanced Mobile-specific content adjustments */}
      <div className="md:hidden absolute left-0 right-0" style={{ top: 'calc(100% - 32px)' }}>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200 mx-4 mt-8 flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Categories</h3>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Link
              href="/category/silk-sarees"
              className="text-center p-4 bg-gradient-to-r from-amber-100 to-rose-100 rounded-xl hover:from-amber-200 hover:to-rose-200 transition-colors text-base font-medium text-gray-800 shadow-sm"
            >
              Silk Sarees
            </Link>
            <Link
              href="/category/wedding-sarees"
              className="text-center p-4 bg-gradient-to-r from-rose-100 to-purple-100 rounded-xl hover:from-rose-200 hover:to-purple-200 transition-colors text-base font-medium text-gray-800 shadow-sm"
            >
              Wedding
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-10">
        {categories.map(category => {
          const count = products.filter(p => p.category.toLowerCase() === category.name.toLowerCase()).length;
          return (
            <div key={category.slug} className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center text-center card-hover">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{count} Products</p>
              <p className="text-xs text-gray-600">{category.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
} 