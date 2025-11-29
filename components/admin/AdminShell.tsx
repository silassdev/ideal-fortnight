'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminAnalytics from './AdminAnalytics';

export default function AdminShell() {
    const [view, setView] = useState<'overview' | 'users' | 'downloads' | 'settings'>('overview');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <aside className="lg:col-span-1">
                <AdminSidebar view={view} setView={setView} />
            </aside>

            <main className="lg:col-span-5 space-y-6">
                {view === 'overview' && <AdminAnalytics />}
                {view === 'users' && <AdminAnalytics tab="users" />}
                {view === 'downloads' && <AdminAnalytics tab="downloads" />}
                {view === 'settings' && (
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold">Admin Settings</h2>
                        <p className="text-sm text-gray-500">Manage admin preferences.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
