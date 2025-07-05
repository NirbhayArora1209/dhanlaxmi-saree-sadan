import { Product, Category } from '@/types';
import { NextResponse } from 'next/server';

const API_BASE = '/api';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Handle the new API response format
    if (result.success && result.data !== undefined) {
      return result.data;
    }
    
    // Fallback for old format or direct data
    return result;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// API functions
export async function getProducts(): Promise<{ products: Product[], pagination: any }> {
  return fetchAPI<{ products: Product[], pagination: any }>('/products');
}

export async function getCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>('/categories');
}

export async function getCart(): Promise<any[]> {
  return fetchAPI<any[]>('/cart');
}

export async function getWishlist(): Promise<any[]> {
  return fetchAPI<any[]>('/wishlist');
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  });
}

export function errorResponse(message: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status });
}

export function serverErrorResponse(message: string = 'Internal server error'): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 500 });
}

export function notFoundResponse(message: string = 'Resource not found'): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 404 });
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 401 });
}

export function forbiddenResponse(message: string = 'Forbidden'): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 403 });
} 