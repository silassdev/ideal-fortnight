import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';

export async function GET() {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const admin = await User.findOne({ email: (session.user.email as string).toLowerCase() }).select('name email lastLoginIp createdIp role').lean();
    if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    return NextResponse.json({ admin });
}
