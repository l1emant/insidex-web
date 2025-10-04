const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function testWatchlistAndSearch() {
    console.log('🔍 Testing Watchlist and Search Functionality...\n');
    
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
        const watchlistsCollection = db.collection('watchlists');
        
        const userCount = await usersCollection.countDocuments();
        const sessionCount = await sessionsCollection.countDocuments();
        const watchlistCount = await watchlistsCollection.countDocuments();
        
        console.log(`\n📊 Current Database State:`);
        console.log(`   • Users: ${userCount}`);
        console.log(`   • Sessions: ${sessionCount}`);
        console.log(`   • Watchlist items: ${watchlistCount}`);
        
        if (userCount > 0) {
            const users = await usersCollection.find({}).limit(2).toArray();
            console.log('\n👥 Users:');
            users.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} (${user.name}) - ID: ${user.id}`);
            });
        }
        
        if (watchlistCount > 0) {
            const watchlistItems = await watchlistsCollection.find({}).limit(3).toArray();
            console.log('\n⭐ Watchlist items:');
            watchlistItems.forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.symbol} - ${item.company} (User: ${item.userId})`);
            });
        }
        
        console.log('\n🎯 Test Instructions:');
        console.log('   1. Open browser: http://localhost:3000');
        console.log('   2. Sign in with your account');
        console.log('   3. Test search functionality:');
        console.log('      • Use the search bar to search for stocks');
        console.log('      • Try searching for "AAPL", "GOOGL", "TSLA"');
        console.log('   4. Test watchlist functionality:');
        console.log('      • Add stocks to watchlist using the + button');
        console.log('      • Go to /watchlist page to view your watchlist');
        console.log('      • Remove stocks from watchlist');
        console.log('   5. Test radar page:');
        console.log('      • Go to /radar page - should be empty');
        
        console.log('\n🔍 What to Watch For:');
        console.log('   • No more "auth is not exported" errors');
        console.log('   • No more "Cannot read properties of undefined" errors');
        console.log('   • Search should return stock results');
        console.log('   • Watchlist should add/remove stocks properly');
        console.log('   • Radar page should be empty');
        
        console.log('\n✅ Expected Results:');
        console.log('   • Search: Returns stock symbols and names');
        console.log('   • Watchlist: Can add/remove stocks, persists in MongoDB');
        console.log('   • Radar: Empty page with basic title');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('\n🔌 Disconnected from MongoDB');
        }
    }
}

testWatchlistAndSearch();
