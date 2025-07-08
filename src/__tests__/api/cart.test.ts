import { NextRequest } from 'next/server'
import { GET, POST, DELETE } from '@/app/api/cart/route'
import connectDB from '@/lib/db'
import Cart from '@/models/Cart'
import Product from '@/models/Product'

// Mock the database connection
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock the Cart model
jest.mock('@/models/Cart', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}))

// Mock the Product model
jest.mock('@/models/Product', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}))

const mockProduct = {
  _id: 'test-product-id',
  name: 'Test Saree',
  pricing: {
    selling_price: 7999,
  },
  images: [
    {
      url: '/images/products/test-saree-1.jpg',
      view_type: 'front',
      alt_text: 'Test Saree - Front View'
    }
  ],
  inventory: {
    available_stock: 10,
  },
}

const mockCart = {
  _id: 'test-cart-id',
  user_id: 'test-user-id',
  items: [
    {
      product_id: 'test-product-id',
      name: 'Test Saree',
      price: 7999,
      quantity: 2,
      image: '/images/products/test-saree-1.jpg',
    }
  ],
  total_amount: 15998,
  created_at: new Date(),
  updated_at: new Date(),
}

describe('Cart API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(connectDB as jest.Mock).mockResolvedValue(undefined)
  })

  describe('GET /api/cart', () => {
    it('should return user cart', async () => {
      (Cart.findOne as jest.Mock).mockResolvedValue(mockCart)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        headers: {
          'user-id': 'test-user-id',
        },
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toMatchObject({
        _id: mockCart._id,
        user_id: mockCart.user_id,
        total_amount: mockCart.total_amount,
      })
      expect(data.data.items).toHaveLength(1)
    })

    it('should return empty cart for new user', async () => {
      (Cart.findOne as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        headers: {
          'user-id': 'new-user-id',
        },
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.items).toHaveLength(0)
      expect(data.data.total_amount).toBe(0)
    })

    it('should handle missing user ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('User ID is required')
    })

    it('should handle database errors', async () => {
      (Cart.findOne as jest.Mock).mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/cart', {
        headers: {
          'user-id': 'test-user-id',
        },
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Database error')
    })
  })

  describe('POST /api/cart', () => {
    it('should add product to cart', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct)
      (Cart.findOne as jest.Mock).mockResolvedValue(null)
      (Cart.create as jest.Mock).mockResolvedValue(mockCart)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id',
        },
        body: JSON.stringify({
          productId: 'test-product-id',
          quantity: 2,
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Product added to cart')
    })

    it('should update existing cart item', async () => {
      const existingCart = {
        ...mockCart,
        items: [
          {
            product_id: 'test-product-id',
            name: 'Test Saree',
            price: 7999,
            quantity: 1,
            image: '/images/products/test-saree-1.jpg',
          }
        ],
        total_amount: 7999,
      }

      (Product.findById as jest.Mock).mockResolvedValue(mockProduct)
      (Cart.findOne as jest.Mock).mockResolvedValue(existingCart)
      (Cart.findOneAndUpdate as jest.Mock).mockResolvedValue(mockCart)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id',
        },
        body: JSON.stringify({
          productId: 'test-product-id',
          quantity: 2,
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Cart updated')
    })

    it('should handle out of stock product', async () => {
      const outOfStockProduct = {
        ...mockProduct,
        inventory: {
          available_stock: 0,
        },
      }

      (Product.findById as jest.Mock).mockResolvedValue(outOfStockProduct)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id',
        },
        body: JSON.stringify({
          productId: 'test-product-id',
          quantity: 1,
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Product is out of stock')
    })

    it('should handle insufficient stock', async () => {
      const lowStockProduct = {
        ...mockProduct,
        inventory: {
          available_stock: 1,
        },
      }

      (Product.findById as jest.Mock).mockResolvedValue(lowStockProduct)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id',
        },
        body: JSON.stringify({
          productId: 'test-product-id',
          quantity: 5,
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Insufficient stock')
    })

    it('should handle missing product', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id',
        },
        body: JSON.stringify({
          productId: 'non-existent-id',
          quantity: 1,
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Product not found')
    })

    it('should validate request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id',
        },
        body: JSON.stringify({
          productId: '',
          quantity: 0,
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Product ID and quantity are required')
    })
  })

  describe('DELETE /api/cart', () => {
    it('should remove product from cart', async () => {
      (Cart.findOneAndUpdate as jest.Mock).mockResolvedValue({
        ...mockCart,
        items: [],
        total_amount: 0,
      })

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id',
        },
        body: JSON.stringify({
          productId: 'test-product-id',
        }),
      })
      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Product removed from cart')
    })

    it('should handle product not in cart', async () => {
      (Cart.findOneAndUpdate as jest.Mock).mockResolvedValue(mockCart)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id',
        },
        body: JSON.stringify({
          productId: 'non-existent-product',
        }),
      })
      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Product not found in cart')
    })

    it('should validate request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id',
        },
        body: JSON.stringify({
          productId: '',
        }),
      })
      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Product ID is required')
    })
  })
}) 