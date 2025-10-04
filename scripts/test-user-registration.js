const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function testUserRegistration() {
    console.log('🧪 Testing User Registration with MongoDB...\n');
    
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.log('❌ MONGODB_URI not found');
            return;
        }
        
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true,
            retryReads: true,
        });
        console.log('✅ Connected to MongoDB');
        
        // Check current user count
        const db = mongoose.connection.db;
        const usersCollection = db.collection('user');
        const initialUserCount = await usersCollection.countDocuments();
        console.log(`📊 Initial user count: ${initialUserCount}`);
        
        // Check sessions count
        const sessionsCollection = db.collection('session');
        const initialSessionCount = await sessionsCollection.countDocuments();
        console.log(`📊 Initial session count: ${initialSessionCount}`);
        
        // Test creating a user directly (simulating Better Auth behavior)
        const testUser = {
            email: 'test@example.com',
            name: 'Test User',
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('\n🔍 Testing direct user creation...');
        const result = await usersCollection.insertOne(testUser);
        console.log('✅ Test user created with ID:', result.insertedId);
        
        // Verify user was created
        const newUserCount = await usersCollection.countDocuments();
        console.log(`📊 New user count: ${newUserCount}`);
        
        // Clean up test user
        await usersCollection.deleteOne({ _id: result.insertedId });
        console.log('🧹 Test user cleaned up');
        
        const finalUserCount = await usersCollection.countDocuments();
        console.log(`📊 Final user count: ${finalUserCount}`);
        
        console.log('\n🎉 MongoDB user registration test completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Go to http://localhost:3000/sign-up');
        console.log('   2. Create a real account');
        console.log('   3. Check MongoDB for the new user');
        console.log('   4. Test sign-in functionality');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('\n🔌 Disconnected from MongoDB');
        }
    }
}

testUserRegistration();
