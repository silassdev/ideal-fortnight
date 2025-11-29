// app/api/auth/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyJwt } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const token = url.searchParams.get('token') || '';

        if (!token) {
            return NextResponse.json({ error: 'Missing token' }, { status: 400 });
        }

        // validate token (JWT)
        const payload = verifyJwt(token);
        if (!payload || !payload.sub) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // connect to DB and find user by id (or email fallback)
        await dbConnect();
        const userId = payload.sub;
        const emailFromToken = payload.email as string | undefined;

        const user = await User.findById(userId) || (emailFromToken ? await User.findOne({ email: emailFromToken }) : null);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If user already verified, just redirect / respond
        if (user.isVerified) {
            // clear token if present
            if (user.verificationToken) {
                user.verificationToken = null;
                await user.save();
            }

            // Prefer redirect for browser clicks, JSON for API clients
            const accept = req.headers.get('accept') || '';
            if (accept.includes('application/json')) {
                return NextResponse.json({ ok: true, message: 'Account already verified' });
            }

            const origin = new URL(req.url).origin;
            return NextResponse.redirect(`${origin}/auth?mode=login&verified=1`);
        }

        // If the user record stores a verificationToken, ensure it matches the provided token
        if (user.verificationToken && user.verificationToken !== token) {
            return NextResponse.json({ error: 'Verification token does not match' }, { status: 400 });
        }

        // Mark verified and clear token
        user.isVerified = true;
        user.verificationToken = null;
        user.verifiedAt = new Date();
        await user.save();

        const accept = req.headers.get('accept') || '';
        if (accept.includes('application/json')) {
            return NextResponse.json({ ok: true, message: 'Email verified' });
        }

        const origin = new URL(req.url).origin;
        return NextResponse.redirect(`${origin}/auth?mode=login&verified=1`);
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('Email confirmation error:', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
