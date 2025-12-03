import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendResetPasswordEmail } from '@/lib/email';
import { hashPassword } from '@/lib/hash';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // Always return success to prevent email enumeration
        // But only send email if user exists
        if (user) {
            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');

            // Hash the token before storing
            const hashedToken = await hashPassword(resetToken);

            // Save hashed token and timestamp to user
            user.resetToken = hashedToken;
            user.resetRequestedAt = new Date();

            // Store IP if available
            const forwarded = req.headers.get('x-forwarded-for');
            const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
            user.lastResetRequestIp = ip;

            await user.save();

            // Send email with unhashed token
            await sendResetPasswordEmail(user.email, resetToken);
        }

        // Always return success
        return NextResponse.json({
            success: true,
            message: 'If an account exists with that email, a password reset link has been sent.'
        });

    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
