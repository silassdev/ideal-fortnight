import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { hashPassword } from '@/lib/hash';
import { signJwt } from '@/lib/jwt';
import { sendVerificationEmail } from '@/lib/email';

type Data = { ok: boolean; message?: string };

function validateEmail(email: string) {
    return /^\S+@\S+\.\S+$/.test(email);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) return res.status(400).json({ ok: false, message: 'Email and password are required' });
    if (!validateEmail(email)) return res.status(400).json({ ok: false, message: 'Invalid email' });
    if (String(password).length < 8) return res.status(400).json({ ok: false, message: 'Password must be >= 8 characters' });

    await dbConnect();

    // Check existing user
    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
        // If user exists but not verified, optionally resend verification email
        if (!existing.isVerified) {
            // Create a short verification token and send email again
            const token = signJwt({ sub: String(existing._id), email: existing.email }, { expiresIn: '1d' });
            try {
                await sendVerificationEmail(existing.email, token);
                return res.status(200).json({ ok: true, message: 'Verification email resent. Check your email.' });
            } catch (err) {
                console.error('Failed to resend verification email:', err);
                return res.status(500).json({ ok: false, message: 'Failed to send verification email' });
            }
        }
        return res.status(409).json({ ok: false, message: 'Email already registered' });
    }

    try {
        const passwordHash = await hashPassword(password);
        const user = await User.create({ email: email.toLowerCase(), passwordHash, isVerified: false });

        // Generate verification token (short expiry)
        const token = signJwt({ sub: String(user._id), email: user.email }, { expiresIn: '1d' });

        // Send verification email (throws if SMTP not configured)
        await sendVerificationEmail(user.email, token);

        return res.status(201).json({ ok: true, message: 'Registered. Check your email to confirm account.' });
    } catch (err) {
        console.error('Registration failed:', err);
        return res.status(500).json({ ok: false, message: 'Registration failed' });
    }
}
