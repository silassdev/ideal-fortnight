import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from './mongodb';
import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions } from 'next-auth';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    // Google provider is optional; NextAuth will still work for other providers if you don't use Google.
    // Do not throw to allow alternative setups.
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        // You can add other providers here (Github, etc.)
    ],
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    callbacks: {
        // Include user.id in JWT and session
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.sub as string;
            }
            return session;
        },
    },
};
