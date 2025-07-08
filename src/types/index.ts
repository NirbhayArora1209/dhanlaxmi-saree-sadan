// Product Types
export interface ProductImage {
  url: string;
  view_type: 'front' | 'back' | 'side' | 'drape' | 'flat' | 'mannequin' | 'close-up' | 'detail';
  alt_text?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: ProductImage[];
  pricing: {
    base_price: number;
    selling_price: number;
    discount_percentage: number;
  };
  specifications: {
    fabric: string;
    occasion: string;
    length: number;
    blouse_included: boolean;
    care_instructions: string;
  };
  ratings: {
    average_rating: number;
    total_reviews: number;
  };
  inventory: {
    available_stock: number;
    sku: string;
  };
  is_featured: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductSpecifications {
  fabric: string;
  occasion: string;
  length: number;
  blouse_included: boolean;
  care_instructions: string;
}

export interface ProductPricing {
  base_price: number;
  selling_price: number;
  discount_percentage: number;
}

export interface ProductInventory {
  available_stock: number;
  sku: string;
}

export interface ProductMedia {
  primary_image: string;
  gallery: string[];
  video_url?: string;
  thumbnail?: string;
}

export interface ProductSEO {
  meta_title: string;
  meta_description: string;
  structured_data?: object;
  slug: string;
  tags: string[];
}

export interface ProductRatings {
  average_rating: number;
  total_reviews: number;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface Address {
  _id: string;
  type: 'home' | 'office' | 'other';
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  currency: string;
  language: string;
}

// Order Types
export interface Order {
  _id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  amount: number;
  currency: string;
  gateway_response?: object;
}

export interface OrderTracking {
  status: OrderStatus;
  timeline: TrackingEvent[];
  estimated_delivery?: Date;
  actual_delivery?: Date;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: Date;
  location?: string;
  description: string;
}

// Enums
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  UPI = 'upi',
  CARD = 'card',
  NET_BANKING = 'net_banking',
  WALLET = 'wallet',
  COD = 'cod'
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  fabric?: string[];
  occasion?: string[];
  pattern?: string[];
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
}

export interface SortOptions {
  field: 'name' | 'price' | 'rating' | 'created_at';
  order: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search Types
export interface SearchParams {
  query?: string;
  filters?: ProductFilters;
  sort?: SortOptions;
  page?: number;
  limit?: number;
}

// Review Types
export interface Review {
  _id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified_purchase: boolean;
  helpful_votes: number;
  created_at: Date;
  updated_at: Date;
}

// Notification Types
export interface Notification {
  _id: string;
  user_id: string;
  type: 'order' | 'promotion' | 'system' | 'review';
  title: string;
  message: string;
  data?: object;
  read: boolean;
  created_at: Date;
}

// Wishlist Types
export interface WishlistItem {
  product: Product;
  added_at: Date;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Banner Types
export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobile_image?: string;
  link: string;
  button_text?: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  sort_order: number;
} 