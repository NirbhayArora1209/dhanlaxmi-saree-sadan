'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header activePage="about" />

      {/* About Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">About Dhanlaxmi Saree Sadan</h1>
            <p className="text-xl text-muted-foreground">
              Preserving tradition, embracing elegance
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              Welcome to Dhanlaxmi Saree Sadan, where we celebrate the timeless beauty and cultural heritage of Indian sarees. 
              Our journey began with a simple mission: to bring the finest handcrafted sarees from across India to discerning customers worldwide.
            </p>

            <h2 className="text-2xl font-serif font-bold mb-4">Our Story</h2>
            <p className="mb-6">
              Founded in 2020, Dhanlaxmi Saree Sadan has been at the forefront of preserving and promoting India's rich textile heritage. 
              We work directly with master weavers and artisans from various regions, ensuring that each saree tells a story of tradition, 
              craftsmanship, and cultural significance.
            </p>

            <h2 className="text-2xl font-serif font-bold mb-4">Our Collection</h2>
            <p className="mb-6">
              From the intricate Banarasi silks of Varanasi to the elegant Kanjeevaram silks of Tamil Nadu, 
              from the lightweight Chiffon sarees to the comfortable Cotton handlooms, our collection represents 
              the diverse and rich tapestry of Indian textile traditions.
            </p>

            <h2 className="text-2xl font-serif font-bold mb-4">Our Commitment</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Quality Assurance</h3>
                <p className="text-sm text-muted-foreground">
                  Every saree in our collection undergoes rigorous quality checks to ensure it meets our high standards.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Authentic Products</h3>
                <p className="text-sm text-muted-foreground">
                  We guarantee the authenticity of all our products, sourced directly from verified artisans and weavers.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Customer Satisfaction</h3>
                <p className="text-sm text-muted-foreground">
                  Your satisfaction is our priority. We provide excellent customer service and support throughout your shopping journey.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Cultural Preservation</h3>
                <p className="text-sm text-muted-foreground">
                  By supporting traditional artisans, we contribute to the preservation of India's rich textile heritage.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold mb-4">Why Choose Us?</h2>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Curated collection of premium sarees from renowned weavers</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Direct sourcing from artisans ensures fair compensation</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Comprehensive product information and care instructions</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Secure payment options and reliable shipping</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Dedicated customer support team</span>
              </li>
            </ul>

            <div className="text-center mt-12">
              <Link href="/products" className="btn btn-primary px-8 py-3 text-lg">
                Explore Our Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 