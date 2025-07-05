'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { User, ArrowLeft } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      <main className="pt-20">
        <section className="bg-gradient-to-r from-primary-800 to-secondary-800 text-white py-16 mb-8">
          <div className="container-custom text-center">
            <div className="flex items-center justify-center mb-4">
              <User className="w-10 h-10 mr-2" />
              <h1 className="font-playfair font-bold text-4xl md:text-5xl">My Account</h1>
            </div>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Welcome to your account dashboard. Profile and order management features coming soon!
            </p>
            <Link href="/" className="btn-primary inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 