import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
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

    try {
        const client = await clientPromise;
        const db = client.db();
        const downloads = db.collection('downloads');

        const perWeek = await downloads.aggregate([
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: -1 } },
            { $limit: 365 },
        ]).toArray();

        const perYear = await downloads.aggregate([
            { $group: { _id: { $substr: [{ $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, 0, 4] }, count: { $sum: 1 } } },
            { $sort: { _id: -1 } },
        ]).toArray();

        const byCountry = await downloads.aggregate([
            { $match: { country: { $exists: true, $ne: null } } },
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 100 },
        ]).toArray();

        return NextResponse.json({
            perDay: perWeek.map((r) => ({ day: r._id, count: r.count })),
            perYear: perYear.map((r) => ({ year: r._id, count: r.count })),
            byCountry: byCountry.map((r) => ({ country: r._id, count: r.count })),
        });
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('downloads stats error', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
