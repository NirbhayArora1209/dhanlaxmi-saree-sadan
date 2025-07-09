"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  ctaLink: string;
}

interface HeroSliderProps {
  heroSlides: HeroSlide[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ heroSlides }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoSliding, setIsAutoSliding] = React.useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Auto-slide functionality
  React.useEffect(() => {
    if (!isAutoSliding || heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoSliding, heroSlides.length]);

  // Pause auto-slide on hover
  const handleMouseEnter = () => setIsAutoSliding(false);
  const handleMouseLeave = () => setIsAutoSliding(true);

  return (
    <section 
      className="relative h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0">
        <Image
          src={heroSlides[currentSlide]?.image || "/images/products/placeholder.jpg"}
          alt="Hero"
          fill
          className="w-full h-full object-cover object-top"
          sizes="100vw"
          priority
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/products/placeholder.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight text-shadow-lg">
                {heroSlides[currentSlide]?.title || ""}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-95 text-shadow">
                {heroSlides[currentSlide]?.subtitle || ""}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={heroSlides[currentSlide]?.ctaLink || "/products"}>
                  <Button
                    variant="premium"
                    size="large"
                    icon={<ArrowRight size={20} />}
                    iconPosition="right"
                    className="shadow-xl"
                  >
                    {heroSlides[currentSlide]?.cta || ""}
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    variant="outline"
                    size="large"
                    className="border-white text-white hover:bg-white hover:text-gray-900 shadow-xl backdrop-blur-sm"
                  >
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
};

export default HeroSlider; 