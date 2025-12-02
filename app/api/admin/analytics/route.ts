import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Resume from '@/models/Resume';
import clientPromise from '@/lib/mongodb';
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
        // new users last 14 days
        const now = new Date();
        const start = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 13); // 14 days total
        const usersAgg = await User.aggregate([
            { $match: { createdAt: { $gte: start } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const usersByCountryAgg = await User.aggregate([
            { $match: { country: { $exists: true, $ne: null } } },
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 50 },
        ]);

        const totalUsers = await User.countDocuments({});
        const totalTemplates = await Resume.countDocuments({}); // templates used equals number of saved resumes
        // downloads
        let totalDownloads = 0;
        let downloadsByCountry: any[] = [];
        try {
            const client = await clientPromise;
            const db = client.db();
            totalDownloads = await db.collection('downloads').countDocuments({});
            downloadsByCountry = await db
                .collection('downloads')
                .aggregate([
                    { $match: { country: { $exists: true, $ne: null } } },
                    { $group: { _id: '$country', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 50 },
                ])
                .toArray();
        } catch (err) {
            // ignore
            // eslint-disable-next-line no-console
            console.warn('downloads agg failed', err);
        }

        return NextResponse.json({
            newUsersDaily: usersAgg.map((r) => ({ day: r._id, count: r.count })),
            usersByCountry: usersByCountryAgg.map((r) => ({ country: r._id, count: r.count })),
            totals: { totalUsers, totalTemplates, totalDownloads },
            downloadsByCountry: downloadsByCountry.map((r) => ({ country: r._id, count: r.count || 0 })),
        });
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('analytics error', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
