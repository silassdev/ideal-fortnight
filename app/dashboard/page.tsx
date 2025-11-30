import React from 'react';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import dynamic from 'next/dynamic';

export const metadata = {
    title: 'Dashboard — Resume Builder',
};

const AdminShell = dynamic(() => import('@/components/admin/AdminShell'), { ssr: false });
const UserDashboardClient = dynamic(() => import('@/components/dashboard/UserDashboard'), { ssr: false });

export default async function Page() {
    const session = await getServerSession(authOptions as any);
    const userEmail = session?.user?.email;

    if (!userEmail) {
        // Layout already redirects but keep safe
        return <div className="p-8">Please sign in</div>;
    }

    await dbConnect();
    const user = await User.findOne({ email: (userEmail as string).toLowerCase() }).lean();

    if (user && user.role === 'admin') {
        return <AdminShell />;
    }

    return <UserDashboardClient />;
}

