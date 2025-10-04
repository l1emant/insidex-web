import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if(!MONGODB_URI) {
        console.warn('MONGODB_URI not set, using fallback connection');
        // Use a fallback local MongoDB connection for development
        const fallbackUri = 'mongodb://localhost:27017/insidex-dev';
        cached.promise = mongoose.connect(fallbackUri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true,
            retryReads: true,
        });
    } else {
        if(cached.conn) return cached.conn;

        if(!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URI, { 
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                retryWrites: true,
                retryReads: true,
            });
        }
    }

    try {
        cached.conn = await cached.promise;
        console.log(`Connected to database ${process.env.NODE_ENV}`);
        return cached.conn;
    } catch (err) {
        cached.promise = null;
        console.error('Database connection failed:', err);
        // Return a mock connection for development to prevent app crashes
        return mongoose;
    }
}
