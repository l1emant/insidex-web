import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if(authInstance) return authInstance;

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;

        if(!db) {
            console.warn('MongoDB connection not found, using memory adapter');
            // Use memory adapter as fallback
            authInstance = betterAuth({
                secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-key',
                baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
                emailAndPassword: {
                    enabled: true,
                    disableSignUp: false,
                    requireEmailVerification: false,
                    minPasswordLength: 8,
                    maxPasswordLength: 128,
                    autoSignIn: true,
                },
                plugins: [nextCookies()],
            });
        } else {
            console.log('✅ Using MongoDB adapter for Better Auth');
            authInstance = betterAuth({
                database: mongodbAdapter(db as any),
                secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-key',
                baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
                emailAndPassword: {
                    enabled: true,
                    disableSignUp: false,
                    requireEmailVerification: false,
                    minPasswordLength: 8,
                    maxPasswordLength: 128,
                    autoSignIn: true,
                },
                plugins: [nextCookies()],
            });
        }
    } catch (error) {
        console.error('Auth initialization failed:', error);
        // Fallback auth configuration
        authInstance = betterAuth({
            secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-key',
            baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
            emailAndPassword: {
                enabled: true,
                disableSignUp: false,
                requireEmailVerification: false,
                minPasswordLength: 8,
                maxPasswordLength: 128,
                autoSignIn: true,
            },
            plugins: [nextCookies()],
        });
    }

    return authInstance;
}