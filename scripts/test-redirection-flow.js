const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function testRedirectionFlow() {
    console.log('🔄 Testing Redirection Flow...\n');
    
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
        
        // Check current state
        const usersCollection = db.collection('user');
        const sessionsCollection = db.collection('session');
        
        const userCount = await usersCollection.countDocuments();
        const sessionCount = await sessionsCollection.countDocuments();
        
        console.log(`\n📊 Current Database State:`);
        console.log(`   • Users: ${userCount}`);
        console.log(`   • Sessions: ${sessionCount}`);
        
        if (userCount > 0) {
            const users = await usersCollection.find({}).limit(3).toArray();
            console.log('\n👥 Recent users:');
            users.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} (${user.name}) - Created: ${user.createdAt}`);
            });
        }
        
        if (sessionCount > 0) {
            const sessions = await sessionsCollection.find({}).limit(3).toArray();
            console.log('\n🔐 Recent sessions:');
            sessions.forEach((session, index) => {
                console.log(`   ${index + 1}. User: ${session.userId} - Created: ${session.createdAt}`);
            });
        }
        
        console.log('\n🎯 Redirection Test Instructions:');
        console.log('   1. Open browser: http://localhost:3000/sign-up');
        console.log('   2. Create a new account');
        console.log('   3. After sign-up, you should be redirected to /sign-in');
        console.log('   4. Sign in with the same credentials');
        console.log('   5. After sign-in, you should be redirected to / (dashboard)');
        console.log('   6. The dashboard should load with TradingView widgets');
        
        console.log('\n🔍 What to Watch For:');
        console.log('   • No more "auth.api.getSession is not a function" errors');
        console.log('   • No more "auth is not defined" errors');
        console.log('   • Successful redirects after sign-up and sign-in');
        console.log('   • Dashboard loads properly with user data');
        
        console.log('\n✅ Expected Flow:');
        console.log('   Sign-up → Redirect to /sign-in → Sign-in → Redirect to / (dashboard)');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('\n🔌 Disconnected from MongoDB');
        }
    }
}

testRedirectionFlow();
