
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import dbConnect from '@/lib/dbConnect';
import Resume from '@/models/Resume';
import ResumeEditorClient from '@/components/editor/ResumeEditorClient';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Edit Resume',
};

export default async function EditResumePage() {
    const session: any = await getServerSession(authOptions as any);

    if (!session?.user?.id) {
        redirect('/?auth=login');
    }

    await dbConnect();

    // Fetch existing resume data
    const resume = await Resume.findOne({ userId: session.user.id }).lean();

    // Serialize data
    const initialData = resume ? JSON.parse(JSON.stringify(resume)) : null;

    return (
        <div className="min-h-screen bg-slate-50">
            <ResumeEditorClient initialData={initialData} />
        </div>
    );
}
