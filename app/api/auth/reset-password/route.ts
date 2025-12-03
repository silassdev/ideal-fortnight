import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { hashPassword, verifyPassword } from '@/lib/hash';

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        await dbConnect();

        // Find all users with reset tokens (we'll verify the token hash)
        const users = await User.find({ resetToken: { $ne: null } });

        let matchedUser = null;

        // Check each user's hashed token
        for (const user of users) {
            if (user.resetToken) {
                const isValid = await verifyPassword(token, user.resetToken);
                if (isValid) {
                    matchedUser = user;
                    break;
                }
            }
        }

        if (!matchedUser) {
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
        }

        // Check if token is expired (1 hour)
        const tokenAge = Date.now() - (matchedUser.resetRequestedAt?.getTime() || 0);
        const oneHour = 60 * 60 * 1000;

        if (tokenAge > oneHour) {
            // Clear expired token
            matchedUser.resetToken = null;
            matchedUser.resetRequestedAt = null;
            await matchedUser.save();
            return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
        }

        // Hash new password
        const newPasswordHash = await hashPassword(password);

        // Update password and clear reset token
        matchedUser.passwordHash = newPasswordHash;
        matchedUser.resetToken = null;
        matchedUser.resetRequestedAt = null;

        await matchedUser.save();

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully'
        });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
