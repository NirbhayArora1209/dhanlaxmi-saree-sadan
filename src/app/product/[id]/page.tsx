'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Product } from '@/types';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  ArrowLeft,
  Minus,
  Plus,
  Share2,
  MessageCircle,
  Package,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    console.log('Adding to cart:', product?.name, 'Quantity:', quantity, 'Size:', selectedSize);
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggled for:', product?.name);
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => Math.min(prev + 1, product?.inventory.available_stock || 10));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background-light">
        <Header />
        <main className="pt-20">
          <div className="container-custom py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
            <Link href="/products" className="btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <section className="bg-white border-b border-gray-100 py-4">
          <div className="container-custom">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary-800 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-primary-800 transition-colors">
                Products
              </Link>
              <span>/</span>
              <Link href={`/category/${product.category.toLowerCase().replace(' ', '-')}`} className="hover:text-primary-800 transition-colors">
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-primary-800' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Product Title and Rating */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.ratings.average_rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {product.ratings.average_rating.toFixed(1)} ({product.ratings.total_reviews} reviews)
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.pricing.selling_price.toLocaleString()}
                  </span>
                  {product.pricing.discount_percentage > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.pricing.base_price.toLocaleString()}
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded-full">
                        {product.pricing.discount_percentage}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Fabric:</span>
                      <span className="ml-2 font-medium">{product.specifications.fabric}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Occasion:</span>
                      <span className="ml-2 font-medium">{product.specifications.occasion}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Length:</span>
                      <span className="ml-2 font-medium">{product.specifications.length} meters</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Care:</span>
                      <span className="ml-2 font-medium">Dry Clean Only</span>
                    </div>
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Size</h3>
                  <div className="flex space-x-3">
                    {['Free Size'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                          selectedSize === size
                            ? 'border-primary-800 bg-primary-50 text-primary-800'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(false)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(true)}
                        disabled={quantity >= (product.inventory.available_stock || 10)}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.inventory.available_stock} available
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.inventory.available_stock === 0}
                      className="flex-1 bg-primary-800 text-white py-4 px-6 rounded-lg hover:bg-primary-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2 inline" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleAddToWishlist}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        isWishlisted
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <button className="w-full bg-secondary-800 text-white py-4 px-6 rounded-lg hover:bg-secondary-900 transition-colors font-semibold">
                    Buy Now
                  </button>
                </div>

                {/* Trust Features */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Why Choose This Saree?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Free Shipping on ₹2000+</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Authentic Product</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RotateCcw className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Easy Returns</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Quality Assured</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Description */}
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Description</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Premium {product.specifications.fabric} fabric for ultimate comfort and elegance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Perfect for {product.specifications.occasion} occasions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{product.specifications.length} meters length for perfect drape</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Free size design that fits most body types</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Includes matching blouse piece</span>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Care Instructions</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dry clean only for best results</li>
                  <li>• Store in a cool, dry place</li>
                  <li>• Avoid direct sunlight to prevent color fading</li>
                  <li>• Iron on low heat if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <button className="flex items-center text-primary-800 hover:text-primary-900 transition-colors">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Write a Review
                </button>
              </div>

              {/* Review Summary */}
              <div className="bg-white rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {product.ratings.average_rating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.ratings.average_rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on {product.ratings.total_reviews} reviews
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600 w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${(rating / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">
                            {Math.round((rating / 5) * product.ratings.total_reviews)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Reviews */}
              <div className="space-y-6">
                {[
                  {
                    name: "Priya Sharma",
                    rating: 5,
                    date: "2 days ago",
                    comment: "Absolutely stunning saree! The fabric quality is excellent and the color is exactly as shown. Perfect for my sister's wedding."
                  },
                  {
                    name: "Anjali Patel",
                    rating: 4,
                    date: "1 week ago",
                    comment: "Beautiful design and good quality. The delivery was fast and the packaging was perfect. Highly recommended!"
                  },
                  {
                    name: "Meera Reddy",
                    rating: 5,
                    date: "2 weeks ago",
                    comment: "This saree exceeded my expectations. The workmanship is impeccable and it fits perfectly. Will definitely buy more from this store."
                  }
                ].map((review, index) => (
                  <div key={index} className="bg-white rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products - TODO: Implement with API */}
        <section className="py-12 bg-white">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="text-center text-gray-600">
              <p>Related products will be loaded here</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 