import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ProductModel from '@/models/Product';
import type { IProduct } from '@/models/Product';
import CategoryModel from '@/models/Category';
import { 
  successResponse, 
  errorResponse, 
  handleDatabaseError, 
  parseQueryParams,
  getPaginationInfo 
} from '@/lib/api';

// Fallback data when database is not available
const fallbackProducts = [
  {
    _id: '1',
    name: 'Banarasi Silk Saree - Royal Blue',
    description: 'Exquisite Banarasi silk saree with intricate zari work',
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
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '2',
    name: 'Kanjeevaram Silk Saree - Emerald Green',
    description: 'Traditional Kanjeevaram silk saree with temple border',
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
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '3',
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
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: '4',
    name: 'Cotton Handloom Saree - Natural White',
    description: 'Comfortable cotton handloom saree for daily wear',
    category: 'cotton-sarees',
    images: [
      {
        url: '/images/products/cotton-handloom-1.jpg',
        view_type: 'front',
        alt_text: 'Cotton Handloom Saree Front View'
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
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Products API: Request received');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';
    
    console.log('🔄 Products API: Query params:', { category, featured, search, limit, page, sort, order });
    
    let products = [];
    let total = 0;
    
    try {
      console.log('🔄 Products API: Attempting database connection...');
      await connectDB();
      
      // Build query
      const query: any = { is_active: true };
      
      if (category) {
        query.category = category;
      }
      
      if (featured === 'true') {
        query.is_featured = true;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { 'specifications.fabric': { $regex: search, $options: 'i' } },
          { 'specifications.occasion': { $regex: search, $options: 'i' } }
        ];
      }
      
      // Build sort object
      const sortObj: any = {};
      sortObj[sort] = order === 'desc' ? -1 : 1;
      
      // Calculate skip
      const skip = (page - 1) * limit;
      
      console.log('🔄 Products API: Executing database query...');
      
      // Execute query
      products = await ProductModel.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Get total count for pagination
      total = await ProductModel.countDocuments(query);
      
      console.log('✅ Products API: Database query successful, found', products.length, 'products');
      
    } catch (dbError) {
      console.warn('⚠️ Products API: Database connection failed, using fallback data:', dbError);
      
      // Use fallback data when database is not available
      let filteredProducts = fallbackProducts;
      
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      if (featured === 'true') {
        filteredProducts = filteredProducts.filter(p => p.is_featured);
      }
      
      if (search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()) ||
          p.specifications.fabric.toLowerCase().includes(search.toLowerCase()) ||
          p.specifications.occasion.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      total = filteredProducts.length;
      const skip = (page - 1) * limit;
      products = filteredProducts.slice(skip, skip + limit);
      
      console.log('✅ Products API: Using fallback data, found', products.length, 'products');
    }
    
    const response = {
      success: true,
      data: {
        data: products, // Nested data array as expected by PaginatedResponse
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    
    console.log('✅ Products API: Returning response with', products.length, 'products');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Products API: Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.description || !body.category) {
      return errorResponse('Missing required fields', 400, 'Name, description, and category are required');
    }
    
    // Validate category exists if provided as slug
    if (typeof body.category === 'string') {
      const categoryDoc = await CategoryModel.findOne({ slug: body.category, is_active: true });
      if (!categoryDoc) {
        return errorResponse('Invalid category', 400, 'The specified category does not exist');
      }
      body.category = categoryDoc._id;
    }
    
    // Create product
    const product = new ProductModel(body);
    await product.save();
    
    // Populate category data in response
    await product.populate('category', 'name slug');
    
    return successResponse(product, { message: 'Product created successfully' });
    
  } catch (error) {
    return handleDatabaseError(error);
  }
} 