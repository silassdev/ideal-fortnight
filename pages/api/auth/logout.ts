import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

type Data = { ok: boolean; message?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ ok: false, message: 'Method not allowed' });

    // Overwrite cookie to expire immediately
    const cookie = serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ ok: true, message: 'Logged out' });
}
