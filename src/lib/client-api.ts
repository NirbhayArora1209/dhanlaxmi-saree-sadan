import { Product, Category, ApiResponse, PaginatedResponse } from '@/types';

const API_BASE = '/api';

// Generic API call function
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const fullUrl = `${API_BASE}${endpoint}`;
  console.log(`🔄 API Call: ${fullUrl}`);
  console.log(`🔄 API Options:`, options);
  
  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    console.log(`📡 API Response Status: ${response.status} ${response.statusText}`);
    console.log(`📡 API Response Headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`❌ API Error Body:`, errorText);
      throw new Error(`API call failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ API Response Data:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Call Exception:`, error);
    throw error;
  }
}

// Products API
export const productsApi = {
  // Get all products with filters
  async getProducts(params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured) searchParams.append('featured', 'true');
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.order) searchParams.append('order', params.order);
    
    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiCall<ApiResponse<PaginatedResponse<Product>>>(endpoint);
    return response.data!;
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const response = await this.getProducts({ featured: true, limit });
    return response.data;
  },

  // Get product by ID
  async getProduct(id: string): Promise<Product> {
    const response = await apiCall<ApiResponse<Product>>(`/products/${id}`);
    return response.data!;
  },

  // Search products
  async searchProducts(query: string, limit: number = 12): Promise<Product[]> {
    const searchParams = new URLSearchParams({ q: query, limit: limit.toString() });
    const response = await apiCall<ApiResponse<Product[]>>(`/products?${searchParams}`);
    return response.data!;
  },
};

// Export getProducts function directly for backward compatibility
export const getProducts = productsApi.getProducts.bind(productsApi);

// Categories API
export const categoriesApi = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await apiCall<ApiResponse<Category[]>>('/categories');
    return response.data!;
  },

  // Get category by slug
  async getCategory(slug: string): Promise<Category> {
    const response = await apiCall<ApiResponse<Category>>(`/categories/${slug}`);
    return response.data!;
  },
};

// Cart API
export const cartApi = {
  async getCart(): Promise<any> {
    const response = await apiCall<ApiResponse<any>>('/cart');
    return response.data!;
  },

  async addToCart(productId: string, quantity: number = 1): Promise<any> {
    const response = await apiCall<ApiResponse<any>>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    return response.data!;
  },

  async removeFromCart(productId: string): Promise<any> {
    const response = await apiCall<ApiResponse<any>>(`/cart/${productId}`, {
      method: 'DELETE',
    });
    return response.data!;
  },

  async updateCartItem(productId: string, quantity: number): Promise<any> {
    const response = await apiCall<ApiResponse<any>>('/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
    return response.data!;
  },

  async clearCart(): Promise<any> {
    const response = await apiCall<ApiResponse<any>>('/cart', {
      method: 'DELETE',
    });
    return response.data!;
  },
};

// Wishlist API
export const wishlistApi = {
  async getWishlist(): Promise<any> {
    const response = await apiCall<ApiResponse<any>>('/wishlist');
    return response.data!;
  },

  async addToWishlist(productId: string): Promise<any> {
    const response = await apiCall<ApiResponse<any>>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    return response.data!;
  },

  async removeFromWishlist(productId: string): Promise<any> {
    const response = await apiCall<ApiResponse<any>>(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
    return response.data!;
  },

  async clearWishlist(): Promise<any> {
    const response = await apiCall<ApiResponse<any>>('/wishlist', {
      method: 'DELETE',
    });
    return response.data!;
  },
}; 