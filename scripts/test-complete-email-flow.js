const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function testCompleteEmailFlow() {
    console.log('📧 Testing Complete Email Flow...\n');
    
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
            console.log('\n👥 Recent Users:');
            users.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} (${user.name}) - Created: ${user.createdAt || 'Unknown'}`);
            });
        }
        
        console.log('\n🎯 Email Flow Test Instructions:');
        console.log('   1. Open browser: http://localhost:3000/sign-up');
        console.log('   2. Fill out the sign-up form with:');
        console.log('      • Email: test-email@example.com');
        console.log('      • Password: password123');
        console.log('      • Full Name: Test User');
        console.log('      • Country: United States');
        console.log('      • Investment Goals: Growth');
        console.log('      • Risk Tolerance: Moderate');
        console.log('      • Preferred Industry: Technology');
        console.log('   3. Submit the form');
        console.log('   4. Check your email (including spam folder)');
        console.log('   5. Look for "Welcome to InsideX" email');
        
        console.log('\n🔍 What to Watch For:');
        console.log('   • No errors in terminal during signup');
        console.log('   • User gets created in MongoDB');
        console.log('   • Welcome email arrives within 1-2 minutes');
        console.log('   • Email has InsideX branding and colors');
        console.log('   • Email contains personalized content based on form data');
        
        console.log('\n✅ Expected Email Content:');
        console.log('   • Subject: "Welcome to InsideX - your stock market toolkit is ready!"');
        console.log('   • From: "InsideX" <insidex@jsmastery.pro>');
        console.log('   • Personalized intro mentioning their investment goals');
        console.log('   • InsideX branding and yellow/gold color scheme');
        console.log('   • Dashboard preview image');
        console.log('   • CTA button linking to https://insidex.app/');
        
        console.log('\n🚨 If Email Doesn\'t Arrive:');
        console.log('   • Check spam/junk folder');
        console.log('   • Verify Gmail App Password is correct');
        console.log('   • Check terminal for Inngest errors');
        console.log('   • Ensure Gemini API key is valid');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('\n🔌 Disconnected from MongoDB');
        }
    }
}

testCompleteEmailFlow();
