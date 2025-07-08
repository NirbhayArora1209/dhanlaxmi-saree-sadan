import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { StoreProvider, useStore } from '@/context/StoreContext'
import { Product } from '@/types'

// Mock all named API imports used in StoreContext
jest.mock('@/lib/client-api', () => ({
  productsApi: {
    getProducts: jest.fn().mockResolvedValue({ data: [] }),
    getFeaturedProducts: jest.fn().mockResolvedValue([]),
    getProduct: jest.fn().mockResolvedValue({}),
  },
  categoriesApi: {
    getCategories: jest.fn().mockResolvedValue([]),
  },
  cartApi: {
    addToCart: jest.fn().mockResolvedValue({ items: [], total_amount: 0 }),
    removeFromCart: jest.fn().mockResolvedValue({ items: [], total_amount: 0 }),
    updateCartItem: jest.fn().mockResolvedValue({ items: [], total_amount: 0 }),
    clearCart: jest.fn().mockResolvedValue({}),
    getCart: jest.fn().mockResolvedValue({ items: [] }),
  },
  wishlistApi: {
    addToWishlist: jest.fn().mockResolvedValue({ items: [] }),
    removeFromWishlist: jest.fn().mockResolvedValue({ items: [] }),
    clearWishlist: jest.fn().mockResolvedValue({}),
    getWishlist: jest.fn().mockResolvedValue({ items: [] }),
  },
}))

const mockProduct: Product = {
  _id: 'test-product-id',
  name: 'Test Saree',
  description: 'A beautiful test saree',
  category: 'silk-sarees',
  images: [
    {
      url: '/images/products/test-saree-1.jpg',
      view_type: 'front',
      alt_text: 'Test Saree - Front View'
    }
  ],
  pricing: {
    base_price: 10000,
    selling_price: 7999,
    discount_percentage: 20,
  },
  specifications: {
    fabric: 'Silk',
    occasion: 'Wedding',
    length: 6.0,
    blouse_included: true,
    care_instructions: 'Dry clean only',
  },
  ratings: {
    average_rating: 4.5,
    total_reviews: 50,
  },
  inventory: {
    available_stock: 10,
    sku: 'TEST-001',
  },
  is_featured: true,
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
}

// Test component to access store context
const TestComponent = () => {
  const store = useStore()
  
  return (
    <div>
      <div data-testid="loading-products">{store.loading.products ? 'Loading' : 'Loaded'}</div>
      <div data-testid="error-products">{store.error.products || 'No error'}</div>
      <div data-testid="error-cart">{store.error.cart || 'No error'}</div>
      <div data-testid="error-wishlist">{store.error.wishlist || 'No error'}</div>
      <div data-testid="products-count">{store.products.length}</div>
      <div data-testid="cart-count">{store.getCartCount()}</div>
      <div data-testid="wishlist-count">{store.getWishlistCount()}</div>
      
      <button onClick={() => store.addToCart(mockProduct, 1)} data-testid="add-to-cart">
        Add to Cart
      </button>
      <button onClick={() => store.removeFromCart(mockProduct._id)} data-testid="remove-from-cart">
        Remove from Cart
      </button>
      <button onClick={() => store.addToWishlist(mockProduct)} data-testid="add-to-wishlist">
        Add to Wishlist
      </button>
      <button onClick={() => store.removeFromWishlist(mockProduct._id)} data-testid="remove-from-wishlist">
        Remove from Wishlist
      </button>
      <button onClick={() => store.getProduct(mockProduct._id)} data-testid="get-product">
        Get Product
      </button>
      <button data-testid="fetch-products" onClick={() => store.fetchProducts()}>Fetch Products</button>
    </div>
  )
}

describe('StoreContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { productsApi, cartApi, wishlistApi, categoriesApi } = require('@/lib/client-api');
    // Default: all API calls succeed and return empty arrays/objects
    productsApi.getProducts.mockResolvedValue({ data: [] });
    productsApi.getFeaturedProducts.mockResolvedValue([]);
    productsApi.getProduct.mockResolvedValue({});
    categoriesApi.getCategories.mockResolvedValue([]);
    cartApi.addToCart.mockResolvedValue({ items: [], total_amount: 0 });
    cartApi.removeFromCart.mockResolvedValue({ items: [], total_amount: 0 });
    cartApi.updateCartItem.mockResolvedValue({ items: [], total_amount: 0 });
    cartApi.clearCart.mockResolvedValue({});
    cartApi.getCart.mockResolvedValue({ items: [] });
    wishlistApi.addToWishlist.mockResolvedValue({ items: [] });
    wishlistApi.removeFromWishlist.mockResolvedValue({ items: [] });
    wishlistApi.clearWishlist.mockResolvedValue({});
    wishlistApi.getWishlist.mockResolvedValue({ items: [] });
  })

  describe('Initial State', () => {
    it('should provide initial state', () => {
      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      expect(screen.getByTestId('loading-products')).toHaveTextContent('Loaded')
      expect(screen.getByTestId('error-products')).toHaveTextContent('No error')
      expect(screen.getByTestId('error-cart')).toHaveTextContent('No error')
      expect(screen.getByTestId('error-wishlist')).toHaveTextContent('No error')
      expect(screen.getByTestId('products-count')).toHaveTextContent('0')
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
      expect(screen.getByTestId('wishlist-count')).toHaveTextContent('0')
    })
  })

  describe('Cart Operations', () => {
    it('should add product to cart', async () => {
      const { cartApi } = require('@/lib/client-api')
      cartApi.addToCart.mockResolvedValue({
        success: true,
        data: {
          items: [{ product_id: mockProduct._id, quantity: 1 }],
          total_amount: mockProduct.pricing.selling_price
        }
      })

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      fireEvent.click(screen.getByTestId('add-to-cart'))

      await waitFor(() => {
        expect(cartApi.addToCart).toHaveBeenCalledWith(mockProduct._id, 1)
      })
    })

    it('should remove product from cart', async () => {
      const { cartApi } = require('@/lib/client-api')
      cartApi.removeFromCart.mockResolvedValue({
        success: true,
        data: {
          items: [],
          total_amount: 0
        }
      })

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      fireEvent.click(screen.getByTestId('remove-from-cart'))

      await waitFor(() => {
        expect(cartApi.removeFromCart).toHaveBeenCalledWith(mockProduct._id)
      })
    })

    it('should handle cart API errors', async () => {
      const { cartApi } = require('@/lib/client-api')
      cartApi.addToCart.mockRejectedValue(new Error('API Error'))

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      fireEvent.click(screen.getByTestId('add-to-cart'))

      await waitFor(() => {
        expect(screen.getByTestId('error-cart')).toHaveTextContent('API Error')
      })
    })
  })

  describe('Wishlist Operations', () => {
    it('should add product to wishlist', async () => {
      const { wishlistApi } = require('@/lib/client-api')
      wishlistApi.addToWishlist.mockResolvedValue({
        success: true,
        data: {
          items: [{ product_id: mockProduct._id }]
        }
      })

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      fireEvent.click(screen.getByTestId('add-to-wishlist'))

      await waitFor(() => {
        expect(wishlistApi.addToWishlist).toHaveBeenCalledWith(mockProduct._id)
      })
    })

    it('should remove product from wishlist', async () => {
      const { wishlistApi } = require('@/lib/client-api')
      wishlistApi.removeFromWishlist.mockResolvedValue({
        success: true,
        data: {
          items: []
        }
      })

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      fireEvent.click(screen.getByTestId('remove-from-wishlist'))

      await waitFor(() => {
        expect(wishlistApi.removeFromWishlist).toHaveBeenCalledWith(mockProduct._id)
      })
    })

    it('should handle wishlist API errors', async () => {
      const { wishlistApi } = require('@/lib/client-api')
      wishlistApi.addToWishlist.mockRejectedValue(new Error('Wishlist API Error'))

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      fireEvent.click(screen.getByTestId('add-to-wishlist'))

      await waitFor(() => {
        expect(screen.getByTestId('error-wishlist')).toHaveTextContent('Wishlist API Error')
      })
    })
  })

  describe('Product Operations', () => {
    it('should fetch product by ID', async () => {
      const { productsApi } = require('@/lib/client-api')
      productsApi.getProduct.mockResolvedValue({
        success: true,
        data: mockProduct
      })

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      fireEvent.click(screen.getByTestId('get-product'))

      await waitFor(() => {
        expect(productsApi.getProduct).toHaveBeenCalledWith(mockProduct._id)
      })
    })

    it('should handle product not found', async () => {
      const { productsApi } = require('@/lib/client-api')
      productsApi.getProduct.mockResolvedValue({
        success: false,
        message: 'Product not found'
      })

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      fireEvent.click(screen.getByTestId('get-product'))

      await waitFor(() => {
        expect(productsApi.getProduct).toHaveBeenCalledWith(mockProduct._id)
      })
    })
  })

  describe('Utility Methods', () => {
    it('should check if product is in cart', () => {
      const TestCartComponent = () => {
        const store = useStore()
        return (
          <div>
            <div data-testid="in-cart">{store.isInCart(mockProduct._id) ? 'Yes' : 'No'}</div>
            <div data-testid="in-wishlist">{store.isInWishlist(mockProduct._id) ? 'Yes' : 'No'}</div>
          </div>
        )
      }

      render(
        <StoreProvider>
          <TestCartComponent />
        </StoreProvider>
      )

      expect(screen.getByTestId('in-cart')).toHaveTextContent('No')
      expect(screen.getByTestId('in-wishlist')).toHaveTextContent('No')
    })

    it('should return correct cart and wishlist counts', () => {
      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
      expect(screen.getByTestId('wishlist-count')).toHaveTextContent('0')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const { productsApi } = require('@/lib/client-api')
      productsApi.getProducts.mockRejectedValue(new Error('Network error'))
      productsApi.getFeaturedProducts.mockRejectedValue(new Error('Network error'))

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      );

      // Use act only for the click event
      await act(async () => {
        fireEvent.click(screen.getByTestId('fetch-products'));
      });

      // The store should handle the error gracefully
      await waitFor(() => {
        expect(screen.getByTestId('error-products')).toHaveTextContent('Network error')
      })
    })

    it('should handle API response errors', async () => {
      const { cartApi } = require('@/lib/client-api')
      cartApi.addToCart.mockResolvedValue({
        success: false,
        message: 'Product out of stock'
      })

      render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      )

      fireEvent.click(screen.getByTestId('add-to-cart'))

      await waitFor(() => {
        expect(screen.getByTestId('error-cart')).toHaveTextContent('Product out of stock')
      })
    })
  })

  describe('Context Usage', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useStore must be used within a StoreProvider')

      consoleSpy.mockRestore()
    })
  })
}) 