// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  pricing: ProductPricing;
  specifications: ProductSpecifications;
  ratings: ProductRatings;
  inventory: ProductInventory;
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
  phone: string;
  addresses: Address[];
  preferences: UserPreferences;
  loyalty_points: number;
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
  order_number: string;
  user_id: string;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  payment: PaymentDetails;
  status: OrderStatus;
  tracking: OrderTracking;
  totals: OrderTotals;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
  selected_size?: string;
  selected_color?: string;
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
  category?: string[];
  price_range?: {
    min: number;
    max: number;
  };
  fabric?: string[];
  occasion?: string[];
  pattern?: string[];
  rating?: number;
  availability?: 'in_stock' | 'out_of_stock' | 'all';
  sort_by?: 'price_low' | 'price_high' | 'newest' | 'popular' | 'rating';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Search Types
export interface SearchResult {
  products: Product[];
  suggestions: string[];
  filters: ProductFilters;
  total_results: number;
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
  parent_id?: string;
  children?: Category[];
  product_count: number;
  is_active: boolean;
  sort_order: number;
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