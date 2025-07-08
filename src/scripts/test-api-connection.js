/**
 * API Connection Test Script
 * This script tests the connection to the API and MongoDB serialization
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saree-store';

// Define a simple serialization function
function serializeDocument(doc) {
  if (doc === null || doc === undefined) {
    return doc;
  }
  
  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(item => serializeDocument(item));
  }
  
  // Handle plain objects (including MongoDB documents)
  if (doc && typeof doc === 'object') {
    const result = {};
    
    for (const [key, value] of Object.entries(doc)) {
      // Convert ObjectId to string
      if (key === '_id' && value && typeof value === 'object' && value.toString) {
        result[key] = value.toString();
        continue;
      }
      
      // Handle ObjectId references in other fields
      if (value && typeof value === 'object' && value._bsontype === 'ObjectID') {
        result[key] = value.toString();
        continue;
      }
      
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        result[key] = value.toISOString();
        continue;
      }
      
      // Recursively process nested objects
      if (value && typeof value === 'object') {
        result[key] = serializeDocument(value);
        continue;
      }
      
      result[key] = value;
    }
    
    return result;
  }
  
  return doc;
}

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define schemas for testing
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

    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

    // Test retrieving categories
    console.log('🔄 Testing category retrieval...');
    const categories = await Category.find().lean();
    console.log(`✅ Found ${categories.length} categories`);

    // Test serialization
    console.log('🔄 Serializing categories...');
    const serializedCategories = serializeDocument(categories);
    
    // Check if serialization worked properly
    let allSerializedCorrectly = true;
    for (const category of serializedCategories) {
      if (typeof category._id !== 'string') {
        console.error('❌ Found non-string _id:', category._id);
        allSerializedCorrectly = false;
      }
      
      if (category.parent_id && typeof category.parent_id !== 'string' && category.parent_id !== null) {
        console.error('❌ Found non-string parent_id:', category.parent_id);
        allSerializedCorrectly = false;
      }
    }
    
    if (allSerializedCorrectly) {
      console.log('✅ All categories serialized correctly!');
      console.log('Sample category:', JSON.stringify(serializedCategories[0], null, 2));
    } else {
      console.log('❌ Some categories failed to serialize properly');
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔄 MongoDB connection closed');
  }
}

// Run the test
testConnection(); 