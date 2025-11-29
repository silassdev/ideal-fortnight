import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyPassword } from '@/lib/hash';
import { signJwt } from '@/lib/jwt';
import { serialize } from 'cookie';

type Data = { ok: boolean; message?: string; user?: { id: string; email: string } };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

    const { email, password, remember } = req.body as { email?: string; password?: string; remember?: boolean };

    if (!email || !password) return res.status(400).json({ ok: false, message: 'Email and password required' });

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() }).exec();
    if (!user || !user.passwordHash) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ ok: false, message: 'Please confirm your email before logging in' });

    const passwordOk = await verifyPassword(password, user.passwordHash);
    if (!passwordOk) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

    // Create auth JWT and set as httpOnly cookie
    const tokenExpiry = remember ? '30d' : '7d';
    const jwtToken = signJwt({ sub: String(user._id), email: user.email }, { expiresIn: tokenExpiry });

    // Serialize cookie
    const maxAgeSeconds = remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30d or 7d
    const cookie = serialize('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: maxAgeSeconds,
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({ ok: true, user: { id: String(user._id), email: user.email } });
}
