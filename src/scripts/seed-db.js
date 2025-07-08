// Simple MongoDB seeding script
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/saree-store';

const categories = [
  {
    name: 'Silk Saree',
    slug: 'silk-saree',
    description: 'Premium silk sarees including Banarasi, Kanjeevaram, and more',
    image: '/images/products/categories/silk-sarees.jpg',
    product_count: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Cotton Saree',
    slug: 'cotton-saree',
    description: 'Comfortable cotton sarees for daily wear',
    image: '/images/products/categories/cotton-sarees.jpg',
    product_count: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Designer Saree',
    slug: 'designer-saree',
    description: 'Modern designer sarees for contemporary women',
    image: '/images/products/categories/designer-sarees.jpg',
    product_count: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Party Wear',
    slug: 'party-wear',
    description: 'Elegant sarees perfect for parties and special occasions',
    image: '/images/products/categories/party-wear.jpg',
    product_count: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Wedding Saree',
    slug: 'wedding-saree',
    description: 'Exquisite bridal sarees for your special day',
    image: '/images/products/categories/wedding-sarees.jpg',
    product_count: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

const products = [
  {
    name: 'Banarasi Silk Saree - Royal Blue',
    description: 'Exquisite Banarasi silk saree with intricate zari work. Perfect for weddings and special occasions.',
    category: 'silk-saree',
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
    name: 'Kanjeevaram Silk Saree - Emerald Green',
    description: 'Traditional Kanjeevaram silk saree with temple border and pure gold zari work.',
    category: 'silk-saree',
    images: [
      {
        url: '/images/products/kanjeevaram-silk-1.jpg',
        view_type: 'front',
        alt_text: 'Kanjeevaram Silk Saree Front View'
      },
      {
        url: '/images/products/kanjeevaram-silk-2.jpg',
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
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Designer Georgette Saree - Rose Gold',
    description: 'Modern designer saree perfect for parties and celebrations with sequin work.',
    category: 'designer-saree',
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
    name: 'Cotton Handloom Saree - Natural White',
    description: 'Comfortable cotton handloom saree for daily wear with traditional border.',
    category: 'cotton-saree',
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
  },
  {
    name: 'Mysore Silk Saree - Deep Purple',
    description: 'Traditional Mysore silk saree with gold border and elegant design.',
    category: 'silk-saree',
    images: [
      {
        url: '/images/products/mysore-silk-1.jpg',
        view_type: 'front',
        alt_text: 'Mysore Silk Saree Front View'
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
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Chiffon Saree - Soft Pink',
    description: 'Elegant chiffon saree with floral prints, perfect for summer occasions.',
    category: 'party-wear',
    images: [
      {
        url: '/images/products/chiffon-saree-1.jpg',
        view_type: 'front',
        alt_text: 'Chiffon Saree Front View'
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
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    
    // Insert categories
    console.log('📂 Inserting categories...');
    const categoryResult = await db.collection('categories').insertMany(categories);
    console.log(`✅ Inserted ${categoryResult.insertedCount} categories`);
    
    // Insert products
    console.log('📦 Inserting products...');
    const productResult = await db.collection('products').insertMany(products);
    console.log(`✅ Inserted ${productResult.insertedCount} products`);
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();