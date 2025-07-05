'use client';

import { useState } from 'react';

interface PlaceholderImageProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export default function PlaceholderImage({
  alt,
  className = '',
  width,
  height,
  fill = false,
  sizes,
  priority = false,
}: PlaceholderImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate a consistent color based on the alt text
  const getColorFromText = (text: string) => {
    const colors = [
      'from-pink-100 to-pink-300',
      'from-purple-100 to-purple-300',
      'from-blue-100 to-blue-300',
      'from-green-100 to-green-300',
      'from-yellow-100 to-yellow-300',
      'from-red-100 to-red-300',
      'from-indigo-100 to-indigo-300',
      'from-teal-100 to-teal-300',
    ];
    
    const index = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const gradientClass = getColorFromText(alt);

  if (fill) {
    return (
      <div
        className={`relative ${className}`}
        style={{ width: '100%', height: '100%' }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">🧵</div>
            <p className="text-xs text-gray-600 font-medium px-2 text-center">
              {alt}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br ${gradientClass} flex items-center justify-center ${className}`}
      style={{ width: width || '100%', height: height || '100%' }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">🧵</div>
        <p className="text-xs text-gray-600 font-medium px-2 text-center">
          {alt}
        </p>
      </div>
    </div>
  );
} 