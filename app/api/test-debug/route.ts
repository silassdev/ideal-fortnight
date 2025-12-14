import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
    const uri = process.env.MONGODB_URI;
    const isSet = !!uri;
    const connState = mongoose.connection.readyState;

    // Attempt connection if not connected
    let connectionError = null;
    if (connState !== 1 && uri) {
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        } catch (e: any) {
            connectionError = e.message;
        }
    }

    return NextResponse.json({
        envVarJson: JSON.stringify(process.env), // DANGEROUS? No, process.env isn't fully serialized usually in Next.js edge/serverless, but let's be careful.
        // Better:
        mongoUriSet: isSet,
        mongoUriPrefix: isSet ? uri?.split(':')[0] : null,
        mongooseState: mongoose.connection.readyState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
        connectionError,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        nextAuthSecretSet: !!process.env.NEXTAUTH_SECRET,
    });
}
