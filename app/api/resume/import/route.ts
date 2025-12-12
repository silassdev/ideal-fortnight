import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Resume from '@/models/Resume';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import { delMany } from '@/lib/cache';
import { Session } from 'next-auth';

type ImportBody = {
    resume: any;
};

export async function POST(req: Request) {
    const session = await getServerSession(authOptions as any) as Session | null;
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({})) as ImportBody;
    if (!body?.resume) return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email: (session.user.email as string).toLowerCase() });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const payload: any = {
        userId: user._id,
        name: body.resume.name || user.name || '',
        template: body.resume.template || 'apela',
        title: body.resume.title || '',
        summary: body.resume.summary || '',
        contact: body.resume.contact || {},
        experience: body.resume.experience?.map((e: any, i: number) => ({
            id: e.id || `imp-${i}`,
            company: e.company || '',
            role: e.role || '',
            start: e.startDate || e.start || '',
            end: e.endDate || e.end || '',
            location: e.location || '',
            bullets: (e.description ? [String(e.description)] : (e.bullets || [])) || []
        })) || [],
        education: body.resume.education || [],
        skills: body.resume.skills || [],
        meta: { importedAt: new Date(), importedFrom: body.resume.meta?.importedFrom || 'drag-drop' },
    };

    try {
        // upsert one-per-user
        const doc = await Resume.findOneAndUpdate({ userId: user._id }, { $set: payload }, { upsert: true, new: true, setDefaultsOnInsert: true });
        // invalidate admin caches
        try { await delMany(['admin:analytics:overview', 'admin:downloads:stats']); } catch { }
        return NextResponse.json({ ok: true, resume: doc }, { status: 200 });
    } catch (err: any) {
        console.error('import error', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
