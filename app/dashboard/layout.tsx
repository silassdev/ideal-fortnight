import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const metadata = {
    title: "Dashboard — Resume Builder",
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        // redirect to authentication
        redirect("/auth?mode=login");
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-lg font-semibold">Resume Builder</div>
                    <div className="text-sm text-slate-600">Signed in as {session.user?.email}</div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>

            <footer className="mt-10 border-t bg-white">
                <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-slate-500">
                    © {new Date().getFullYear()} ALLPILAR SOLUTIONS — Resume Builder
                </div>
            </footer>
        </div>
    );
}
