const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env at the project root
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Test MongoDB connection and user creation
async function testAuthFlow() {
    try {
        console.log('Testing MongoDB connection and auth flow...');
        
        // Connect to MongoDB using the same connection logic as the app
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.log('❌ MONGODB_URI environment variable not set');
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

        // Check if users collection exists and has data
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('📋 Available collections:', collections.map(c => c.name));

        // Check users collection
        const usersCollection = db.collection('users');
        const userCount = await usersCollection.countDocuments();
        console.log(`👥 Total users in database: ${userCount}`);

        if (userCount > 0) {
            const recentUsers = await usersCollection.find({}).sort({ createdAt: -1 }).limit(3).toArray();
            console.log('📝 Recent users:', recentUsers.map(u => ({
                id: u._id,
                email: u.email,
                name: u.name,
                createdAt: u.createdAt
            })));
        }

        // Check sessions collection
        const sessionsCollection = db.collection('sessions');
        const sessionCount = await sessionsCollection.countDocuments();
        console.log(`🔐 Total sessions: ${sessionCount}`);

        // Check accounts collection (for OAuth if used)
        const accountsCollection = db.collection('accounts');
        const accountCount = await accountsCollection.countDocuments();
        console.log(`🔗 Total accounts: ${accountCount}`);

        console.log('✅ Auth flow test completed successfully');
        
    } catch (error) {
        console.error('❌ Auth flow test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

testAuthFlow();
