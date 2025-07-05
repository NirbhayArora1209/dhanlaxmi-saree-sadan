import { connectDB, disconnectDB } from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import User from '@/models/User';

const categories = [
  {
    name: 'Silk Sarees',
    slug: 'silk-sarees',
    description: 'Elegant silk sarees perfect for special occasions',
    image: '/images/products/catgories/silk-sarees.jpg',
    product_count: 0
  },
  {
    name: 'Cotton Sarees',
    slug: 'cotton-sarees',
    description: 'Comfortable cotton sarees for daily wear',
    image: '/images/products/catgories/cotton-sarees.jpg',
    product_count: 0
  },
  {
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    description: 'Exclusive designer sarees with unique patterns',
    image: '/images/products/catgories/designer-sarees.jpg',
    product_count: 0
  },
  {
    name: 'Wedding Sarees',
    slug: 'wedding-sarees',
    description: 'Bridal sarees for your special day',
    image: '/images/products/catgories/wedding-sarees.jpg',
    product_count: 0
  },
  {
    name: 'Party Wear',
    slug: 'party-wear',
    description: 'Stylish party wear sarees for celebrations',
    image: '/images/products/catgories/party-wear.jpg',
    product_count: 0
  }
];

const products = [
  {
    name: 'Banarasi Silk Saree',
    description: 'Traditional Banarasi silk saree with intricate zari work. Perfect for weddings and special occasions.',
    category: 'silk-sarees',
    images: ['/images/products/banarasi-silk-1.jpg'],
    pricing: {
      base_price: 25000,
      selling_price: 20000,
      discount_percentage: 20
    },
    specifications: {
      fabric: 'Banarasi Silk',
      occasion: 'Wedding',
      length: 6.5,
      blouse_included: true,
      care_instructions: 'Dry clean only'
    },
    ratings: {
      average_rating: 4.8,
      total_reviews: 45
    },
    inventory: {
      available_stock: 10,
      sku: 'BAN-SILK-001'
    },
    is_featured: true
  },
  {
    name: 'Cotton Handloom Saree',
    description: 'Handwoven cotton saree with traditional motifs. Comfortable for daily wear.',
    category: 'cotton-sarees',
    images: ['/images/products/cotton-handloom-1.jpg'],
    pricing: {
      base_price: 3000,
      selling_price: 2500,
      discount_percentage: 17
    },
    specifications: {
      fabric: 'Handloom Cotton',
      occasion: 'Daily Wear',
      length: 6.0,
      blouse_included: false,
      care_instructions: 'Hand wash in cold water'
    },
    ratings: {
      average_rating: 4.5,
      total_reviews: 32
    },
    inventory: {
      available_stock: 25,
      sku: 'COT-HAND-001'
    },
    is_featured: false
  },
  {
    name: 'Designer Emerald Saree',
    description: 'Contemporary designer saree with emerald green color and modern embellishments.',
    category: 'designer-sarees',
    images: ['/images/products/designer-emerald-1.jpg'],
    pricing: {
      base_price: 18000,
      selling_price: 15000,
      discount_percentage: 17
    },
    specifications: {
      fabric: 'Georgette',
      occasion: 'Party',
      length: 6.0,
      blouse_included: true,
      care_instructions: 'Dry clean only'
    },
    ratings: {
      average_rating: 4.7,
      total_reviews: 28
    },
    inventory: {
      available_stock: 8,
      sku: 'DES-EMER-001'
    },
    is_featured: true
  },
  {
    name: 'Kanjeevaram Silk Saree',
    description: 'Authentic Kanjeevaram silk saree with temple border and traditional motifs.',
    category: 'wedding-sarees',
    images: ['/images/products/kanjeevaram-silk-1.jpg'],
    pricing: {
      base_price: 35000,
      selling_price: 28000,
      discount_percentage: 20
    },
    specifications: {
      fabric: 'Kanjeevaram Silk',
      occasion: 'Wedding',
      length: 6.5,
      blouse_included: true,
      care_instructions: 'Dry clean only'
    },
    ratings: {
      average_rating: 4.9,
      total_reviews: 56
    },
    inventory: {
      available_stock: 5,
      sku: 'KAN-SILK-001'
    },
    is_featured: true
  },
  {
    name: 'Party Georgette Saree',
    description: 'Elegant georgette saree perfect for parties and celebrations.',
    category: 'party-wear',
    images: ['/images/products/party-georgette-1.jpg'],
    pricing: {
      base_price: 8000,
      selling_price: 6000,
      discount_percentage: 25
    },
    specifications: {
      fabric: 'Georgette',
      occasion: 'Party',
      length: 6.0,
      blouse_included: false,
      care_instructions: 'Dry clean only'
    },
    ratings: {
      average_rating: 4.6,
      total_reviews: 38
    },
    inventory: {
      available_stock: 15,
      sku: 'PAR-GEO-001'
    },
    is_featured: false
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    
    // Seed products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);
    
    // Create admin user
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@dhanlaxmisareesadan.com' },
      {
        name: 'Admin User',
        email: 'admin@dhanlaxmisareesadan.com',
        password: 'admin123',
        role: 'admin',
        is_active: true
      },
      { upsert: true, new: true }
    );
    console.log('✅ Created admin user');
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await disconnectDB();
  }
}

// Run the seed function
seedDatabase(); 