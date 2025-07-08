import { NextRequest } from 'next/server'
import { GET } from '@/app/api/products/route'
import connectDB from '@/lib/db'
import Product from '@/models/Product'

// Mock the database connection
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock the Product model
jest.mock('@/models/Product', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
  },
}))

const mockProduct = {
  _id: 'test-id-1',
  name: 'Test Saree',
  description: 'A beautiful test saree',
  category: 'silk-sarees',
  images: [
    {
      url: '/images/products/test-saree-1.jpg',
      view_type: 'front',
      alt_text: 'Test Saree - Front View'
    },
    {
      url: '/images/products/test-saree-2.jpg',
      view_type: 'back',
      alt_text: 'Test Saree - Back View'
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

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(connectDB as jest.Mock).mockResolvedValue(undefined)
  })

  describe('GET /api/products', () => {
    it('should return all active products with pagination', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockProduct])
          })
        })
      })
      ;(Product.find as jest.Mock).mockImplementation(mockFind)
      ;(Product.countDocuments as jest.Mock).mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0]).toMatchObject({
        _id: mockProduct._id,
        name: mockProduct.name,
        category: mockProduct.category,
      })
      expect(data.pagination).toBeDefined()
    })

    it('should filter products by category', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockProduct])
          })
        })
      })
      ;(Product.find as jest.Mock).mockImplementation(mockFind)
      ;(Product.countDocuments as jest.Mock).mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/products?category=silk-sarees')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'silk-sarees',
          is_active: true
        })
      )
    })

    it('should filter products by price range', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockProduct])
          })
        })
      })
      ;(Product.find as jest.Mock).mockImplementation(mockFind)
      ;(Product.countDocuments as jest.Mock).mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/products?minPrice=5000&maxPrice=15000')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({
          'pricing.selling_price': { $gte: 5000, $lte: 15000 },
          is_active: true
        })
      )
    })

    it('should return featured products only', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockProduct])
          })
        })
      })
      ;(Product.find as jest.Mock).mockImplementation(mockFind)
      ;(Product.countDocuments as jest.Mock).mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/products?featured=true')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({
          is_featured: true,
          is_active: true
        })
      )
    })

    it('should handle database connection errors', async () => {
      (connectDB as jest.Mock).mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Database connection failed')
    })

    it('should handle empty product list', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([])
          })
        })
      })
      ;(Product.find as jest.Mock).mockImplementation(mockFind)
      ;(Product.countDocuments as jest.Mock).mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(0)
      expect(data.pagination.total).toBe(0)
    })

    it('should validate pagination parameters', async () => {
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockProduct])
          })
        })
      })
      ;(Product.find as jest.Mock).mockImplementation(mockFind)
      ;(Product.countDocuments as jest.Mock).mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/products?page=2&limit=5')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.pagination.page).toBe(2)
      expect(data.pagination.limit).toBe(5)
    })
  })
}) 