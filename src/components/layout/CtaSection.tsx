"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const CtaSection: React.FC = () => {
  return (
    <section className="section bg-gradient-to-r from-amber-600 to-orange-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-headline mb-6">
            Ready to Find Your Perfect Saree?
          </h2>
          <p className="text-body-large mb-8 opacity-90 max-w-2xl mx-auto">
            Explore our collection and discover the perfect saree for your special occasion. 
            Each piece tells a story of tradition and elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                variant="outline"
                size="large"
                className="border-white text-white hover:bg-white hover:text-amber-600"
                icon={<ArrowRight size={20} />}
                iconPosition="right"
              >
                Start Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="ghost"
                size="large"
                className="text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection; 