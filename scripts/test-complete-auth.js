const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function testCompleteAuthFlow() {
    console.log('🔐 Testing Complete Authentication Flow...\n');
    
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
        
        const db = mongoose.connection.db;
        
        // Check collections
        const collections = await db.listCollections().toArray();
        console.log('📋 Available collections:', collections.map(c => c.name));
        
        // Check current state
        const usersCollection = db.collection('user');
        const sessionsCollection = db.collection('session');
        const accountsCollection = db.collection('account');
        
        const userCount = await usersCollection.countDocuments();
        const sessionCount = await sessionsCollection.countDocuments();
        const accountCount = await accountsCollection.countDocuments();
        
        console.log(`\n📊 Current Database State:`);
        console.log(`   • Users: ${userCount}`);
        console.log(`   • Sessions: ${sessionCount}`);
        console.log(`   • Accounts: ${accountCount}`);
        
        if (userCount > 0) {
            const users = await usersCollection.find({}).limit(3).toArray();
            console.log('\n👥 Recent users:');
            users.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} (${user.name}) - Created: ${user.createdAt}`);
            });
        }
        
        console.log('\n🚀 Ready for testing!');
        console.log('\n📋 Test Instructions:');
        console.log('   1. Open browser: http://localhost:3000/sign-up');
        console.log('   2. Fill out the sign-up form');
        console.log('   3. Submit the form');
        console.log('   4. Check if you get redirected to /sign-in');
        console.log('   5. Try to sign in with the same credentials');
        console.log('   6. Run this script again to verify data was saved');
        
        console.log('\n🔍 Monitoring:');
        console.log('   • Watch the terminal for Better Auth logs');
        console.log('   • Look for "✅ Using MongoDB adapter for Better Auth" message');
        console.log('   • Check for any error messages');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('\n🔌 Disconnected from MongoDB');
        }
    }
}

testCompleteAuthFlow();
