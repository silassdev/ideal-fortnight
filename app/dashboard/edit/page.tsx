
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import dbConnect from '@/lib/dbConnect';
import Resume from '@/models/Resume';
import AuroraEditor from '@/components/templates/aurora';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Edit Resume — Aurora',
};

export default async function EditResumePage() {
    const session: any = await getServerSession(authOptions as any);

    if (!session?.user?.id) {
        redirect('/?auth=login');
    }

    await dbConnect();

    // Fetch existing resume data
    // We use .lean() to get a plain JS object, but we need to handle the conversion of _id and Dates if sending to client component
    // However, AuroraEditor expects a specific shape. We might need to map it if the DB shape is different from our internal shape.
    // For now, assuming the DB stores strictly what we send it.
    const resume = await Resume.findOne({ userId: session.user.id }).lean();

    // If resume exists, we pass it. If not, AuroraEditor will use its default.
    // We strip MongoDB specific fields like _id if they interfere, or just pass the whole thing casted.
    const initialData = resume ? JSON.parse(JSON.stringify(resume)) : null;

    return (
        <div className="min-h-screen bg-slate-50">
            <AuroraEditor initialData={initialData} />
        </div>
    );
}
