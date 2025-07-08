'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header activePage="contact" />

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you. Get in touch with us for any questions or assistance.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="input w-full"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="input w-full"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="input w-full"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="input w-full"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <select id="subject" className="input w-full">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Information</option>
                    <option value="order">Order Status</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="input w-full"
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full py-3 text-lg">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Get in touch</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">
                    123 Saree Street<br />
                    Textile District<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground">
                    +91 98765 43210<br />
                    +91 98765 43211
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground">
                    info@dhanlaxmisareesadan.com<br />
                    support@dhanlaxmisareesadan.com
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Saturday: 10:00 AM - 8:00 PM<br />
                    Sunday: 11:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our customer support team is available to help you with any questions or concerns.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                  <p><strong>Support:</strong> Available 7 days a week</p>
                  <p><strong>Languages:</strong> English, Hindi, Marathi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 