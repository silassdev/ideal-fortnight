import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const metadata = {
    title: 'Dashboard — Resume Builder',
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user?.email) {
        redirect('/auth?mode=login');
    }

    // find user in DB to get role (server-side)
    await dbConnect();
    const user = await User.findOne({ email: (session.user.email as string).toLowerCase() }).lean();

    if (!user) {
        return (
            <html lang="en">
                <body>
                    <div className="min-h-screen bg-slate-50">
                        <header className="bg-white border-b">
                            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                                <div className="text-lg font-semibold">Resume Builder</div>
                                <div className="text-sm text-slate-600">Signed in</div>
                            </div>
                        </header>

                        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
                    </div>
                </body>
            </html>
        );
    }

    if (user.role === 'admin') {
        // admin shell: render admin header + children (children should be admin pages)
        return (
            <html lang="en">
                <body>
                    <div className="min-h-screen bg-slate-50">
                        <header className="bg-white border-b">
                            <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
                                <div className="text-lg font-semibold">Resume Builder — Admin</div>
                                <div className="text-sm text-slate-600">Signed in as admin: {(user.email as string)}</div>
                            </div>
                        </header>

                        <div className="max-w-8xl mx-auto px-6 py-8">{children}</div>
                    </div>
                </body>
            </html>
        );
    }

    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-slate-50">
                    <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
                </div>
            </body>
        </html>
    );
}
