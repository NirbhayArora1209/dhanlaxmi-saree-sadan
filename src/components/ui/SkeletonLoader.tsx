import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'product' | 'category' | 'text' | 'card' | 'hero';
  count?: number;
  className?: string;
}

const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'linear',
  },
};

export default function SkeletonLoader({ 
  variant = 'product', 
  count = 1, 
  className = '' 
}: SkeletonLoaderProps) {
  const skeletonClass = `bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse ${className}`;

  const renderProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <motion.div 
        className={`aspect-square ${skeletonClass}`}
        {...shimmer}
      />
      <div className="p-6">
        <motion.div 
          className={`h-4 rounded mb-2 w-1/3 ${skeletonClass}`}
          {...shimmer}
        />
        <motion.div 
          className={`h-6 rounded mb-3 w-full ${skeletonClass}`}
          {...shimmer}
        />
        <motion.div 
          className={`h-4 rounded mb-4 w-2/3 ${skeletonClass}`}
          {...shimmer}
        />
        <div className="flex justify-between items-center mb-4">
          <motion.div 
            className={`h-6 rounded w-20 ${skeletonClass}`}
            {...shimmer}
          />
          <motion.div 
            className={`h-4 rounded w-16 ${skeletonClass}`}
            {...shimmer}
          />
        </div>
        <motion.div 
          className={`h-10 rounded w-full ${skeletonClass}`}
          {...shimmer}
        />
      </div>
    </div>
  );

  const renderCategorySkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <motion.div 
        className={`aspect-video ${skeletonClass}`}
        {...shimmer}
      />
      <div className="p-6">
        <motion.div 
          className={`h-6 rounded mb-2 w-3/4 ${skeletonClass}`}
          {...shimmer}
        />
        <motion.div 
          className={`h-4 rounded w-1/2 ${skeletonClass}`}
          {...shimmer}
        />
      </div>
    </div>
  );

  const renderTextSkeleton = () => (
    <div className="space-y-3">
      <motion.div 
        className={`h-4 rounded w-full ${skeletonClass}`}
        {...shimmer}
      />
      <motion.div 
        className={`h-4 rounded w-5/6 ${skeletonClass}`}
        {...shimmer}
      />
      <motion.div 
        className={`h-4 rounded w-4/6 ${skeletonClass}`}
        {...shimmer}
      />
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <motion.div 
        className={`h-6 rounded mb-4 w-1/2 ${skeletonClass}`}
        {...shimmer}
      />
      <div className="space-y-3">
        <motion.div 
          className={`h-4 rounded w-full ${skeletonClass}`}
          {...shimmer}
        />
        <motion.div 
          className={`h-4 rounded w-3/4 ${skeletonClass}`}
          {...shimmer}
        />
        <motion.div 
          className={`h-4 rounded w-5/6 ${skeletonClass}`}
          {...shimmer}
        />
      </div>
    </div>
  );

  const renderHeroSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <motion.div 
        className={`h-96 ${skeletonClass}`}
        {...shimmer}
      />
      <div className="p-8">
        <motion.div 
          className={`h-8 rounded mb-4 w-2/3 ${skeletonClass}`}
          {...shimmer}
        />
        <motion.div 
          className={`h-6 rounded mb-6 w-full ${skeletonClass}`}
          {...shimmer}
        />
        <motion.div 
          className={`h-12 rounded w-40 ${skeletonClass}`}
          {...shimmer}
        />
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'product':
        return renderProductSkeleton();
      case 'category':
        return renderCategorySkeleton();
      case 'text':
        return renderTextSkeleton();
      case 'card':
        return renderCardSkeleton();
      case 'hero':
        return renderHeroSkeleton();
      default:
        return renderProductSkeleton();
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
}