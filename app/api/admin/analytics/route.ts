import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Resume from '@/models/Resume';
import clientPromise from '@/lib/mongodb';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // verify requester is admin
    const requester = await User.findOne({ email: (session.user.email as string).toLowerCase() }).lean();
    if (!requester || requester.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        // totals
        const totalUsersPromise = User.countDocuments({});
        const pendingRegistrationsPromise = User.countDocuments({ isVerified: false });
        const confirmedAccountsPromise = User.countDocuments({ isVerified: true });
        const roleCountsAggPromise = User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
        const recentUsersPromise = User.find({})
            .sort({ createdAt: -1 })
            .limit(200)
            .select('name email country lastLoginIp isVerified role createdAt')
            .lean();
        const totalResumesPromise = Resume.countDocuments({});

        const [
            totalUsers,
            pendingRegistrations,
            confirmedAccounts,
            roleCountsAgg,
            recentUsers,
            totalResumes,
        ] = await Promise.all([
            totalUsersPromise,
            pendingRegistrationsPromise,
            confirmedAccountsPromise,
            roleCountsAggPromise,
            recentUsersPromise,
            totalResumesPromise,
        ]);

        const roleCounts: Record<string, number> = {};
        roleCountsAgg.forEach((r: any) => (roleCounts[r._id || 'unknown'] = r.count));

        // users by country aggregation
        const usersByCountryAgg = await User.aggregate([
            { $match: { country: { $exists: true, $ne: null } } },
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 50 },
        ]);

        const usersByCountry = usersByCountryAgg.map((r: any) => ({
            country: r._id,
            count: r.count,
        }));

        // downloads by country (native collection)
        let downloadsByCountry: { country: string | null; count: number }[] = [];
        try {
            const client = await clientPromise;
            const db = client.db();
            const downloadsColl = db.collection('downloads');
            const dlAgg = await downloadsColl
                .aggregate([
                    { $match: { country: { $exists: true, $ne: null } } },
                    { $group: { _id: '$country', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 50 },
                ])
                .toArray();
            downloadsByCountry = dlAgg.map((r: any) => ({ country: r._id, count: r.count }));
        } catch (err) {
            // if downloads collection doesn't exist or error occurs, keep empty
            // eslint-disable-next-line no-console
            console.warn('downloads aggregation failed:', err);
            downloadsByCountry = [];
        }

        return NextResponse.json({
            totalUsers,
            pendingRegistrations,
            confirmedAccounts,
            roleCounts,
            users: recentUsers.map((u) => ({
                name: u.name,
                email: u.email,
                country: (u as any).country || null,
                lastLoginIp: (u as any).lastLoginIp || null,
                isVerified: u.isVerified,
                role: u.role,
                createdAt: u.createdAt,
            })),
            totalResumes,
            usersByCountry,
            downloadsByCountry,
        });
    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('analytics error:', err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
