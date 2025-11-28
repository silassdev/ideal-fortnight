import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // This is a temporary dummy user. Replace with real database lookup.
                if (
                    credentials?.username === "admin" &&
                    credentials?.password === "admin"
                ) {
                    return { id: "1", name: "Admin User", email: "admin@example.com" };
                }
                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET || "temporary-secret-do-not-use-in-production",
    pages: {
        signIn: '/auth/signin', // Optional: Custom sign-in page
    },
};
