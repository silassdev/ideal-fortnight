import { NextResponse } from 'next/server';
import { suggestTemplateWithGemini } from '@/lib/ai/gemini';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import { Session } from 'next-auth';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions as any) as Session | null;
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const details = body.details || {};
    if (!details) return NextResponse.json({ error: 'Missing details' }, { status: 400 });

    try {
        const suggestion = await suggestTemplateWithGemini(details);
        return NextResponse.json({ ok: true, suggestion });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'AI error' }, { status: 500 });
    }
}
