'use client';

import Image from 'next/image';
import { Product } from '@/types';

interface ProductImageProps {
  product: Product;
  className?: string;
}

const getLocalImagePath = (product: Product) => {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  // Fallback to a default image based on category
  return `/images/products/${product.category}-1.jpg`;
};

export default function ProductImage({ product, className = "" }: ProductImageProps) {
  const localImagePath = getLocalImagePath(product);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={localImagePath}
        alt={product.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {/* You can add price/discount badges here if needed */}
    </div>
  );
} 