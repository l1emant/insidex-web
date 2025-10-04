const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function testEmailConfiguration() {
    console.log('📧 Testing Email Configuration...\n');
    
    // Check required environment variables
    const requiredEnvVars = [
        'NODEMAILER_EMAIL',
        'NODEMAILER_PASSWORD', 
        'GEMINI_API_KEY'
    ];
    
    console.log('🔍 Checking Environment Variables:');
    let missingVars = [];
    
    requiredEnvVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            console.log(`   ✅ ${varName}: ${varName === 'NODEMAILER_PASSWORD' ? '***hidden***' : value}`);
        } else {
            console.log(`   ❌ ${varName}: Not set`);
            missingVars.push(varName);
        }
    });
    
    if (missingVars.length > 0) {
        console.log('\n❌ Missing Required Environment Variables:');
        missingVars.forEach(varName => {
            console.log(`   • ${varName}`);
        });
        
        console.log('\n📋 To fix this, create a .env file in the project root with:');
        console.log('NODEMAILER_EMAIL=your-gmail@gmail.com');
        console.log('NODEMAILER_PASSWORD=your-app-password');
        console.log('GEMINI_API_KEY=your-gemini-api-key');
        console.log('\nNote: For Gmail, you need to use an App Password, not your regular password.');
        console.log('Generate one at: https://myaccount.google.com/apppasswords');
        return;
    }
    
    console.log('\n✅ All required environment variables are set!');
    
    // Test nodemailer connection
    try {
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            }
        });
        
        console.log('\n🔌 Testing Nodemailer Connection...');
        await transporter.verify();
        console.log('✅ Nodemailer connection successful!');
        
        console.log('\n🎯 Email functionality should work correctly.');
        console.log('\n📋 Next Steps:');
        console.log('   1. Sign up a new user account');
        console.log('   2. Check if welcome email is sent');
        console.log('   3. Check spam folder if email not received');
        
    } catch (error) {
        console.error('❌ Nodemailer connection failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   • Verify Gmail credentials are correct');
        console.log('   • Ensure 2FA is enabled and using App Password');
        console.log('   • Check if "Less secure app access" is enabled');
    }
}

testEmailConfiguration();
