import connectDB from '../lib/db';
import Product from '../models/Product';
import Category from '../models/Category';

const products = [
  {
    name: 'Banarasi Silk Saree - Royal Gold',
    description: 'Exquisite Banarasi silk saree with intricate zari work and traditional floral patterns. Perfect for weddings and special occasions. Handwoven by master craftsmen from Varanasi.',
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
      },
      {
        url: '/images/products/banarasi-silk-3.jpg',
        view_type: 'drape',
        alt_text: 'Banarasi Silk Saree - Draped View'
      },
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
  },
  {
    name: 'Cotton Handloom Saree - Traditional Weave',
    description: 'Comfortable cotton handloom saree with geometric patterns. Perfect for daily wear and casual occasions. Made from organic cotton.',
    category: 'cotton-sarees',
    images: [
      {
        url: '/images/products/cotton-handloom-1.jpg',
        view_type: 'front',
        alt_text: 'Cotton Handloom Saree - Front View'
      },
      {
        url: '/images/products/cotton-handloom-2.jpg',
        view_type: 'back',
        alt_text: 'Cotton Handloom Saree - Back View'
      },
      {
        url: '/images/products/cotton-handloom-3.jpg',
        view_type: 'flat',
        alt_text: 'Cotton Handloom Saree - Flat View'
      },
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
  },
  {
    name: 'Kanjeevaram Silk Saree - Temple Border',
    description: 'Luxurious Kanjeevaram silk saree with traditional temple border design. A timeless piece for special occasions and celebrations.',
    category: 'silk-sarees',
    images: [
      {
        url: '/images/products/kanjeevaram-silk-1.jpg',
        view_type: 'front',
        alt_text: 'Kanjeevaram Silk Saree - Front View'
      },
    ],
    pricing: {
      base_price: 18000,
      selling_price: 14999,
      discount_percentage: 17,
    },
    specifications: {
      fabric: 'Pure Kanjeevaram Silk',
      occasion: 'Wedding',
      length: 6.0,
      blouse_included: true,
      care_instructions: 'Dry clean only',
    },
    ratings: {
      average_rating: 4.9,
      total_reviews: 156,
    },
    inventory: {
      available_stock: 8,
      sku: 'KAN-SILK-003',
    },
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Mysore Silk Saree - Elegant Cream',
    description: 'Soft and elegant Mysore silk saree in cream color. Known for its lightweight feel and natural sheen.',
    category: 'silk-sarees',
    images: [
      {
        url: '/images/products/mysore-silk-1.jpg',
        view_type: 'front',
        alt_text: 'Mysore Silk Saree - Front View'
      },
    ],
    pricing: {
      base_price: 12000,
      selling_price: 9999,
      discount_percentage: 17,
    },
    specifications: {
      fabric: 'Pure Mysore Silk',
      occasion: 'Party',
      length: 6.0,
      blouse_included: false,
      care_instructions: 'Dry clean only',
    },
    ratings: {
      average_rating: 4.7,
      total_reviews: 94,
    },
    inventory: {
      available_stock: 15,
      sku: 'MYS-SILK-004',
    },
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Tussar Silk Saree - Natural Gold',
    description: 'Beautiful Tussar silk saree with natural golden color. Known for its rich texture and natural luster.',
    category: 'silk-sarees',
    images: [
      {
        url: '/images/products/tussar-silk-1.jpg',
        view_type: 'front',
        alt_text: 'Tussar Silk Saree - Front View'
      },
    ],
    pricing: {
      base_price: 8000,
      selling_price: 6499,
      discount_percentage: 19,
    },
    specifications: {
      fabric: 'Pure Tussar Silk',
      occasion: 'Party',
      length: 6.0,
      blouse_included: false,
      care_instructions: 'Dry clean only',
    },
    ratings: {
      average_rating: 4.5,
      total_reviews: 67,
    },
    inventory: {
      available_stock: 22,
      sku: 'TUS-SILK-005',
    },
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Chiffon Saree - Floral Print',
    description: 'Lightweight chiffon saree with beautiful floral prints. Perfect for parties and evening wear.',
    category: 'party-wear',
    images: [
      {
        url: '/images/products/chiffon-saree-1.jpg',
        view_type: 'front',
        alt_text: 'Chiffon Saree - Front View'
      },
      {
        url: '/images/products/chiffon-saree-2.jpg',
        view_type: 'back',
        alt_text: 'Chiffon Saree - Back View'
      },
      {
        url: '/images/products/chiffon-saree-3.jpg',
        view_type: 'mannequin',
        alt_text: 'Chiffon Saree - Mannequin View'
      },
    ],
    pricing: {
      base_price: 4500,
      selling_price: 3499,
      discount_percentage: 22,
    },
    specifications: {
      fabric: 'Chiffon',
      occasion: 'Party',
      length: 6.0,
      blouse_included: false,
      care_instructions: 'Hand wash in cold water',
    },
    ratings: {
      average_rating: 4.4,
      total_reviews: 78,
    },
    inventory: {
      available_stock: 35,
      sku: 'CHI-SAR-006',
    },
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Georgette Saree - Embroidered',
    description: 'Elegant georgette saree with intricate embroidery work. Perfect for special occasions.',
    category: 'party-wear',
    images: [
      {
        url: '/images/products/georgette-saree-1.jpg',
        view_type: 'front',
        alt_text: 'Georgette Saree - Front View'
      },
    ],
    pricing: {
      base_price: 6000,
      selling_price: 4799,
      discount_percentage: 20,
    },
    specifications: {
      fabric: 'Georgette',
      occasion: 'Party',
      length: 6.0,
      blouse_included: false,
      care_instructions: 'Dry clean only',
    },
    ratings: {
      average_rating: 4.6,
      total_reviews: 112,
    },
    inventory: {
      available_stock: 18,
      sku: 'GEO-SAR-007',
    },
    is_featured: false,
    is_active: true,
  },
  {
    name: 'Party Georgette Saree - Sequined',
    description: 'Glamorous party wear georgette saree with sequin work. Perfect for celebrations and special events.',
    category: 'party-wear',
    images: [
      {
        url: '/images/products/party-georgette-1.jpg',
        view_type: 'front',
        alt_text: 'Party Georgette Saree - Front View'
      },
    ],
    pricing: {
      base_price: 7500,
      selling_price: 5999,
      discount_percentage: 20,
    },
    specifications: {
      fabric: 'Georgette',
      occasion: 'Party',
      length: 6.0,
      blouse_included: false,
      care_instructions: 'Dry clean only',
    },
    ratings: {
      average_rating: 4.8,
      total_reviews: 145,
    },
    inventory: {
      available_stock: 12,
      sku: 'PAR-GEO-008',
    },
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Designer Emerald Saree - Contemporary',
    description: 'Contemporary designer saree in emerald green. Modern design with traditional elegance.',
    category: 'designer-sarees',
    images: [
      {
        url: '/images/products/designer-emerald-1.jpg',
        view_type: 'front',
        alt_text: 'Designer Emerald Saree - Front View'
      },
    ],
    pricing: {
      base_price: 15000,
      selling_price: 11999,
      discount_percentage: 20,
    },
    specifications: {
      fabric: 'Silk Blend',
      occasion: 'Wedding',
      length: 6.0,
      blouse_included: true,
      care_instructions: 'Dry clean only',
    },
    ratings: {
      average_rating: 4.9,
      total_reviews: 203,
    },
    inventory: {
      available_stock: 6,
      sku: 'DES-EME-009',
    },
    is_featured: true,
    is_active: true,
  },
  {
    name: 'Wedding Lehenga Set - Bridal Collection',
    description: 'Stunning bridal lehenga set perfect for wedding ceremonies. Intricate embroidery and premium fabric.',
    category: 'wedding-sarees',
    images: [
      {
        url: '/images/products/wedding-lehenga-1.jpg',
        view_type: 'front',
        alt_text: 'Wedding Lehenga Set - Front View'
      },
    ],
    pricing: {
      base_price: 35000,
      selling_price: 27999,
      discount_percentage: 20,
    },
    specifications: {
      fabric: 'Silk Blend',
      occasion: 'Wedding',
      length: 6.0,
      blouse_included: true,
      care_instructions: 'Dry clean only',
    },
    ratings: {
      average_rating: 4.9,
      total_reviews: 89,
    },
    inventory: {
      available_stock: 4,
      sku: 'WED-LEH-010',
    },
    is_featured: true,
    is_active: true,
  },
];

const categories = [
  {
    name: 'Silk Sarees',
    slug: 'silk-sarees',
    description: 'Luxurious silk sarees including Banarasi, Kanjeevaram, Mysore, and Tussar varieties',
    image: '/images/products/categories/silk-sarees.jpg',
    product_count: 5,
    is_active: true,
  },
  {
    name: 'Cotton Sarees',
    slug: 'cotton-sarees',
    description: 'Comfortable and breathable cotton sarees perfect for daily wear',
    image: '/images/products/categories/cotton-sarees.jpg',
    product_count: 1,
    is_active: true,
  },
  {
    name: 'Party Wear',
    slug: 'party-wear',
    description: 'Elegant party wear sarees in chiffon, georgette, and other lightweight fabrics',
    image: '/images/products/categories/party-wear.jpg',
    product_count: 3,
    is_active: true,
  },
  {
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    description: 'Contemporary designer sarees with modern aesthetics and traditional charm',
    image: '/images/products/categories/designer-sarees.jpg',
    product_count: 1,
    is_active: true,
  },
  {
    name: 'Wedding Collection',
    slug: 'wedding-sarees',
    description: 'Exclusive bridal sarees and lehenga sets for your most special moments',
    image: '/images/products/categories/wedding-sarees.jpg',
    product_count: 1,
    is_active: true,
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);
    
    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);
    
    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 