import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { IProduct } from '@/models/Product';
import { ICategory } from '@/models/Category';
import ProductModel from '@/models/Product';
import CategoryModel from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await connectDB();
    
    // Check if we have any products
    const productCount = await ProductModel.countDocuments();
    const categoryCount = await CategoryModel.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Server is working!',
      database: {
        connected: true,
        products: productCount,
        categories: categoryCount
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      database: {
        connected: false
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Clear existing data first
    await ProductModel.deleteMany({});
    await CategoryModel.deleteMany({});
    
    // Create categories with correct image paths
    const categories = [
      {
        name: 'Silk Sarees',
        slug: 'silk-sarees',
        description: 'Premium silk sarees including Banarasi, Kanjeevaram, and more',
        image: '/images/products/categories/silk-sarees.jpg',
        product_count: 0,
        is_active: true
      },
      {
        name: 'Cotton Sarees',
        slug: 'cotton-sarees',
        description: 'Comfortable cotton sarees for daily wear',
        image: '/images/products/categories/cotton-sarees.jpg',
        product_count: 0,
        is_active: true
      },
      {
        name: 'Designer Sarees',
        slug: 'designer-sarees',
        description: 'Modern designer sarees for contemporary women',
        image: '/images/products/categories/designer-sarees.jpg',
        product_count: 0,
        is_active: true
      },
      {
        name: 'Party Wear',
        slug: 'party-wear',
        description: 'Elegant sarees perfect for parties and special occasions',
        image: '/images/products/categories/party-wear.jpg',
        product_count: 0,
        is_active: true
      },
      {
        name: 'Wedding Sarees',
        slug: 'wedding-sarees',
        description: 'Exquisite bridal sarees for your special day',
        image: '/images/products/categories/wedding-sarees.jpg',
        product_count: 0,
        is_active: true
      }
    ];
    
    // Insert categories
    const createdCategories = await CategoryModel.insertMany(categories);
    
    // Create all 10 products based on available images
    const products = [
      {
        name: 'Banarasi Silk Saree - Royal Blue',
        description: 'Exquisite Banarasi silk saree with intricate zari work and traditional motifs. Perfect for weddings and special occasions.',
        category: 'silk-sarees',
        images: [
          {
            url: '/images/products/banarasi-silk-1.jpg',
            view_type: 'front',
            alt_text: 'Banarasi Silk Saree Front View'
          },
          {
            url: '/images/products/banarasi-silk-2.jpg',
            view_type: 'drape',
            alt_text: 'Banarasi Silk Saree Draped View'
          },
          {
            url: '/images/products/banarasi-silk-3.jpg',
            view_type: 'detail',
            alt_text: 'Banarasi Silk Saree Detail View'
          }
        ],
        pricing: {
          base_price: 15000,
          selling_price: 12000,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Pure Silk',
          occasion: 'Wedding',
          length: 5.5,
          blouse_included: true,
          care_instructions: 'Dry clean only'
        },
        ratings: {
          average_rating: 4.5,
          total_reviews: 128
        },
        inventory: {
          available_stock: 15,
          sku: 'BAN-001'
        },
        is_featured: true,
        is_active: true
      },
      {
        name: 'Kanjeevaram Silk Saree - Emerald Green',
        description: 'Traditional Kanjeevaram silk saree with temple border and pure gold zari work. A timeless classic.',
        category: 'silk-sarees',
        images: [
          {
            url: '/images/products/kanjeevaram-silk-1.jpg',
            view_type: 'front',
            alt_text: 'Kanjeevaram Silk Saree Front View'
          },
          {
            url: '/images/products/kanjeevaram-silk-2.jpg',
            view_type: 'drape',
            alt_text: 'Kanjeevaram Silk Saree Draped View'
          },
          {
            url: '/images/products/kanjeevaram-silk-3.jpg',
            view_type: 'detail',
            alt_text: 'Kanjeevaram Silk Saree Detail View'
          }
        ],
        pricing: {
          base_price: 18000,
          selling_price: 14400,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Pure Silk',
          occasion: 'Wedding',
          length: 6.0,
          blouse_included: true,
          care_instructions: 'Dry clean only'
        },
        ratings: {
          average_rating: 4.8,
          total_reviews: 95
        },
        inventory: {
          available_stock: 12,
          sku: 'KAN-001'
        },
        is_featured: true,
        is_active: true
      },
      {
        name: 'Designer Georgette Saree - Rose Gold',
        description: 'Modern designer saree perfect for parties and celebrations with sequin work and contemporary styling.',
        category: 'designer-sarees',
        images: [
          {
            url: '/images/products/designer-emerald-1.jpg',
            view_type: 'front',
            alt_text: 'Designer Georgette Saree Front View'
          },
          {
            url: '/images/products/designer-emerald-2.jpg',
            view_type: 'back',
            alt_text: 'Designer Georgette Saree Back View'
          },
          {
            url: '/images/products/designer-emerald-3.jpg',
            view_type: 'detail',
            alt_text: 'Designer Georgette Saree Detail View'
          }
        ],
        pricing: {
          base_price: 8000,
          selling_price: 6400,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Georgette',
          occasion: 'Party',
          length: 5.5,
          blouse_included: false,
          care_instructions: 'Hand wash cold'
        },
        ratings: {
          average_rating: 4.3,
          total_reviews: 67
        },
        inventory: {
          available_stock: 25,
          sku: 'DES-001'
        },
        is_featured: true,
        is_active: true
      },
      {
        name: 'Cotton Handloom Saree - Natural White',
        description: 'Comfortable cotton handloom saree for daily wear with traditional border. Perfect for everyday elegance.',
        category: 'cotton-sarees',
        images: [
          {
            url: '/images/products/cotton-handloom-1.jpg',
            view_type: 'front',
            alt_text: 'Cotton Handloom Saree Front View'
          },
          {
            url: '/images/products/cotton-handloom-2.jpg',
            view_type: 'side',
            alt_text: 'Cotton Handloom Saree Side View'
          },
          {
            url: '/images/products/cotton-handloom-3.jpg',
            view_type: 'detail',
            alt_text: 'Cotton Handloom Saree Detail View'
          }
        ],
        pricing: {
          base_price: 3000,
          selling_price: 2400,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Cotton',
          occasion: 'Daily',
          length: 5.5,
          blouse_included: false,
          care_instructions: 'Machine wash cold'
        },
        ratings: {
          average_rating: 4.6,
          total_reviews: 203
        },
        inventory: {
          available_stock: 50,
          sku: 'COT-001'
        },
        is_featured: true,
        is_active: true
      },
      {
        name: 'Mysore Silk Saree - Deep Purple',
        description: 'Traditional Mysore silk saree with gold border and elegant design. A royal classic from Karnataka.',
        category: 'silk-sarees',
        images: [
          {
            url: '/images/products/mysore-silk-1.jpg',
            view_type: 'front',
            alt_text: 'Mysore Silk Saree Front View'
          },
          {
            url: '/images/products/mysore-silk-2.jpg',
            view_type: 'drape',
            alt_text: 'Mysore Silk Saree Draped View'
          },
          {
            url: '/images/products/mysore-silk-3.jpg',
            view_type: 'detail',
            alt_text: 'Mysore Silk Saree Detail View'
          }
        ],
        pricing: {
          base_price: 12000,
          selling_price: 9600,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Pure Silk',
          occasion: 'Festival',
          length: 5.5,
          blouse_included: true,
          care_instructions: 'Dry clean only'
        },
        ratings: {
          average_rating: 4.4,
          total_reviews: 89
        },
        inventory: {
          available_stock: 18,
          sku: 'MYS-001'
        },
        is_featured: false,
        is_active: true
      },
      {
        name: 'Chiffon Saree - Soft Pink',
        description: 'Elegant chiffon saree with floral prints, perfect for summer occasions and daytime events.',
        category: 'party-wear',
        images: [
          {
            url: '/images/products/chiffon-saree-1.jpg',
            view_type: 'front',
            alt_text: 'Chiffon Saree Front View'
          },
          {
            url: '/images/products/chiffon-saree-2.jpg',
            view_type: 'drape',
            alt_text: 'Chiffon Saree Draped View'
          },
          {
            url: '/images/products/chiffon-saree-3.jpg',
            view_type: 'detail',
            alt_text: 'Chiffon Saree Detail View'
          }
        ],
        pricing: {
          base_price: 5000,
          selling_price: 4000,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Chiffon',
          occasion: 'Party',
          length: 5.5,
          blouse_included: true,
          care_instructions: 'Hand wash gently'
        },
        ratings: {
          average_rating: 4.2,
          total_reviews: 54
        },
        inventory: {
          available_stock: 30,
          sku: 'CHF-001'
        },
        is_featured: false,
        is_active: true
      },
      {
        name: 'Georgette Saree - Midnight Blue',
        description: 'Sophisticated georgette saree with embroidered border, perfect for evening parties and celebrations.',
        category: 'party-wear',
        images: [
          {
            url: '/images/products/georgette-saree-1.jpg',
            view_type: 'front',
            alt_text: 'Georgette Saree Front View'
          },
          {
            url: '/images/products/georgette-saree-2.jpg',
            view_type: 'back',
            alt_text: 'Georgette Saree Back View'
          },
          {
            url: '/images/products/georgette-saree-3.jpg',
            view_type: 'detail',
            alt_text: 'Georgette Saree Detail View'
          }
        ],
        pricing: {
          base_price: 6000,
          selling_price: 4800,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Georgette',
          occasion: 'Party',
          length: 5.5,
          blouse_included: true,
          care_instructions: 'Dry clean recommended'
        },
        ratings: {
          average_rating: 4.1,
          total_reviews: 43
        },
        inventory: {
          available_stock: 22,
          sku: 'GEO-001'
        },
        is_featured: false,
        is_active: true
      },
      {
        name: 'Party Georgette Saree - Wine Red',
        description: 'Glamorous party wear georgette saree with sequin work and contemporary cut, perfect for special occasions.',
        category: 'party-wear',
        images: [
          {
            url: '/images/products/party-georgette-1.jpg',
            view_type: 'front',
            alt_text: 'Party Georgette Saree Front View'
          },
          {
            url: '/images/products/party-georgette-2.jpg',
            view_type: 'back',
            alt_text: 'Party Georgette Saree Back View'
          },
          {
            url: '/images/products/party-georgette-3.jpg',
            view_type: 'detail',
            alt_text: 'Party Georgette Saree Detail View'
          }
        ],
        pricing: {
          base_price: 7000,
          selling_price: 5600,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Georgette',
          occasion: 'Party',
          length: 5.5,
          blouse_included: true,
          care_instructions: 'Dry clean only'
        },
        ratings: {
          average_rating: 4.4,
          total_reviews: 76
        },
        inventory: {
          available_stock: 20,
          sku: 'PTY-001'
        },
        is_featured: false,
        is_active: true
      },
      {
        name: 'Tussar Silk Saree - Golden Yellow',
        description: 'Beautiful tussar silk saree with natural texture and traditional motifs, perfect for cultural events.',
        category: 'silk-sarees',
        images: [
          {
            url: '/images/products/tussar-silk-1.jpg',
            view_type: 'front',
            alt_text: 'Tussar Silk Saree Front View'
          },
          {
            url: '/images/products/tussar-silk-2.jpg',
            view_type: 'drape',
            alt_text: 'Tussar Silk Saree Draped View'
          },
          {
            url: '/images/products/tussar-silk-3.jpg',
            view_type: 'detail',
            alt_text: 'Tussar Silk Saree Detail View'
          }
        ],
        pricing: {
          base_price: 10000,
          selling_price: 8000,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Tussar Silk',
          occasion: 'Festival',
          length: 5.5,
          blouse_included: true,
          care_instructions: 'Dry clean only'
        },
        ratings: {
          average_rating: 4.6,
          total_reviews: 112
        },
        inventory: {
          available_stock: 16,
          sku: 'TUS-001'
        },
        is_featured: false,
        is_active: true
      },
      {
        name: 'Wedding Lehenga Saree - Bridal Red',
        description: 'Stunning bridal lehenga saree with heavy embroidery and stone work, perfect for your special day.',
        category: 'wedding-sarees',
        images: [
          {
            url: '/images/products/wedding-lehenga-1.jpg',
            view_type: 'front',
            alt_text: 'Wedding Lehenga Saree Front View'
          },
          {
            url: '/images/products/wedding-lehenga-2.jpg',
            view_type: 'back',
            alt_text: 'Wedding Lehenga Saree Back View'
          },
          {
            url: '/images/products/wedding-lehenga-3.jpg',
            view_type: 'detail',
            alt_text: 'Wedding Lehenga Saree Detail View'
          }
        ],
        pricing: {
          base_price: 25000,
          selling_price: 20000,
          discount_percentage: 20
        },
        specifications: {
          fabric: 'Silk with Embroidery',
          occasion: 'Wedding',
          length: 6.0,
          blouse_included: true,
          care_instructions: 'Dry clean only'
        },
        ratings: {
          average_rating: 4.9,
          total_reviews: 87
        },
        inventory: {
          available_stock: 8,
          sku: 'WED-001'
        },
        is_featured: true,
        is_active: true
      }
    ];
    
    // Insert products
    const createdProducts = await ProductModel.insertMany(products);
    
    return NextResponse.json({
      success: true,
      message: 'Complete product catalog created successfully',
      data: {
        categories: createdCategories.length,
        products: createdProducts.length
      }
    });
    
  } catch (error) {
    console.error('Seed data error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create test data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}