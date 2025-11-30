import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyJwt } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const token = url.searchParams.get('token') || '';

        if (!token) {
            return NextResponse.redirect(new URL('/auth/confirm-failed', req.url));
        }

        const payload = verifyJwt(token);
        if (!payload || !payload.sub) {
            return NextResponse.redirect(new URL('/auth/confirm-failed', req.url));
        }

        await dbConnect();
        const userId = payload.sub;
        const emailFromToken = (payload as any).email as string | undefined;

        const user = (await User.findById(userId)) || (emailFromToken ? await User.findOne({ email: emailFromToken }) : null);
        if (!user) {
            return NextResponse.redirect(new URL('/auth/confirm-failed', req.url));
        }

        // if token stored on user, ensure match
        if (user.verificationToken && user.verificationToken !== token) {
            return NextResponse.redirect(new URL('/auth/confirm-failed', req.url));
        }

        // mark verified
        user.isVerified = true;
        user.verificationToken = null;
        user.verifiedAt = new Date();
        await user.save();

        // redirect to a client success page (shows confetti + proceed to login)
        return NextResponse.redirect(new URL('/auth/confirmed', req.url));
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Email confirmation error:', err);
        return NextResponse.redirect(new URL('/auth/confirm-failed', req.url));
    }
}
