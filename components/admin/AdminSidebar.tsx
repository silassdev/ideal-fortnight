// components/admin/AdminSidebar.tsx
'use client';

import React from 'react';

export default function AdminSidebar({
    view,
    setView,
}: {
    view: string;
    setView: (v: 'overview' | 'users' | 'downloads' | 'settings') => void;
}) {
    const items = [
        { key: 'overview', label: 'Overview' },
        { key: 'users', label: 'Users' },
        { key: 'downloads', label: 'Downloads' },
        { key: 'settings', label: 'Settings' },
    ] as const;

    return (
        <div className="sticky top-8">
            <div className="bg-white p-4 rounded shadow space-y-4">
                <div className="text-sm text-slate-500">Admin</div>
                <nav className="space-y-1">
                    {items.map((it) => (
                        <button
                            key={it.key}
                            onClick={() => setView(it.key as any)}
                            className={`w-full text-left px-3 py-2 rounded ${view === it.key ? 'bg-sky-50 border border-sky-100' : 'hover:bg-slate-50'
                                }`}
                        >
                            {it.label}
                        </button>
                    ))}
                </nav>

                <div className="pt-4 border-t">
                    <div className="text-xs text-slate-500">Quick actions</div>
                    <div className="mt-2 flex flex-col gap-2">
                        <button className="px-3 py-2 border rounded text-sm">Export users CSV</button>
                        <button className="px-3 py-2 border rounded text-sm">Purge test accounts</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
