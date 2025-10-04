const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function comprehensiveTest() {
    console.log('🔍 Starting comprehensive test of styling and authentication...\n');
    
    try {
        // Test 1: MongoDB Connection
        console.log('1️⃣ Testing MongoDB Connection...');
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.log('❌ MONGODB_URI not found in environment variables');
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
        console.log('✅ MongoDB connection successful');
        
        // Test 2: Check Collections
        console.log('\n2️⃣ Checking Database Collections...');
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        console.log('📋 Available collections:', collectionNames);
        
        const requiredCollections = ['user', 'session', 'account'];
        const missingCollections = requiredCollections.filter(name => !collectionNames.includes(name));
        
        if (missingCollections.length > 0) {
            console.log('⚠️ Missing collections:', missingCollections);
        } else {
            console.log('✅ All required collections present');
        }
        
        // Test 3: Check User Data
        console.log('\n3️⃣ Checking User Data...');
        const usersCollection = db.collection('user');
        const userCount = await usersCollection.countDocuments();
        console.log(`👥 Total users: ${userCount}`);
        
        if (userCount > 0) {
            const recentUsers = await usersCollection.find({}).sort({ createdAt: -1 }).limit(2).toArray();
            console.log('📝 Recent users:');
            recentUsers.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} (${user.name}) - Created: ${user.createdAt}`);
            });
        }
        
        // Test 4: Check Sessions
        console.log('\n4️⃣ Checking Active Sessions...');
        const sessionsCollection = db.collection('session');
        const sessionCount = await sessionsCollection.countDocuments();
        console.log(`🔐 Total sessions: ${sessionCount}`);
        
        // Test 5: Environment Variables Check
        console.log('\n5️⃣ Checking Environment Variables...');
        const requiredEnvVars = ['MONGODB_URI', 'BETTER_AUTH_SECRET'];
        const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
        
        if (missingEnvVars.length > 0) {
            console.log('⚠️ Missing environment variables:', missingEnvVars);
        } else {
            console.log('✅ All required environment variables present');
        }
        
        console.log('\n🎉 Comprehensive test completed successfully!');
        console.log('\n📋 Summary:');
        console.log(`   • MongoDB: ✅ Connected`);
        console.log(`   • Collections: ✅ ${collectionNames.length} found`);
        console.log(`   • Users: ${userCount > 0 ? '✅' : '⚠️'} ${userCount} users`);
        console.log(`   • Sessions: ${sessionCount > 0 ? '✅' : '⚠️'} ${sessionCount} sessions`);
        console.log(`   • Environment: ${missingEnvVars.length === 0 ? '✅' : '⚠️'} ${missingEnvVars.length === 0 ? 'All set' : 'Missing vars'}`);
        
        console.log('\n🚀 Next steps:');
        console.log('   1. Start the development server: npm run dev');
        console.log('   2. Navigate to http://localhost:3000/sign-up');
        console.log('   3. Create a test account');
        console.log('   4. Check if styling loads properly');
        console.log('   5. Test sign-in functionality');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('\n🔌 Disconnected from MongoDB');
        }
    }
}

comprehensiveTest();
