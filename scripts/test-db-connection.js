/*
 Standalone script to test MongoDB connection using Mongoose.
 Usage:
   1) Ensure you have a .env file at project root with MONGODB_URI set.
   2) Run: npm run test:db
*/

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env at the project root
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not set. Please add it to your .env file.');
    process.exitCode = 1;
    return;
  }

  console.log('Attempting to connect to MongoDB...');

  try {
    const conn = await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('Mongoose connected.');

    // Optional: run a ping command against the admin database to verify connectivity
    try {
      const result = await mongoose.connection.db.admin().command({ ping: 1 });
      if (result && result.ok === 1) {
        console.log('Ping successful: Connected to MongoDB.');
      } else {
        console.warn('Ping did not return ok=1. Result:', result);
      }
    } catch (pingErr) {
      console.warn('Connected but ping failed:', pingErr?.message || pingErr);
    }

    console.log(`Database name: ${conn.connection.name}`);
    console.log(`Host: ${conn.connection.host}`);
    console.log('Database connection test completed successfully.');
  } catch (err) {
    console.error('Failed to connect to MongoDB:');
    console.error(err?.stack || err);
    process.exitCode = 1;
  } finally {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('Mongoose disconnected.');
      }
    } catch (discErr) {
      console.warn('Error while disconnecting mongoose:', discErr?.message || discErr);
    }
  }
}

main();
