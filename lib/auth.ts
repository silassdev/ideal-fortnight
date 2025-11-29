import { getServerSession } from 'next-auth/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './nextAuth';
import { verifyJwt } from './jwt';
import clientPromise from './mongodb';

/**
 * Try to obtain the currently authenticated user's id (server-side).
 * Order:
 *  1. NextAuth session (Google or other provider)
 *  2. Authorization: Bearer <token> (JWT issued by your email/password login)
 *
 * Returns: { userId } or null if unauthenticated.
 *
 * Use in API routes to protect endpoints.
 */
export async function getServerUserId(req: NextApiRequest, res: NextApiResponse) {
    // 1. NextAuth session check
    try {
        const session = await getServerSession(req, res, authOptions as any) as any;
        if (session?.user?.id) {
            return session.user.id as string;
        }
        // Some NextAuth adapters put id in session.sub - handle both
        if (session?.sub) {
            return session.sub as string;
        }
    } catch (e) {
        // ignore and continue to JWT check
    }

    // 2. JWT in Authorization header
    const authHeader = req.headers['authorization'] || '';
    const match = typeof authHeader === 'string' ? authHeader.match(/^Bearer (.+)$/) : null;
    const token = match ? match[1] : null;

    if (token) {
        const payload = verifyJwt(token);
        if (payload && payload.sub) return payload.sub;
    }

    // 3. JWT in cookies (optional) - check cookie named 'token'
    const cookieHeader = req.headers['cookie'] || '';
    const cookies = cookieHeader
        .split(';')
        .map((c) => c.trim().split('='))
        .reduce<Record<string, string>>((acc, [k, v]) => {
            if (k && v) acc[k] = decodeURIComponent(v);
            return acc;
        }, {});
    if (cookies.token) {
        const payload = verifyJwt(cookies.token);
        if (payload && payload.sub) return payload.sub;
    }

    return null;
}
