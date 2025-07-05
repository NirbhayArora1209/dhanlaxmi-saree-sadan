'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Heart, 
  Award, 
  Users, 
  Package, 
  Shield, 
  Truck, 
  Star,
  ArrowLeft,
  CheckCircle,
  Globe,
  Clock,
  Phone
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-800 to-secondary-800 text-white py-20">
          <div className="container-custom">
            <div className="flex items-center mb-6">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-playfair font-bold text-5xl md:text-6xl mb-6">
                Our Story
              </h1>
              <p className="text-xl opacity-90 leading-relaxed">
                Celebrating the timeless elegance of Indian sarees, connecting generations through the art of traditional craftsmanship and modern convenience.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-playfair font-bold text-3xl md:text-4xl text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  To preserve and promote the rich heritage of Indian sarees while making them accessible to women worldwide. We believe every woman deserves to experience the grace and elegance that a beautifully crafted saree brings.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Our commitment goes beyond just selling sarees - we're building a community that celebrates cultural diversity, supports artisans, and empowers women to embrace their heritage with confidence.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-primary-800" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Passion</h3>
                    <p className="text-sm text-gray-600">For traditional craftsmanship</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-secondary-800" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quality</h3>
                    <p className="text-sm text-gray-600">Authentic & premium materials</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                  <h3 className="font-playfair font-bold text-2xl text-gray-900 mb-6">
                    Our Vision
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Global Reach</h4>
                        <p className="text-gray-600">Making Indian sarees accessible to women worldwide</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Artisan Support</h4>
                        <p className="text-gray-600">Supporting traditional weavers and craftsmen</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Cultural Preservation</h4>
                        <p className="text-gray-600">Keeping traditional techniques alive</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Modern Convenience</h4>
                        <p className="text-gray-600">Combining tradition with contemporary shopping</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-playfair font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From a small family business to a trusted name in saree retail, our journey has been marked by passion, dedication, and unwavering commitment to quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary-800 font-bold text-xl">2010</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">The Beginning</h3>
                <p className="text-gray-600">
                  Started as a small family-owned store in Mumbai, specializing in traditional Banarasi and Kanjeevaram sarees.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-secondary-800 font-bold text-xl">2015</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Digital Transformation</h3>
                <p className="text-gray-600">
                  Launched our online platform to reach customers nationwide and showcase our curated collection.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-800 font-bold text-xl">2024</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Global Expansion</h3>
                <p className="text-gray-600">
                  Serving customers worldwide with authentic Indian sarees and exceptional customer service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-playfair font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Why Choose Elegant Sarees?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're not just selling sarees; we're offering an experience that celebrates tradition, quality, and customer satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-800" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Authentic Products</h3>
                <p className="text-gray-600 text-sm">
                  Every saree is carefully sourced from trusted artisans and verified for authenticity.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-secondary-800" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
                <p className="text-gray-600 text-sm">
                  Free shipping on orders above ₹2000 with secure packaging and tracking.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-800" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
                <p className="text-gray-600 text-sm">
                  Our saree experts are always ready to help you choose the perfect saree.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-800" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600 text-sm">
                  Handpicked collection of premium sarees with attention to every detail.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gradient-to-r from-primary-800 to-secondary-800 text-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                <div className="text-sm opacity-90">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-90">Saree Varieties</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                <div className="text-sm opacity-90">Artisan Partners</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">14</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="font-playfair font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Have questions about our sarees or need help choosing the perfect one? Our team is here to help you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </Link>
                <Link href="/products" className="btn-secondary">
                  <Package className="w-4 h-4 mr-2" />
                  Browse Collection
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 