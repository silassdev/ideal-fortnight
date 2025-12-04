import { NextResponse } from 'next/server';
import { del } from '@/lib/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import dbConnect from '@/lib/dbConnect';
import Resume from '@/models/Resume';

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions as any);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const resume = await Resume.findOne({ userId: session.user.id }).lean();

        return NextResponse.json(resume || null);
    } catch (error) {
        console.error('Error fetching resume:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions as any);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        // Use the static upsert method
        const resume = await Resume.upsertByUser(session.user.id, body);

        try {
            await del('admin:analytics:overview');
        } catch (e) {
            console.warn('Cache invalidation failed after resume save:', e);
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.error('Error saving resume:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
