import React from 'react';

export const metadata = {
    title: 'Dashboard — Resume Builder',
};

export default function DashboardPage() {
    return (
        <main className="min-h-screen p-6 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="mt-2 text-sm text-slate-600">Your resumes will appear here.</p>
            </div>
        </main>
    );
}
