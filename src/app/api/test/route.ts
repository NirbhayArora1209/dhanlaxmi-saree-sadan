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
    
    // Create some test categories
    const categories = [
      {
        name: 'Banarasi Silk',
        slug: 'banarasi-silk',
        description: 'Traditional Banarasi silk sarees with intricate zari work',
        image: '/images/categories/silk-sarees.jpg',
        product_count: 0,
        is_active: true
      },
      {
        name: 'Kanjeevaram Silk',
        slug: 'kanjeevaram-silk',
        description: 'Classic Kanjeevaram silk sarees with temple borders',
        image: '/images/categories/silk-sarees.jpg',
        product_count: 0,
        is_active: true
      },
      {
        name: 'Designer Sarees',
        slug: 'designer-sarees',
        description: 'Modern designer sarees for contemporary women',
        image: '/images/categories/designer-sarees.jpg',
        product_count: 0,
        is_active: true
      },
      {
        name: 'Wedding Collection',
        slug: 'wedding-sarees',
        description: 'Exquisite bridal sarees for your special day',
        image: '/images/categories/wedding-sarees.jpg',
        product_count: 0,
        is_active: true
      }
    ];
    
    // Insert categories
    const createdCategories = await CategoryModel.insertMany(categories);
    
    // Create some test products
    const products = [
      {
        name: 'Banarasi Silk Saree - Royal Blue',
        description: 'Exquisite Banarasi silk saree with intricate zari work and traditional motifs',
        category: 'banarasi-silk',
        images: [
          {
            url: '/images/products/banarasi-silk-1.jpg',
            view_type: 'front',
            alt_text: 'Banarasi Silk Saree Front View'
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
        description: 'Traditional Kanjeevaram silk saree with temple border and zari work',
        category: 'kanjeevaram-silk',
        images: [
          {
            url: '/images/products/kanjeevaram-silk-1.jpg',
            view_type: 'front',
            alt_text: 'Kanjeevaram Silk Saree Front View'
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
        description: 'Modern designer saree perfect for parties and celebrations',
        category: 'designer-sarees',
        images: [
          {
            url: '/images/products/designer-emerald-1.jpg',
            view_type: 'front',
            alt_text: 'Designer Georgette Saree Front View'
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
      }
    ];
    
    // Insert products
    const createdProducts = await ProductModel.insertMany(products);
    
    return NextResponse.json({
      success: true,
      message: 'Test data created successfully',
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