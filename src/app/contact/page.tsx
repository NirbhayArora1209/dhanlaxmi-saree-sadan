'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  ArrowLeft,
  MessageSquare,
  User,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-800 to-secondary-800 text-white py-16">
          <div className="container-custom">
            <div className="flex items-center mb-6">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-6">
                Get in Touch
              </h1>
              <p className="text-xl opacity-90 leading-relaxed">
                Have questions about our sarees or need help choosing the perfect one? We're here to help you find the saree of your dreams.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="font-playfair font-bold text-2xl text-gray-900 mb-6">
                  Send us a Message
                </h2>
                
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-800 outline-none"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-800 outline-none"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-800 outline-none"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-800 outline-none"
                        >
                          <option value="">Select a subject</option>
                          <option value="product-inquiry">Product Inquiry</option>
                          <option value="size-help">Size & Fit Help</option>
                          <option value="order-status">Order Status</option>
                          <option value="return-exchange">Return & Exchange</option>
                          <option value="custom-order">Custom Order</option>
                          <option value="general">General Inquiry</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-800 outline-none resize-none"
                          placeholder="Tell us how we can help you..."
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-800 text-white py-4 px-6 rounded-lg hover:bg-primary-900 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Business Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h3 className="font-playfair font-bold text-2xl text-gray-900 mb-6">
                    Contact Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                        <p className="text-gray-600">+91 98765 43210</p>
                        <p className="text-gray-600">+91 98765 43211</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-secondary-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                        <p className="text-gray-600">info@elegantsarees.com</p>
                        <p className="text-gray-600">support@elegantsarees.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-green-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                        <p className="text-gray-600">
                          Elegant Sarees<br />
                          123 Fashion Street<br />
                          Andheri West, Mumbai<br />
                          Maharashtra 400058, India
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-yellow-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                        <p className="text-gray-600">
                          Monday - Friday: 9:00 AM - 8:00 PM<br />
                          Saturday: 10:00 AM - 6:00 PM<br />
                          Sunday: 11:00 AM - 5:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
                  <h3 className="font-playfair font-bold text-2xl text-gray-900 mb-6">
                    Quick Help
                  </h3>
                  
                  <div className="space-y-4">
                    <Link 
                      href="/products" 
                      className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">Browse Our Collection</h4>
                      <p className="text-sm text-gray-600">Explore our wide range of authentic Indian sarees</p>
                    </Link>
                    
                    <Link 
                      href="/about" 
                      className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">About Us</h4>
                      <p className="text-sm text-gray-600">Learn more about our story and mission</p>
                    </Link>
                    
                    <Link 
                      href="/cart" 
                      className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">Track Your Order</h4>
                      <p className="text-sm text-gray-600">Check the status of your current orders</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-playfair font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find quick answers to common questions about our sarees and services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">How do I choose the right saree size?</h3>
                <p className="text-gray-600 text-sm">
                  Most of our sarees come in a standard 6-yard length that fits most body types. For custom sizing, please contact our customer support team.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">What is your return policy?</h3>
                <p className="text-gray-600 text-sm">
                  We offer a 30-day return policy for unused items in original packaging. Custom orders and sale items are non-returnable.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Do you ship internationally?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Are your sarees authentic?</h3>
                <p className="text-gray-600 text-sm">
                  Absolutely! All our sarees are sourced directly from trusted artisans and verified for authenticity before listing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 