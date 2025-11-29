import mongoose from 'mongoose';

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

declare global {
    var __mongoose_global__: Cached | undefined;
}

let cached: Cached = global.__mongoose_global__ ?? { conn: null, promise: null };
if (!global.__mongoose_global__) global.__mongoose_global__ = cached;


export default async function dbConnect(): Promise<typeof mongoose> {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable. Put it in a .env.local file or pass it inline when running the script.'
        );
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = { bufferCommands: false };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
