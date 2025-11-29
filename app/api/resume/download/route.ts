// app/api/resume/download/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import dbConnect from '@/lib/dbConnect';
import Resume from '@/models/Resume';
import User from '@/models/User';
import clientPromise from '@/lib/mongodb';
import { verifyJwt } from '@/lib/jwt';

type Body = {
    resumeId?: string; // optional; if absent, fetch current user's resume
};

async function getUserIdFromRequest(req: Request) {
    // Try NextAuth session first
    try {
        const session: any = await getServerSession(authOptions as any);
        if (session && session.user && (session.user as any).id) {
            return (session.user as any).id as string;
        }
        if (session && session.user && session.user.email) {
            // fallback: lookup user by email
            await dbConnect();
            const u = await User.findOne({ email: (session.user.email as string).toLowerCase() }).lean();
            if (u) return u._id.toString();
        }
    } catch (e) {
        // ignore and continue to JWT cookie
    }

    // Check cookie 'token'
    try {
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
    } catch (e) {
        // ignore
    }

    return null;
}

export async function POST(req: Request) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();

        const body: Body = await req.json().catch(() => ({}));
        let resumeDoc = null;

        if (body.resumeId) {
            resumeDoc = await Resume.findById(body.resumeId).lean();
            if (!resumeDoc) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
            // enforce that only owner or admin can download arbitrary resume
            const requester = await User.findById(userId).lean();
            if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            if (requester.role !== 'admin' && resumeDoc.userId?.toString() !== userId) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        } else {
            // fetch current user's resume
            resumeDoc = await Resume.findOne({ userId }).lean();
            if (!resumeDoc) return NextResponse.json({ error: 'No resume found for user' }, { status: 404 });
        }

        // Log download to native DB "downloads" collection
        try {
            const client = await clientPromise;
            const db = client.db();
            const headers = new Headers(req.headers as any);
            const forwarded = headers.get('x-forwarded-for') || headers.get('x-real-ip') || null;
            const ip = forwarded ? forwarded.split(',')[0].trim() : null;
            const country = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || null;

            await db.collection('downloads').insertOne({
                userId,
                resumeId: resumeDoc._id?.toString ? resumeDoc._id.toString() : resumeDoc._id,
                ip,
                country,
                createdAt: new Date(),
            });
        } catch (err) {
            // Log but continue
            // eslint-disable-next-line no-console
            console.error('Failed to log download:', err);
        }

        // Return resume JSON so client can perform download/export
        return NextResponse.json({ ok: true, resume: resumeDoc }, { status: 200 });
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('Download endpoint error:', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
