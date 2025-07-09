const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://admin:science14@cluster0.anmmao1.mongodb.net/dhanlaxmi-saree-sadan?retryWrites=true&w=majority&appName=Cluster0';

async function addSaleData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dhanlaxmi-saree-sadan');
    const products = db.collection('products');
    
    // Get all products
    const allProducts = await products.find({}).toArray();
    console.log('Found', allProducts.length, 'products');
    
    if (allProducts.length === 0) {
      console.log('No products found. Adding sample sale products...');
      
      // Add sample sale products
      const saleProducts = [
        {
          name: 'Banarasi Silk Saree - Red Gold',
          description: 'Elegant Banarasi silk saree with traditional gold zari work. Perfect for weddings and special occasions.',
          category: 'Silk Sarees',
          images: [
            {
              url: '/images/categories/silk-sarees.jpg',
              view_type: 'front',
              alt_text: 'Banarasi Silk Saree Front View'
            },
            {
              url: '/images/categories/silk-sarees.jpg',
              view_type: 'drape',
              alt_text: 'Banarasi Silk Saree Draped'
            }
          ],
          pricing: {
            base_price: 8500,
            selling_price: 6800,
            discount_percentage: 20
          },
          specifications: {
            fabric: 'Pure Banarasi Silk',
            occasion: 'Wedding, Festival',
            length: 6.5,
            blouse_included: true,
            care_instructions: 'Dry clean only'
          },
          inventory: {
            available_stock: 5,
            sku: 'BSS-RG-001'
          },
          is_featured: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Designer Georgette Saree - Blue',
          description: 'Contemporary designer saree in georgette fabric with beautiful embellishments.',
          category: 'Designer Sarees',
          images: [
            {
              url: '/images/categories/designer-sarees.jpg',
              view_type: 'front',
              alt_text: 'Designer Georgette Saree Front View'
            }
          ],
          pricing: {
            base_price: 4500,
            selling_price: 3150,
            discount_percentage: 30
          },
          specifications: {
            fabric: 'Georgette',
            occasion: 'Party, Casual',
            length: 6.5,
            blouse_included: true,
            care_instructions: 'Hand wash or dry clean'
          },
          inventory: {
            available_stock: 8,
            sku: 'DGS-BL-002'
          },
          is_featured: false,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Cotton Handloom Saree - Green',
          description: 'Eco-friendly handloom cotton saree with traditional patterns.',
          category: 'Cotton Sarees',
          images: [
            {
              url: '/images/categories/cotton-sarees.jpg',
              view_type: 'front',
              alt_text: 'Cotton Handloom Saree Front View'
            }
          ],
          pricing: {
            base_price: 2500,
            selling_price: 1875,
            discount_percentage: 25
          },
          specifications: {
            fabric: 'Pure Cotton',
            occasion: 'Daily wear, Office',
            length: 6.5,
            blouse_included: false,
            care_instructions: 'Machine wash gentle'
          },
          inventory: {
            available_stock: 12,
            sku: 'CHS-GR-003'
          },
          is_featured: false,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Kanjeevaram Silk Saree - Purple',
          description: 'Traditional Kanjeevaram silk saree with rich colors and gold border.',
          category: 'Silk Sarees',
          images: [
            {
              url: '/images/categories/silk-sarees.jpg',
              view_type: 'front',
              alt_text: 'Kanjeevaram Silk Saree Front View'
            }
          ],
          pricing: {
            base_price: 12000,
            selling_price: 9600,
            discount_percentage: 20
          },
          specifications: {
            fabric: 'Kanjeevaram Silk',
            occasion: 'Wedding, Festival',
            length: 6.5,
            blouse_included: true,
            care_instructions: 'Dry clean only'
          },
          inventory: {
            available_stock: 3,
            sku: 'KSS-PR-004'
          },
          is_featured: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Chiffon Party Wear Saree - Pink',
          description: 'Glamorous chiffon saree perfect for evening parties and celebrations.',
          category: 'Party Wear',
          images: [
            {
              url: '/images/categories/party-wear.jpg',
              view_type: 'front',
              alt_text: 'Chiffon Party Wear Saree Front View'
            }
          ],
          pricing: {
            base_price: 3500,
            selling_price: 2450,
            discount_percentage: 30
          },
          specifications: {
            fabric: 'Chiffon',
            occasion: 'Party, Evening',
            length: 6.5,
            blouse_included: true,
            care_instructions: 'Dry clean recommended'
          },
          inventory: {
            available_stock: 7,
            sku: 'CPS-PK-005'
          },
          is_featured: false,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Mysore Silk Saree - Maroon',
          description: 'Classic Mysore silk saree with traditional motifs and rich texture.',
          category: 'Silk Sarees',
          images: [
            {
              url: '/images/categories/silk-sarees.jpg',
              view_type: 'front',
              alt_text: 'Mysore Silk Saree Front View'
            }
          ],
          pricing: {
            base_price: 6500,
            selling_price: 4875,
            discount_percentage: 25
          },
          specifications: {
            fabric: 'Mysore Silk',
            occasion: 'Festival, Formal',
            length: 6.5,
            blouse_included: true,
            care_instructions: 'Dry clean only'
          },
          inventory: {
            available_stock: 4,
            sku: 'MSS-MR-006'
          },
          is_featured: false,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      const result = await products.insertMany(saleProducts);
      console.log('✅ Added', result.insertedCount, 'sale products');
      
    } else {
      // Update existing products to add discounts
      const updateResult = await products.updateMany(
        { 
          "pricing.discount_percentage": { $exists: false } 
        },
        { 
          $set: {
            "pricing.discount_percentage": 15,
            "pricing.selling_price": { $multiply: ["$pricing.base_price", 0.85] }
          }
        }
      );
      
      console.log('✅ Updated', updateResult.modifiedCount, 'existing products with 15% discount');
      
      // Add some higher discounts to specific products
      const highDiscountUpdate = await products.updateMany(
        { 
          $or: [
            { name: { $regex: /designer|party|cotton/i } },
            { category: { $regex: /designer|party|cotton/i } }
          ]
        },
        { 
          $set: {
            "pricing.discount_percentage": 25,
            "pricing.selling_price": { $multiply: ["$pricing.base_price", 0.75] }
          }
        }
      );
      
      console.log('✅ Added higher discounts to', highDiscountUpdate.modifiedCount, 'designer/party/cotton products');
    }
    
    // Get final count of sale products
    const saleCount = await products.countDocuments({
      "pricing.discount_percentage": { $gt: 0 }
    });
    
    console.log('🎉 Total sale products available:', saleCount);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addSaleData();