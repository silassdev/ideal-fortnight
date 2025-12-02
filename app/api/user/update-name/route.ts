import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions as any);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Invalid name provided' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOneAndUpdate(
            { email: session.user.email.toLowerCase() },
            { name: name.trim() },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            name: user.name
        });
    } catch (error: any) {
        console.error('Update name error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update name' },
            { status: 500 }
        );
    }
}
