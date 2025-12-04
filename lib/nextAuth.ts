import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from './mongodb';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { NextAuthOptions } from 'next-auth';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
}

import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyPassword } from "@/lib/hash";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            allowDangerousEmailAccountLinking: true,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email.toLowerCase() }).exec();

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                if (!user.isVerified) {
                    throw new Error("Please confirm your email before logging in");
                }

                const isValid = await verifyPassword(credentials.password, user.passwordHash);

                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                };
            }
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    callbacks: {
        async signIn({ user, account, profile }) {
            if ((account?.provider === 'google' || account?.provider === 'github') && user?.email) {
                try {
                    await dbConnect();
                    const existingUser = await User.findOne({ email: user.email.toLowerCase() });

                    if (existingUser && !existingUser.isVerified) {
                        await User.updateOne(
                            { _id: existingUser._id },
                            {
                                $set: {
                                    isVerified: true,
                                    verifiedAt: existingUser.verifiedAt || new Date()
                                }
                            }
                        );
                    }
                } catch (error) {
                    console.error('Error auto-verifying OAuth user:', error);
                }
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) {
                return url;
            }
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            }
            return baseUrl;
        },
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
    debug: process.env.NODE_ENV === 'development',
};
