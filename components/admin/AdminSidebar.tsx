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
            <div className="bg-white p-4 rounded shadow space-y-4 text-slate-500">
                <div className="text-sm">Admin</div>

                <nav className="space-y-1" aria-label="Admin sections">
                    {items.map((it) => (
                        <SidebarItem
                            key={it.key}
                            label={it.label}
                            isActive={view === it.key}
                            onClick={() => setView(it.key as any)}
                        />
                    ))}
                </nav>

                <div className="pt-4 border-t">
                    <div className="text-xs">Quick actions</div>
                    <div className="mt-2 flex flex-col gap-2">
                        <button className="px-3 py-2 border rounded text-sm">Export users CSV</button>
                        <button className="px-3 py-2 border rounded text-sm">Purge test accounts</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            // group lets us recolor nested elements when active
            className={`
        relative group w-full text-left flex items-center gap-3
        rounded px-3 py-2
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300
        ${isActive ? 'bg-sky-50 text-slate-800 font-medium' : 'hover:bg-slate-50'}
      `}
            type="button"
        >
            {/* left accent indicator — absolute so it doesn't affect button padding */}
            <span
                className={`
          absolute left-0 top-0 bottom-0 w-1 rounded-r-md
          transform origin-center transition-all duration-150
          ${isActive ? 'bg-sky-500 opacity-100 scale-y-100' : 'bg-sky-500 opacity-0 scale-y-75'}
        `}
                aria-hidden
            />

            {/* optional small icon slot (use a simple circle here as example) */}
            <span
                className={`flex-shrink-0 w-3 h-3 rounded-full transition-colors duration-150 ${isActive ? 'bg-sky-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}
                aria-hidden
            />

            {/* label — keep text color inherited from parent card (text-slate-500) except when active */}
            <span className="truncate">{label}</span>
        </button>
    );
}
