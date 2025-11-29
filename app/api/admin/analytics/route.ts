import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Resume from '@/models/Resume';
import { NextRequest } from 'next/server';

// Optional: if you track downloads in a dedicated collection
const DOWNLOADS_COLLECTION = 'downloads';

export async function GET(req: NextRequest) {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find requester in users collection to check role
    const requester = await User.findOne({ email: (session.user.email as string).toLowerCase() }).lean();
    if (!requester || requester.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Aggregations
    const totalUsers = await User.countDocuments({});
    const pendingRegistrations = await User.countDocuments({ isVerified: false });
    const confirmedAccounts = await User.countDocuments({ isVerified: true });

    // role counts
    const roleCountsAgg = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);
    const roleCounts: Record<string, number> = {};
    roleCountsAgg.forEach((r: any) => (roleCounts[r._id || 'unknown'] = r.count));

    // fetch recent users (with country & lastLoginIp fields if available)
    const users = await User.find({})
        .sort({ createdAt: -1 })
        .limit(200)
        .select('name email country lastLoginIp isVerified role createdAt')
        .lean();

    // resume count
    const totalResumes = await Resume.countDocuments({});

    // downloads count (best-effort: if collection exists)
    let totalDownloads = 0;
    try {
        const db = (await import('mongodb')).MongoClient;
        // easier approach: use the native clientPromise if available
        const clientPromise = (await import('@/lib/mongodb')).default;
        const client = await clientPromise;
        const dbInstance = client.db(); // DB from URI
        const collNames = await dbInstance.listCollections().toArray();
        const hasDownloads = collNames.some((c) => c.name === DOWNLOADS_COLLECTION);
        if (hasDownloads) {
            totalDownloads = await dbInstance.collection(DOWNLOADS_COLLECTION).countDocuments({});
        } else {
            totalDownloads = 0;
        }
    } catch (err) {
        // ignore, default to 0
        totalDownloads = 0;
    }

    return NextResponse.json({
        totalUsers,
        pendingRegistrations,
        confirmedAccounts,
        roleCounts,
        users: users.map((u) => ({
            name: u.name,
            email: u.email,
            country: (u as any).country || null,
            lastLoginIp: (u as any).lastLoginIp || null,
            isVerified: u.isVerified,
            role: u.role,
            createdAt: u.createdAt,
        })),
        totalResumes,
        totalDownloads,
    });
}
