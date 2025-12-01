import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { signJwt } from '@/lib/jwt';
import { sendResetPasswordEmail } from '@/lib/email';
import { getClientIpFromRequest, lookupIp } from '@/lib/geoip';

type Body = { email?: string };

export async function POST(req: Request) {
    try {
        const body = (await req.json().catch(() => ({}))) as Body;
        const email = (body.email || '').toLowerCase().trim();
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        await dbConnect();
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'If that email exists we sent a reset link' }, { status: 200 });
        }

        const token = signJwt({ sub: user._id.toString(), email }, { expiresIn: '1h' });

        user.resetToken = token;
        user.resetRequestedAt = new Date();

        const ip = getClientIpFromRequest(req);
        const geo = lookupIp(ip);
        user.lastResetRequestIp = geo?.ip || ip || null;
        user.lastResetRequestGeo = geo || null;

        await user.save();

        try {
            await sendResetPasswordEmail(email, token);
        } catch (err) {
            console.error('sendResetPasswordEmail failed:', err);
        }

        return NextResponse.json({ message: 'If that email exists we sent a reset link' }, { status: 200 });
    } catch (err: any) {
        console.error('reset-request error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
