import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { hashPassword } from '@/lib/hash';
import { signJwt } from '@/lib/jwt';
import { sendVerificationEmail } from '@/lib/email';
import { getClientIpFromRequest, lookupIp } from '@/lib/geoip';

type RegisterBody = {
    name?: string;
    email?: string;
    password?: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as RegisterBody;
        const email = (body.email || '').toLowerCase().trim();
        const password = body.password || '';
        const name = (body.name || '').trim();

        if (!email || !password || password.length < 6) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        await dbConnect();

        const existing = await User.findOne({ email }).lean();
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);

        const ip = getClientIpFromRequest(req);
        const geo = lookupIp(ip);

        const created = await User.create({
            name,
            email,
            passwordHash,
            isVerified: false,
            role: 'user',
            verificationToken: null,
            createdIp: geo?.ip || ip || null,
            country: geo?.country || null,
            region: geo?.region || null,
            city: geo?.city || null,
            ipInfo: geo || null,
        });

        const verificationToken = signJwt({ sub: created._id.toString(), email }, { expiresIn: '1d' });
        await User.updateOne({ _id: created._id }, { $set: { verificationToken } });

        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (err) {
            console.error('sendVerificationEmail failed:', err);
            return NextResponse.json({ message: 'Account created but verification email failed to send. Contact admin.' }, { status: 201 });
        }

        return NextResponse.json({ message: 'Account created. Verification email sent.' }, { status: 201 });
    } catch (err: any) {
        console.error('Register error:', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
