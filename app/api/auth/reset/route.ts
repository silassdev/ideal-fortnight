import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyJwt } from '@/lib/jwt';
import { hashPassword } from '@/lib/hash';

type Body = { token?: string; password?: string };

export async function POST(req: Request) {
    try {
        const body = (await req.json().catch(() => ({}))) as Body;
        const token = body.token || '';
        const newPassword = body.password || '';
        if (!token || !newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const payload = verifyJwt(token);
        if (!payload || !payload.sub) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(payload.sub);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // require token to match stored one (single-use)
        if (!user.resetToken || user.resetToken !== token) {
            return NextResponse.json({ error: 'Token does not match or already used' }, { status: 400 });
        }

        // hash and set new password
        user.passwordHash = await hashPassword(newPassword);
        user.resetToken = null;
        user.resetRequestedAt = null;
        user.verifiedAt = user.verifiedAt ?? undefined;
        // ensure user is verified after resetting (optional)
        user.isVerified = true;
        await user.save();

        return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('reset error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
