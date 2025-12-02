import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Resume from '@/models/Resume';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const requester = await User.findOne({ email: (session.user.email as string).toLowerCase() }).lean();
    if (!requester || requester.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    try {
        await Resume.deleteMany({ userId: id });
        try {
            const client = await clientPromise;
            const db = client.db();
            await db.collection('downloads').deleteMany({ userId: id });
        } catch (err) {
        }
        await User.deleteOne({ _id: id });
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error('delete user', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
