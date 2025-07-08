/**
 * Test script for MongoDB ObjectId serialization
 * 
 * This script tests our serializeDocument utility with MongoDB ObjectIds
 * to ensure proper serialization for client components
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the serialization function
const { serializeDocument } = require('../lib/api');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saree-store';

async function testSerialization() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Define a test schema with ObjectId references
    const TestSchema = new mongoose.Schema({
      name: String,
      parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
      nested: {
        id: mongoose.Schema.Types.ObjectId,
        value: String
      },
      array_of_ids: [mongoose.Schema.Types.ObjectId],
      array_of_objects: [{
        id: mongoose.Schema.Types.ObjectId,
        name: String
      }],
      created_at: Date
    });
    
    // Create a model from the schema
    const TestModel = mongoose.model('Test', TestSchema);
    
    // Create some test documents
    const parentDoc = new TestModel({
      name: 'Parent',
      created_at: new Date()
    });
    await parentDoc.save();
    
    const nestedId = new mongoose.Types.ObjectId();
    
    const childDoc = new TestModel({
      name: 'Child',
      parent_id: parentDoc._id,
      nested: {
        id: nestedId,
        value: 'Nested value'
      },
      array_of_ids: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
      ],
      array_of_objects: [
        { id: new mongoose.Types.ObjectId(), name: 'Item 1' },
        { id: new mongoose.Types.ObjectId(), name: 'Item 2' }
      ],
      created_at: new Date()
    });
    await childDoc.save();
    
    // Test serialization
    console.log('\n🔄 Testing serialization with lean objects...');
    const leanDoc = await TestModel.findById(childDoc._id).lean();
    console.log('Original lean document:', leanDoc);
    
    const serializedLean = serializeDocument(leanDoc);
    console.log('Serialized lean document:', serializedLean);
    
    // Test serialization with full Mongoose document
    console.log('\n🔄 Testing serialization with full Mongoose document...');
    const fullDoc = await TestModel.findById(childDoc._id);
    console.log('Original Mongoose document:', fullDoc);
    
    const serializedFull = serializeDocument(fullDoc);
    console.log('Serialized Mongoose document:', serializedFull);
    
    // Check serialization of arrays
    console.log('\n🔄 Testing serialization with array of documents...');
    const allDocs = await TestModel.find().lean();
    console.log('Original array of documents:', allDocs);
    
    const serializedAll = serializeDocument(allDocs);
    console.log('Serialized array of documents:', serializedAll);
    
    // Verify all ObjectIds are strings
    let allIdsAreStrings = true;
    function verifyStringIds(obj) {
      if (!obj || typeof obj !== 'object') return true;
      
      if (Array.isArray(obj)) {
        return obj.every(item => verifyStringIds(item));
      }
      
      for (const key in obj) {
        const value = obj[key];
        if (key === '_id' || key === 'id' || key === 'parent_id') {
          if (typeof value !== 'string' && value !== null) {
            console.error(`❌ Found non-string ID at ${key}:`, value);
            allIdsAreStrings = false;
          }
        } else if (value && typeof value === 'object') {
          verifyStringIds(value);
        }
      }
      
      return true;
    }
    
    verifyStringIds(serializedLean);
    verifyStringIds(serializedFull);
    verifyStringIds(serializedAll);
    
    if (allIdsAreStrings) {
      console.log('\n✅ All ObjectIds were successfully serialized to strings!');
    } else {
      console.log('\n❌ Some ObjectIds were not properly serialized to strings.');
    }
    
    // Clean up test documents
    await TestModel.deleteMany({});
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔄 MongoDB connection closed.');
  }
}

// Run the test
testSerialization(); 