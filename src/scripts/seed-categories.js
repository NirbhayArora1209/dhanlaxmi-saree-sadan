/**
 * Category Seeder Script
 * This script populates the database with hierarchical categories for the saree store
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saree-store';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Define Category Schema
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  product_count: Number,
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  level: Number,
  is_featured: Boolean,
  is_active: Boolean,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Create Category Model
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Category data
const categoryData = [
  // Root categories (level 1)
  {
    name: 'Silk Sarees',
    slug: 'silk-sarees',
    description: 'Premium silk sarees from different parts of India, known for their luxurious feel and intricate designs',
    image: '/images/products/categories/silk-sarees.jpg',
    product_count: 0,
    level: 1,
    is_featured: true,
    is_active: true
  },
  {
    name: 'Cotton Sarees',
    slug: 'cotton-sarees',
    description: 'Light, breathable cotton sarees perfect for daily wear and casual occasions',
    image: '/images/products/categories/cotton-sarees.jpg',
    product_count: 0,
    level: 1,
    is_featured: true,
    is_active: true
  },
  {
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    description: 'Contemporary designer sarees with modern aesthetics and unique designs',
    image: '/images/products/categories/designer-sarees.jpg',
    product_count: 0,
    level: 1,
    is_featured: true,
    is_active: true
  },
  {
    name: 'Wedding Collection',
    slug: 'wedding-sarees',
    description: 'Exquisite sarees for wedding and bridal occasions with rich embroidery and embellishments',
    image: '/images/products/categories/wedding-sarees.jpg',
    product_count: 0,
    level: 1,
    is_featured: true,
    is_active: true
  },
  {
    name: 'Party Wear',
    slug: 'party-wear',
    description: 'Elegant sarees suitable for parties, events, and festive occasions',
    image: '/images/products/categories/party-wear.jpg',
    product_count: 0,
    level: 1,
    is_featured: false,
    is_active: true
  }
];

// Subcategory data - will be populated with parent references after inserting main categories
const subcategoryData = [
  // Silk sarees subcategories (level 2)
  {
    name: 'Banarasi Silk',
    slug: 'banarasi-silk',
    description: 'Traditional sarees from Varanasi known for their gold and silver brocade or zari, silk, and opulent embroidery',
    image: '/images/products/categories/banarasi-silk.jpg',
    product_count: 0,
    level: 2,
    is_featured: true,
    is_active: true,
    parentSlug: 'silk-sarees'
  },
  {
    name: 'Kanjeevaram Silk',
    slug: 'kanjeevaram-silk',
    description: 'Rich silk sarees from Kanchipuram, Tamil Nadu, known for their vibrant colors and interwoven gold thread designs',
    image: '/images/products/categories/kanjeevaram-silk.jpg',
    product_count: 0,
    level: 2,
    is_featured: true,
    is_active: true,
    parentSlug: 'silk-sarees'
  },
  {
    name: 'Tussar Silk',
    slug: 'tussar-silk',
    description: 'Natural, golden-hued silk sarees with a coarse texture, known for their rustic charm',
    image: '/images/products/categories/silk-sarees.jpg',
    product_count: 0,
    level: 2,
    is_featured: false,
    is_active: true,
    parentSlug: 'silk-sarees'
  },
  {
    name: 'Mysore Silk',
    slug: 'mysore-silk',
    description: 'Soft, lightweight silk sarees from Mysore with a distinctive luster and pure gold zari',
    image: '/images/products/categories/silk-sarees.jpg',
    product_count: 0,
    level: 2,
    is_featured: false,
    is_active: true,
    parentSlug: 'silk-sarees'
  },
  
  // Cotton sarees subcategories (level 2)
  {
    name: 'Handloom Cotton',
    slug: 'handloom-cotton',
    description: 'Handwoven cotton sarees known for their sustainable production and traditional craftsmanship',
    image: '/images/products/categories/cotton-sarees.jpg',
    product_count: 0,
    level: 2,
    is_featured: false,
    is_active: true,
    parentSlug: 'cotton-sarees'
  },
  {
    name: 'Printed Cotton',
    slug: 'printed-cotton',
    description: 'Cotton sarees with vibrant printed designs and patterns',
    image: '/images/products/categories/cotton-sarees.jpg',
    product_count: 0,
    level: 2,
    is_featured: false,
    is_active: true,
    parentSlug: 'cotton-sarees'
  },
  
  // Designer sarees subcategories (level 2)
  {
    name: 'Contemporary',
    slug: 'contemporary-designer',
    description: 'Modern designer sarees with innovative designs and contemporary patterns',
    image: '/images/products/categories/designer-sarees.jpg',
    product_count: 0,
    level: 2,
    is_featured: false,
    is_active: true,
    parentSlug: 'designer-sarees'
  },
  {
    name: 'Embellished',
    slug: 'embellished-designer',
    description: 'Designer sarees with intricate embellishments including sequins, beads, and embroidery',
    image: '/images/products/categories/designer-sarees.jpg',
    product_count: 0,
    level: 2,
    is_featured: false,
    is_active: true,
    parentSlug: 'designer-sarees'
  }
];

// Seed database function
async function seedCategories() {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Deleted existing categories');

    // Insert root categories
    const rootCategories = await Category.insertMany(categoryData);
    console.log(`Inserted ${rootCategories.length} root categories`);

    // Create a map for easy lookup of parent categories by slug
    const parentMap = {};
    rootCategories.forEach(category => {
      parentMap[category.slug] = category._id;
    });

    // Set parent_id for subcategories
    const subcategoriesWithParents = subcategoryData.map(subcategory => {
      const parentId = parentMap[subcategory.parentSlug];
      const { parentSlug, ...subcategoryWithoutParentSlug } = subcategory;
      return {
        ...subcategoryWithoutParentSlug,
        parent_id: parentId
      };
    });

    // Insert subcategories
    const insertedSubcategories = await Category.insertMany(subcategoriesWithParents);
    console.log(`Inserted ${insertedSubcategories.length} subcategories`);

    // Update product counts
    const categories = await Category.find({});
    for (const category of categories) {
      if (category.level === 1) {
        // For root categories, count includes all subcategories
        const subcategories = await Category.find({ parent_id: category._id });
        category.product_count = 10 * (subcategories.length + 1); // Dummy count for now
      } else {
        // For subcategories, individual counts
        category.product_count = Math.floor(Math.random() * 30) + 5; // Random count between 5-35
      }
      await category.save();
    }

    console.log('✅ Category seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Run the seeder
seedCategories(); 