// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyPassword } from '@/lib/hash';
import { signJwt } from '@/lib/jwt';

type Body = {
    email?: string;
    password?: string;
};

export async function POST(req: Request) {
    try {
        const body: Body = await req.json();
        const email = (body.email || '').toLowerCase().trim();
        const password = body.password || '';

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // If user was created via OAuth and has no passwordHash, advise to login with Google
        if (!user.passwordHash) {
            return NextResponse.json({ error: 'No local password set. Sign in with Google or reset password.' }, { status: 401 });
        }

        const match = await verifyPassword(password, user.passwordHash);
        if (!match) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ error: 'Account not verified. Check your email for the confirmation link.' }, { status: 403 });
        }

        // Update last login info (IP and country)
        // Best-effort: read common headers (x-forwarded-for, x-real-ip, vercel country)
        const headers = new Headers(req.headers as any);
        const forwarded = headers.get('x-forwarded-for') || headers.get('x-real-ip') || null;
        const ip = forwarded ? forwarded.split(',')[0].trim() : null;
        const country = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || null;

        user.lastLoginIp = ip || user.lastLoginIp;
        user.country = country || user.country;
        user.lastLoginAt = new Date();
        await user.save();

        // Issue JWT token (use server-side secret)
        const token = signJwt({ sub: user._id.toString(), email: user.email }, { expiresIn: '7d' });

        // Set httpOnly cookie
        const res = NextResponse.json({ ok: true, message: 'Signed in' }, { status: 200 });
        res.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return res;
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('Login error:', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
