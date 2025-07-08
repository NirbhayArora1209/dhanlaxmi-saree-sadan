"use client";

import React from "react";
import Image from "next/image";
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroSlides[currentSlide]?.image || "/images/products/placeholder.jpg"}
          alt="Hero"
          fill
          className="w-full h-full object-cover"
          sizes="100vw"
          priority
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/products/placeholder.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
              {heroSlides[currentSlide]?.title || ""}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              {heroSlides[currentSlide]?.subtitle || ""}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="premium"
                size="large"
                icon={<ArrowRight size={20} />}
                iconPosition="right"
              >
                {heroSlides[currentSlide]?.cta || ""}
              </Button>
              <Button
                variant="outline"
                size="large"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Browse Categories
              </Button>
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
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
};

export default HeroSlider; 