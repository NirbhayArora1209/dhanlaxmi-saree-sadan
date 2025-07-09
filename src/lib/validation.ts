import { z } from 'zod';

// User validation schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password must be less than 128 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const userEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name must be less than 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    view_type: z.enum(['front', 'back', 'side', 'drape', 'flat', 'mannequin', 'close-up', 'detail']),
    alt_text: z.string().optional(),
  })).min(1, 'At least one image is required'),
  pricing: z.object({
    base_price: z.number().positive('Base price must be positive'),
    selling_price: z.number().positive('Selling price must be positive'),
    discount_percentage: z.number().min(0).max(100, 'Discount percentage must be between 0 and 100'),
  }),
  specifications: z.object({
    fabric: z.string().min(1, 'Fabric is required'),
    occasion: z.string().min(1, 'Occasion is required'),
    length: z.number().positive('Length must be positive'),
    blouse_included: z.boolean(),
    care_instructions: z.string().min(1, 'Care instructions are required'),
  }),
  inventory: z.object({
    available_stock: z.number().min(0, 'Stock cannot be negative'),
    sku: z.string().min(1, 'SKU is required'),
  }),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Quantity cannot exceed 10'),
});

export const updateCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Quantity cannot exceed 10'),
});

// Wishlist validation schemas
export const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

// Category validation schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  image: z.string().url('Invalid image URL'),
  is_active: z.boolean().default(true),
});

// Query parameter validation
export const productQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  limit: z.string().nullable().optional().transform(val => val ? Number(val) : undefined).refine(val => val === undefined || (val > 0 && val <= 100), 'Limit must be between 1 and 100'),
  page: z.string().nullable().optional().transform(val => val ? Number(val) : undefined).refine(val => val === undefined || val > 0, 'Page must be positive'),
  sort: z.enum(['name', 'price', 'rating', 'created_at']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

// Order validation schemas
export const orderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    price: z.number().positive('Price must be positive'),
  })).min(1, 'At least one item is required'),
  shipping_address: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
    country: z.string().min(2, 'Country must be at least 2 characters'),
  }),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

// Review validation schema
export const reviewSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment must be less than 1000 characters'),
});

// Validation helper function
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`) 
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

// Validation middleware for API routes
export function withValidation<T>(schema: z.ZodSchema<T>) {
  return async (data: unknown): Promise<T> => {
    const validation = validateSchema(schema, data);
    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    return validation.data;
  };
}