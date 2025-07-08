import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

const BASE_URL = 'http://localhost:3000/api';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message: string;
  details?: any;
}

class APITester {
  private results: TestResult[] = [];

  async testEndpoint(url: string, expectedStatus: number, description: string): Promise<void> {
    try {
      const response = await fetch(url);
      const success = response.status === expectedStatus;
      
      this.results.push({
        test: description,
        status: success ? 'PASS' : 'FAIL',
        message: `Expected ${expectedStatus}, got ${response.status}`,
        details: { url, status: response.status }
      });
      
      if (success) {
        console.log(`✅ ${description}`);
      } else {
        console.log(`❌ ${description} - Expected ${expectedStatus}, got ${response.status}`);
      }
    } catch (error) {
      this.results.push({
        test: description,
        status: 'FAIL',
        message: `Request failed: ${error}`,
        details: { url, error }
      });
      console.log(`❌ ${description} - Request failed: ${error}`);
    }
  }

  async testProductsAPI(): Promise<void> {
    console.log('\n🧪 Testing Products API...');
    
    // Basic list
    await this.testEndpoint(`${BASE_URL}/products`, 200, 'GET /products - Basic list');
    
    // Pagination
    await this.testEndpoint(`${BASE_URL}/products?page=1&limit=2`, 200, 'GET /products - Pagination');
    await this.testEndpoint(`${BASE_URL}/products?page=999&limit=1`, 200, 'GET /products - High page number');
    
    // Category filtering
    await this.testEndpoint(`${BASE_URL}/products?category=silk-sarees`, 200, 'GET /products - Category filter (silk)');
    await this.testEndpoint(`${BASE_URL}/products?category=cotton-sarees`, 200, 'GET /products - Category filter (cotton)');
    await this.testEndpoint(`${BASE_URL}/products?category=invalid-category`, 404, 'GET /products - Invalid category');
    
    // Price filtering
    await this.testEndpoint(`${BASE_URL}/products?minPrice=1000&maxPrice=5000`, 200, 'GET /products - Price range filter');
    await this.testEndpoint(`${BASE_URL}/products?minPrice=999999`, 200, 'GET /products - High min price (no results)');
    
    // Featured filtering
    await this.testEndpoint(`${BASE_URL}/products?featured=true`, 200, 'GET /products - Featured filter');
    await this.testEndpoint(`${BASE_URL}/products?featured=false`, 200, 'GET /products - Non-featured filter');
    
    // Sorting
    await this.testEndpoint(`${BASE_URL}/products?sort=name&order=asc`, 200, 'GET /products - Sort by name ASC');
    await this.testEndpoint(`${BASE_URL}/products?sort=pricing.selling_price&order=desc`, 200, 'GET /products - Sort by price DESC');
    
    // Combined filters
    await this.testEndpoint(`${BASE_URL}/products?category=silk-sarees&featured=true&minPrice=1000`, 200, 'GET /products - Combined filters');
  }

  async testIndividualProductAPI(): Promise<void> {
    console.log('\n🧪 Testing Individual Product API...');
    
    // Get a valid product ID first
    const productsResponse = await fetch(`${BASE_URL}/products?limit=1`);
    const productsData = await productsResponse.json();
    
    if (productsData.success && productsData.data.length > 0) {
      const productId = productsData.data[0]._id;
      
      // Valid product
      await this.testEndpoint(`${BASE_URL}/products/${productId}`, 200, 'GET /products/[id] - Valid product');
      
      // Invalid product ID
      await this.testEndpoint(`${BASE_URL}/products/invalid-id`, 400, 'GET /products/[id] - Invalid ID format');
      
      // Non-existent product ID
      await this.testEndpoint(`${BASE_URL}/products/507f1f77bcf86cd799439011`, 404, 'GET /products/[id] - Non-existent product');
    } else {
      console.log('⚠️  No products available for individual product testing');
    }
  }

  async testCategoriesAPI(): Promise<void> {
    console.log('\n🧪 Testing Categories API...');
    
    // Basic list
    await this.testEndpoint(`${BASE_URL}/categories`, 200, 'GET /categories - Basic list');
    
    // Pagination
    await this.testEndpoint(`${BASE_URL}/categories?page=1&limit=3`, 200, 'GET /categories - Pagination');
    
    // Active filter
    await this.testEndpoint(`${BASE_URL}/categories?active=true`, 200, 'GET /categories - Active filter');
  }

  async testAuthAPI(): Promise<void> {
    console.log('\n🧪 Testing Auth API...');
    
    // Register with valid data
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    this.results.push({
      test: 'POST /auth/register - Valid registration',
      status: registerResponse.status === 200 ? 'PASS' : 'FAIL',
      message: `Expected 200, got ${registerResponse.status}`,
      details: { status: registerResponse.status }
    });
    
    if (registerResponse.status === 200) {
      console.log('✅ POST /auth/register - Valid registration');
    } else {
      console.log(`❌ POST /auth/register - Valid registration - Expected 200, got ${registerResponse.status}`);
    }
    
    // Register with missing fields
    const invalidRegisterResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User'
        // Missing email and password
      })
    });
    
    this.results.push({
      test: 'POST /auth/register - Missing fields',
      status: invalidRegisterResponse.status === 400 ? 'PASS' : 'FAIL',
      message: `Expected 400, got ${invalidRegisterResponse.status}`,
      details: { status: invalidRegisterResponse.status }
    });
    
    if (invalidRegisterResponse.status === 400) {
      console.log('✅ POST /auth/register - Missing fields');
    } else {
      console.log(`❌ POST /auth/register - Missing fields - Expected 400, got ${invalidRegisterResponse.status}`);
    }
    
    // Login with valid credentials
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    this.results.push({
      test: 'POST /auth/login - Valid credentials',
      status: loginResponse.status === 200 ? 'PASS' : 'FAIL',
      message: `Expected 200, got ${loginResponse.status}`,
      details: { status: loginResponse.status }
    });
    
    if (loginResponse.status === 200) {
      console.log('✅ POST /auth/login - Valid credentials');
    } else {
      console.log(`❌ POST /auth/login - Valid credentials - Expected 200, got ${loginResponse.status}`);
    }
    
    // Login with invalid credentials
    const invalidLoginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    this.results.push({
      test: 'POST /auth/login - Invalid credentials',
      status: invalidLoginResponse.status === 401 ? 'PASS' : 'FAIL',
      message: `Expected 401, got ${invalidLoginResponse.status}`,
      details: { status: invalidLoginResponse.status }
    });
    
    if (invalidLoginResponse.status === 401) {
      console.log('✅ POST /auth/login - Invalid credentials');
    } else {
      console.log(`❌ POST /auth/login - Invalid credentials - Expected 401, got ${invalidLoginResponse.status}`);
    }
  }

  async testCartWishlistAPI(): Promise<void> {
    console.log('\n🧪 Testing Cart & Wishlist API...');
    
    // Cart API
    await this.testEndpoint(`${BASE_URL}/cart`, 200, 'GET /cart - Basic cart');
    
    // Wishlist API
    await this.testEndpoint(`${BASE_URL}/wishlist`, 200, 'GET /wishlist - Basic wishlist');
  }

  async testEdgeCases(): Promise<void> {
    console.log('\n🧪 Testing Edge Cases...');
    
    // Very large page number
    await this.testEndpoint(`${BASE_URL}/products?page=999999`, 200, 'GET /products - Very large page number');
    
    // Very large limit (should be capped)
    await this.testEndpoint(`${BASE_URL}/products?limit=999999`, 200, 'GET /products - Very large limit');
    
    // Negative values
    await this.testEndpoint(`${BASE_URL}/products?page=-1`, 200, 'GET /products - Negative page');
    await this.testEndpoint(`${BASE_URL}/products?minPrice=-1000`, 200, 'GET /products - Negative price');
    
    // Invalid sort field
    await this.testEndpoint(`${BASE_URL}/products?sort=invalid_field`, 200, 'GET /products - Invalid sort field');
    
    // Empty search
    await this.testEndpoint(`${BASE_URL}/products?search=`, 200, 'GET /products - Empty search');
    
    // Special characters in search
    await this.testEndpoint(`${BASE_URL}/products?search=test@#$%`, 200, 'GET /products - Special characters in search');
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Comprehensive API Testing...\n');
    
    await this.testProductsAPI();
    await this.testIndividualProductAPI();
    await this.testCategoriesAPI();
    await this.testAuthAPI();
    await this.testCartWishlistAPI();
    await this.testEdgeCases();
    
    this.printSummary();
  }

  printSummary(): void {
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = total - passed;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          console.log(`  - ${r.test}: ${r.message}`);
        });
    }
    
    console.log('\n✅ All tests completed!');
  }
}

async function main() {
  try {
    const tester = new APITester();
    await tester.runAllTests();
  } catch (error) {
    console.error('Test runner error:', error);
  }
}

if (require.main === module) {
  main();
}

export { APITester }; 