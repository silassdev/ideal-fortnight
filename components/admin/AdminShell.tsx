'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import OverviewPanel from './OverviewPanel';
import UserPanel from './UserPanel';
import DownloadsPanel from './DashboardPanel';
import AdminSettingsPanel from './AdminsSettingsPanel';

export default function AdminShell() {
    const [view, setView] = useState<'overview' | 'users' | 'downloads' | 'settings'>('overview');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <aside className="lg:col-span-1">
                <AdminSidebar view={view} setView={setView} />
            </aside>

            <main className="lg:col-span-5 space-y-6">
                {view === 'overview' && <OverviewPanel />}
                {view === 'users' && <UserPanel />}
                {view === 'downloads' && <DownloadsPanel />}
                {view === 'settings' && <AdminSettingsPanel />}
            </main>
        </div>
    );
}
