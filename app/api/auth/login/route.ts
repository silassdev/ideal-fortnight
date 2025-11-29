import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyPassword } from '@/lib/hash';
import { signJwt } from '@/lib/jwt';
import { getClientIpFromRequest, lookupIp } from '@/lib/geoip';

type LoginBody = { email?: string; password?: string };

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as LoginBody;
        const email = (body.email || '').toLowerCase().trim();
        const password = body.password || '';

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        if (!user.passwordHash) return NextResponse.json({ error: 'No local password set. Use Google or reset.' }, { status: 401 });

        const match = await verifyPassword(password, user.passwordHash);
        if (!match) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        if (!user.isVerified) return NextResponse.json({ error: 'Account not verified. Check email.' }, { status: 403 });

        const ip = getClientIpFromRequest(req);
        const geo = lookupIp(ip);

        user.lastLoginIp = geo?.ip || ip || user.lastLoginIp;
        user.country = geo?.country || user.country;
        user.region = geo?.region || user.region;
        user.city = geo?.city || user.city;
        user.ipInfo = geo || user.ipInfo;
        user.lastLoginAt = new Date();
        await user.save();

        const token = signJwt({ sub: user._id.toString(), email: user.email }, { expiresIn: '7d' });

        const res = NextResponse.json({ ok: true, message: 'Signed in' }, { status: 200 });
        res.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
        });

        res.cookies.set({
            name: 'role',
            value: user.role,
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch (err: any) {
        console.error('Login error:', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
