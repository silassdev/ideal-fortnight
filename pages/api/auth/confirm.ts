import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyJwt } from '@/lib/jwt';

type Data = { ok: boolean; message?: string };

/**
 * GET /api/auth/confirm?token=...
 * If token valid, set user.isVerified = true
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'GET') return res.status(405).json({ ok: false, message: 'Method not allowed' });

    const token = Array.isArray(req.query.token) ? req.query.token[0] : (req.query.token as string | undefined);
    if (!token) return res.status(400).json({ ok: false, message: 'Missing token' });

    // Verify token
    const payload = verifyJwt(token);
    if (!payload || !payload.sub) return res.status(400).json({ ok: false, message: 'Invalid or expired token' });

    await dbConnect();

    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).json({ ok: false, message: 'User not found' });

    if (user.isVerified) return res.status(200).json({ ok: true, message: 'User already verified' });

    user.isVerified = true;
    await user.save();

    // Optionally redirect to your frontend confirmation page
    // const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/auth/confirmed`;
    // return res.redirect(302, redirectUrl);

    return res.status(200).json({ ok: true, message: 'Email confirmed. You can now login.' });
}
