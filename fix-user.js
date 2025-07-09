const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Replace with your email and desired password
const USER_EMAIL = 'nirbhayarora14@gmail.com';
const NEW_PASSWORD = 'science14';

const MONGODB_URI = 'mongodb+srv://admin:science14@cluster0.anmmao1.mongodb.net/dhanlaxmi-saree-sadan?retryWrites=true&w=majority&appName=Cluster0';

async function fixUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dhanlaxmi-saree-sadan');
    const users = db.collection('users');
    
    // Check if user exists
    const user = await users.findOne({ email: USER_EMAIL.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found with email:', USER_EMAIL);
      return;
    }
    
    console.log('✅ User found:', user.name, user.email);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);
    
    // Update user
    const result = await users.updateOne(
      { email: USER_EMAIL.toLowerCase() },
      {
        $set: {
          password: hashedPassword,
          email_verified: true,
          is_active: true,
          updated_at: new Date()
        },
        $unset: {
          verification_otp: '',
          verification_otp_expiry: ''
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ User password updated successfully!');
      console.log('✅ Email verified and account activated');
      console.log('');
      console.log('🎉 You can now login with:');
      console.log('   Email:', USER_EMAIL);
      console.log('   Password:', NEW_PASSWORD);
    } else {
      console.log('❌ Failed to update user');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixUser();