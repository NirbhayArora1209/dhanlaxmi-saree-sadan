# Backend Setup Guide - Dhanlaxmi Saree Sadan

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/dhanlaxmi-saree-sadan

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application Configuration
NEXT_PUBLIC_APP_NAME=Dhanlaxmi Saree Sadan
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `dhanlaxmi-saree-sadan`

#### Option B: MongoDB Atlas (Recommended for Production)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI`

### 3. Database Seeding

Run the seed script to populate the database with initial data:

```bash
npx tsx src/scripts/seed.ts
```

This will create:
- 5 categories (Silk, Cotton, Designer, Wedding, Party Wear)
- 5 sample products
- Admin user (admin@dhanlaxmisareesadan.com / admin123)

### 4. Start Development Server

```bash
npm run dev
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/[id]` - Update product (Admin only)
- `DELETE /api/products/[id]` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)

### Query Parameters for Products API

```
GET /api/products?category=silk-sarees&search=banarasi&minPrice=1000&maxPrice=50000&sort=price&order=asc&page=1&limit=12&featured=true
```

## 🔧 Database Models

### Product Schema
```typescript
{
  name: string;
  description: string;
  category: string;
  images: string[];
  pricing: {
    base_price: number;
    selling_price: number;
    discount_percentage: number;
  };
  specifications: {
    fabric: string;
    occasion: string;
    length: number;
    blouse_included: boolean;
    care_instructions: string;
  };
  ratings: {
    average_rating: number;
    total_reviews: number;
  };
  inventory: {
    available_stock: number;
    sku: string;
  };
  is_featured: boolean;
  is_active: boolean;
}
```

### User Schema
```typescript
{
  name: string;
  email: string;
  password: string; // Hashed with bcrypt
  phone?: string;
  role: 'customer' | 'admin';
  is_active: boolean;
  email_verified: boolean;
}
```

### Category Schema
```typescript
{
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count: number;
  is_active: boolean;
}
```

## 🔐 Authentication

The backend uses JWT tokens for authentication:

1. **Registration**: Creates user and returns JWT token
2. **Login**: Validates credentials and returns JWT token
3. **Protected Routes**: Include `Authorization: Bearer <token>` header

### Example Usage
```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token } = await response.json();

// Use token for protected requests
const products = await fetch('/api/products', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🛡️ Security Features

- **Password Hashing**: Using bcrypt with salt rounds of 12
- **JWT Tokens**: 7-day expiration
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Comprehensive error responses
- **Database Indexing**: Optimized queries with proper indexes

## 📊 Database Indexes

### Products
- `{ category: 1, is_active: 1 }` - Category filtering
- `{ is_featured: 1, is_active: 1 }` - Featured products
- `{ name: 'text', description: 'text' }` - Full-text search

### Users
- `{ email: 1 }` - Email lookup
- `{ role: 1, is_active: 1 }` - Role-based queries

### Categories
- `{ slug: 1 }` - Slug lookup
- `{ is_active: 1 }` - Active categories

## 🚀 Production Deployment

### Environment Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dhanlaxmi-saree-sadan
JWT_SECRET=your-very-long-and-secure-jwt-secret-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Security Checklist
- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable HTTPS
- [ ] Set up proper CORS configuration
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging

## 🔧 Development Tools

### Database Management
- **MongoDB Compass**: GUI for MongoDB
- **Studio 3T**: Alternative MongoDB GUI

### API Testing
- **Postman**: API testing and documentation
- **Insomnia**: Lightweight API client

## 📝 Next Steps

1. **Order Management**: Implement order creation and tracking
2. **Payment Integration**: Add Razorpay or other payment gateways
3. **Email Notifications**: Set up email service for order confirmations
4. **Image Upload**: Implement cloud storage for product images
5. **Admin Dashboard**: Create admin interface for product management
6. **Search & Filters**: Enhance search functionality
7. **Reviews & Ratings**: Add customer review system
8. **Inventory Management**: Real-time stock tracking

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify token format

3. **Validation Errors**
   - Check required fields
   - Verify data types
   - Review schema constraints

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
```

## 📞 Support

For backend-related issues:
1. Check the console logs
2. Verify environment variables
3. Test database connectivity
4. Review API documentation

---

**Happy Coding! 🎉** 