import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Mongoose connection helper.
 * Caches connection across hot reloads in development.
 */
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any).__mongo__;
if (!cached) {
    cached = (global as any).__mongo__ = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            // useNewUrlParser and useUnifiedTopology are default in mongoose 6+
        };
        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
