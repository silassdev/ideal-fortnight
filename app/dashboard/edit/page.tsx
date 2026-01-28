
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

    // Fetch existing resume data to see which template they used
    const resume = await Resume.findOne({ userId: session.user.id }).lean();
    const template = resume?.template || 'starter';

    // Redirect to the new unified editor
    redirect(`/dashboard/template/${template}`);
}
