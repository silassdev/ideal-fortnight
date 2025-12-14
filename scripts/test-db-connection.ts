import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env or .env.local');
    process.exit(1);
}

// Log masked URI for verification (show protocol)
const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
console.log(`🔌 Attempting to connect to: ${maskedUri}`);

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI!, {
            serverSelectionTimeoutMS: 5000, // Fail fast (5s)
        });
        console.log('✅ Connection Successful!');
        console.log('Database Name:', mongoose.connection.name);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Connection Failed:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
        process.exit(1);
    }
}

testConnection();
