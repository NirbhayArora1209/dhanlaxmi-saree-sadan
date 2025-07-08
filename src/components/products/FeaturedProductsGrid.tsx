"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface ProductType {
  _id: string;
  name: string;
  images: { url: string }[];
  pricing: {
    selling_price: number;
    base_price: number;
    discount_percentage: number;
  };
  ratings: {
    total_reviews: number;
  };
  inventory: {
    available_stock: number;
  };
}

interface FeaturedProductsGridProps {
  featuredProducts: ProductType[];
}

const FeaturedProductsGrid: React.FC<FeaturedProductsGridProps> = ({ featuredProducts }) => {
  return (
    <section className="section bg-premium">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-headline mb-4">Featured Products</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Handpicked sarees that showcase the finest craftsmanship and design
          </p>
        </motion.div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="premium" className="group cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-t-2xl relative">
                    <Image
                      src={product.images[0]?.url || '/images/products/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    {/* Discount Badge */}
                    {product.pricing.discount_percentage > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute top-4 left-4"
                      >
                        {product.pricing.discount_percentage}% OFF
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({product.ratings.total_reviews})
                      </span>
                    </div>
                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold">
                          {formatPrice(product.pricing.selling_price)}
                        </span>
                        {product.pricing.discount_percentage > 0 && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formatPrice(product.pricing.base_price)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.inventory.available_stock} in stock
                      </span>
                    </div>
                    <Link href={`/product/${product._id}`}>
                      <Button variant="primary" fullWidth>
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">No featured products available at the moment.</p>
            <Link href="/products">
              <Button variant="primary">Browse All Products</Button>
            </Link>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <Button variant="premium" size="large" icon={<ArrowRight size={20} />} iconPosition="right">
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProductsGrid; 