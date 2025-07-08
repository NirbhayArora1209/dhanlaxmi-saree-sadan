import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductsPage from '@/app/products/page'
import { Product } from '@/types'
import { StoreProvider } from '@/context/StoreContext'

// Mock the client API
jest.mock('@/lib/client-api', () => ({
  getProducts: jest.fn(),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

const mockProducts: Product[] = [
  {
    _id: 'test-product-1',
    name: 'Banarasi Silk Saree',
    description: 'Exquisite Banarasi silk saree with intricate zari work',
    category: 'silk-sarees',
    images: [
      {
        url: '/images/products/banarasi-silk-1.jpg',
        view_type: 'front',
        alt_text: 'Banarasi Silk Saree - Front View'
      },
      {
        url: '/images/products/banarasi-silk-2.jpg',
        view_type: 'back',
        alt_text: 'Banarasi Silk Saree - Back View'
      }
    ],
    pricing: {
      base_price: 25000,
      selling_price: 18999,
      discount_percentage: 24,
    },
    specifications: {
      fabric: 'Pure Banarasi Silk',
      occasion: 'Wedding',
      length: 6.5,
      blouse_included: true,
      care_instructions: 'Dry clean only',
    },
    ratings: {
      average_rating: 4.8,
      total_reviews: 127,
    },
    inventory: {
      available_stock: 12,
      sku: 'BAN-SILK-001',
    },
    is_featured: true,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: 'test-product-2',
    name: 'Cotton Handloom Saree',
    description: 'Comfortable cotton handloom saree with geometric patterns',
    category: 'cotton-sarees',
    images: [
      {
        url: '/images/products/cotton-handloom-1.jpg',
        view_type: 'front',
        alt_text: 'Cotton Handloom Saree - Front View'
      }
    ],
    pricing: {
      base_price: 3500,
      selling_price: 2499,
      discount_percentage: 29,
    },
    specifications: {
      fabric: 'Organic Cotton',
      occasion: 'Daily Wear',
      length: 6.0,
      blouse_included: false,
      care_instructions: 'Hand wash in cold water',
    },
    ratings: {
      average_rating: 4.6,
      total_reviews: 89,
    },
    inventory: {
      available_stock: 28,
      sku: 'COT-HAND-002',
    },
    is_featured: false,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  }
]

describe('Products Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loading spinner initially', () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      expect(screen.getByText('Loading products...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument() // Spinner
    })
  })

  describe('Success State', () => {
    it('should display products when API call succeeds', async () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: true,
        data: mockProducts
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        expect(screen.getAllByText(/Banarasi\s*Silk\s*Saree/i)[0]).toBeInTheDocument()
        expect(screen.getAllByText(/Cotton\s*Handloom\s*Saree/i)[0]).toBeInTheDocument()
      })

      // Check product images
      const images = screen.getAllByRole('img')
      expect(images[0]).toHaveAttribute('src', '/images/products/banarasi-silk-1.jpg')
      expect(images[0]).toHaveAttribute('alt', expect.stringContaining('Banarasi Silk Saree'))
      expect(images[1]).toHaveAttribute('src', '/images/products/cotton-handloom-1.jpg')
      expect(images[1]).toHaveAttribute('alt', expect.stringContaining('Cotton Handloom Saree'))

      // Check product details
      expect(screen.getByText('₹18,999')).toBeInTheDocument()
      expect(screen.getByText('₹24,999')).toBeInTheDocument() // Original price
      expect(screen.getByText('24% OFF')).toBeInTheDocument()
      expect(screen.getByText('29% OFF')).toBeInTheDocument()

      // Check ratings
      expect(screen.getByText((content) => /\(\d+\)/i.test(content))).toBeInTheDocument()

      // Check stock information
      expect(screen.getByText((content) => /\d+\s*in\s*stock/i.test(content))).toBeInTheDocument()

      // Check View Details buttons
      const viewDetailsButtons = screen.getAllByText('View Details')
      expect(viewDetailsButtons).toHaveLength(2)
    })

    it('should handle products with missing images gracefully', async () => {
      const productsWithMissingImages = [
        {
          ...mockProducts[0],
          images: []
        }
      ]

      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: true,
        data: productsWithMissingImages
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        expect(screen.getByText((content) => /Banarasi\s*Silk\s*Saree/i.test(content))).toBeInTheDocument()
      })

      // Should show placeholder image
      const images = screen.getAllByRole('img')
      expect(images[0]).toHaveAttribute('src', '/images/products/placeholder.jpg')
    })

    it('should handle products with missing alt text', async () => {
      const productsWithMissingAlt = [
        {
          ...mockProducts[0],
          images: [
            {
              url: '/images/products/banarasi-silk-1.jpg',
              view_type: 'front' as const
            }
          ]
        }
      ]

      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: true,
        data: productsWithMissingAlt
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        expect(screen.getByText((content) => /Banarasi\s*Silk\s*Saree/i.test(content))).toBeInTheDocument()
      })

      // Should use product name as fallback alt text
      const images = screen.getAllByRole('img')
      expect(images[0]).toHaveAttribute('alt', 'Banarasi Silk Saree')
    })

    it('should display product descriptions', async () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: true,
        data: mockProducts
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        expect(screen.getByText((content) => /Exquisite.*zari work/i.test(content))).toBeInTheDocument()
        expect(screen.getByText((content) => /Comfortable.*geometric patterns/i.test(content))).toBeInTheDocument()
      })
    })

    it('should display star ratings', async () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: true,
        data: mockProducts
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        // Check for star characters (★) in any element
        const stars = screen.queryAllByText('★')
        expect(stars.length).toBeGreaterThan(0)
      })
    })

    it('should display discount information correctly', async () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: true,
        data: mockProducts
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        // Check original prices (strikethrough)
        expect(screen.getByText('₹25,000')).toBeInTheDocument()
        expect(screen.getByText('₹3,500')).toBeInTheDocument()
        
        // Check discount percentages
        expect(screen.getByText('24% OFF')).toBeInTheDocument()
        expect(screen.getByText('29% OFF')).toBeInTheDocument()
      })
    })
  })

  describe('Error State', () => {
    it('should display error message when API call fails', async () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockRejectedValue(new Error('Failed to fetch products'))

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch products/i)).toBeInTheDocument()
        expect(screen.getByText(/Try Again/i)).toBeInTheDocument()
      })
    })

    it('should display error message when API returns error response', async () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: false,
        message: 'Database connection failed'
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        expect(screen.getByText(/Database connection failed/i)).toBeInTheDocument()
        expect(screen.getByText(/Try Again/i)).toBeInTheDocument()
      })
    })

    it.skip('should reload page when Try Again button is clicked', async () => {
      // Skipped due to JSDOM reload mocking limitations
    })
  })

  describe('Empty State', () => {
    it('should display empty state when no products are returned', async () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: true,
        data: []
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        expect(screen.getByText('No products found.')).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('should have proper navigation links', async () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: true,
        data: mockProducts
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        const branding = screen.getAllByText(/Dhanlaxmi\s*Saree\s*Sadan/i)
        expect(branding.length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Products/i)[0]).toBeInTheDocument()
        expect(screen.getAllByText(/Categories/i)[0]).toBeInTheDocument()
      })
    })

    it('should have View Details links for each product', async () => {
      const { getProducts } = require('@/lib/client-api')
      getProducts.mockResolvedValue({
        success: true,
        data: mockProducts
      })

      render(<StoreProvider><ProductsPage /></StoreProvider>)

      await waitFor(() => {
        const viewDetailsLinks = screen.getAllByText('View Details')
        expect(viewDetailsLinks).toHaveLength(2)
        
        // Check that links point to correct product pages
        expect(viewDetailsLinks[0].closest('a')).toHaveAttribute('href', '/product/test-product-1')
        expect(viewDetailsLinks[1].closest('a')).toHaveAttribute('href', '/product/test-product-2')
      })
    })
  })
}) 
}) 