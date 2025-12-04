'use client';
import React, { useEffect, useState } from 'react';

export default function AdminSettingsPanel() {
    const [admin, setAdmin] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/info').then((r) => r.json()).then((j) => {
            if (j?.admin) setAdmin(j.admin);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-4 bg-white rounded shadow animate-pulse h-40" />;

    return (
        <div className="bg-white p-4 rounded shadow space-y-4">
            <h3 className="text-lg text-slate-400 font-semibold">Admin profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-slate-300">Name</div>
                    <div className="text-slate-500 font-medium">{admin?.name}</div>

                    <div className="text-sm text-slate-500 mt-3">Email</div>
                    <div className="text-slate-500 font-medium">{admin?.email}</div>
                </div>

                <div>
                    <div className="text-sm text-slate-300">Current IP</div>
                    <div className="text-slate-500 font-medium">{admin?.lastLoginIp || '—'}</div>

                    <div className="text-sm text-slate-300 mt-3">Created</div>
                    <div className="text-slate-500 font-medium">{admin?.createdAt ? new Date(admin.createdAt).toLocaleString() : '—'}</div>
                </div>
            </div>
        </div>
    );
}
