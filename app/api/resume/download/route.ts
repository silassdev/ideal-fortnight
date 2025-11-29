import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import dbConnect from '@/lib/dbConnect';
import Resume from '@/models/Resume';
import User from '@/models/User';
import { verifyJwt } from '@/lib/jwt';
import { getClientIpFromRequest, lookupIp } from '@/lib/geoip';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import { NextRequest } from 'next/server';

async function getUserIdFromRequest(req: Request) {
    try {
        const session: any = await getServerSession(authOptions as any);
        if (session && session.user && (session.user as any).id) return (session.user as any).id as string;
        if (session && session.user && session.user.email) {
            await dbConnect();
            const u = await User.findOne({ email: (session.user.email as string).toLowerCase() }).lean();
            if (u) return u._id.toString();
        }
    } catch (e) {
        // ignore
    }

    const cookieHeader = (req.headers as any).get?.('cookie') || '';
    const cookies = cookieHeader
        .split(';')
        .map((c: string) => c.trim().split('='))
        .reduce((acc: Record<string, string>, [k, v]: string[]) => {
            if (k && v) acc[k] = decodeURIComponent(v);
            return acc;
        }, {});
    const token = cookies.token;
    if (token) {
        const payload = verifyJwt(token);
        if (payload && payload.sub) return payload.sub;
    }
    return null;
}

export async function POST(req: Request) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();

        const body = (await req.json().catch(() => ({}))) as { resumeId?: string };
        let resumeDoc = null;

        if (body.resumeId) {
            resumeDoc = await Resume.findById(body.resumeId).lean();
            if (!resumeDoc) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
            const requester = await User.findById(userId).lean();
            if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            if (requester.role !== 'admin' && resumeDoc.userId?.toString() !== userId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        } else {
            resumeDoc = await Resume.findOne({ userId }).lean();
            if (!resumeDoc) return NextResponse.json({ error: 'No resume found for user' }, { status: 404 });
        }

        const ip = getClientIpFromRequest(req);
        const geo = lookupIp(ip);

        try {
            const client = await clientPromise;
            const db = client.db();
            await db.collection('downloads').insertOne({
                userId,
                resumeId: resumeDoc._id?.toString ? resumeDoc._id.toString() : resumeDoc._id,
                ip: geo?.ip || ip || null,
                country: geo?.country || null,
                region: geo?.region || null,
                city: geo?.city || null,
                ipInfo: geo || null,
                createdAt: new Date(),
            });
        } catch (err) {
            console.error('Failed to log download:', err);
        }

        return NextResponse.json({ ok: true, resume: resumeDoc }, { status: 200 });
    } catch (err: any) {
        console.error('Download endpoint error:', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
