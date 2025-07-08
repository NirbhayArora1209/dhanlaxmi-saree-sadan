import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// Success Response Helper
export function successResponse<T>(
  data: T,
  options?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    message?: string;
  }
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...options,
  };

  return NextResponse.json(response);
}

// Error Response Helper
export function errorResponse(
  error: string | Error,
  status: number = 500,
  message?: string
): NextResponse<ApiResponse> {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const response: ApiResponse = {
    success: false,
    error: errorMessage,
    message: message || errorMessage,
  };

  return NextResponse.json(response, { status });
}

// Validation Error Handler
export function handleValidationError(error: ZodError): NextResponse<ApiResponse> {
  const errorMessage = error.errors.map(err => err.message).join(', ');
  return errorResponse('Validation failed', 400, errorMessage);
}

// Database Error Handler
export function handleDatabaseError(error: any): NextResponse<ApiResponse> {
  console.error('Database error:', error);
  
  if (error.code === 11000) {
    return errorResponse('Duplicate entry', 409, 'This record already exists');
  }
  
  if (error.name === 'ValidationError') {
    return errorResponse('Validation failed', 400, error.message);
  }
  
  if (error.name === 'CastError') {
    return errorResponse('Invalid ID format', 400, 'The provided ID is not valid');
  }
  
  return errorResponse('Database error', 500, 'An error occurred while processing your request');
}

// Query Parameters Helper
export function parseQueryParams(url: string) {
  const { searchParams } = new URL(url);
  
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    limit: Math.min(Math.max(1, parseInt(searchParams.get('limit') || '12')), 50), // Min 1, Max 50 items per page
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    sort: searchParams.get('sort') || 'created_at',
    order: searchParams.get('order') === 'asc' ? 1 : -1,
    featured: searchParams.get('featured') === 'true',
    active: searchParams.get('active') !== 'false', // Default to true
  };
}

// Pagination Helper
export function getPaginationInfo(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
}

 