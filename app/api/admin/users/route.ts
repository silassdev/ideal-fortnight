import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const requester = await User.findOne({ email: (session.user.email as string).toLowerCase() }).lean();
    if (!requester || requester.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
        const user = await User.findById(userId).lean();
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        return NextResponse.json({ user });
    }

    const q = (url.searchParams.get('q') || '').trim();
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '20', 10));

    const filter: any = {};
    if (q) {
        filter.$or = [
            { email: { $regex: q, $options: 'i' } },
            { name: { $regex: q, $options: 'i' } },
        ];
    }

    const skip = Math.max(0, page - 1) * limit;
    const [items, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('name email createdAt country role lastLoginIp isVerified').lean(),
        User.countDocuments(filter),
    ]);

    return NextResponse.json({ items, total, page, limit }, { status: 200 });
}
