// components/admin/AdminAnalytics.tsx
'use client';

import React, { useEffect, useState } from 'react';

type UserRow = {
    name?: string;
    email: string;
    country?: string | null;
    lastLoginIp?: string | null;
    isVerified?: boolean;
    role?: string;
    createdAt?: string;
};

type Analytics = {
    totalUsers: number;
    pendingRegistrations: number;
    confirmedAccounts: number;
    roleCounts: Record<string, number>;
    totalResumes: number;
    totalDownloads: number;
    users: UserRow[];
};

export default function AdminAnalytics({ tab = 'overview' as 'overview' | 'users' | 'downloads' }) {
    const [data, setData] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetch('/api/admin/analytics', { credentials: 'include' })
            .then((r) => r.json())
            .then((json) => {
                if (!mounted) return;
                setData(json);
            })
            .catch((err) => {
                console.error(err);
                if (mounted) setError(err.message || 'Failed to load analytics');
            })
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-slate-200 animate-pulse rounded w-48" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="h-24 bg-slate-200 animate-pulse rounded" />
                    <div className="h-24 bg-slate-200 animate-pulse rounded" />
                    <div className="h-24 bg-slate-200 animate-pulse rounded" />
                    <div className="h-24 bg-slate-200 animate-pulse rounded" />
                </div>
            </div>
        );
    }

    if (error) return <div className="text-red-600">{error}</div>;
    if (!data) return <div>No analytics available.</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded shadow flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Overview</h2>
                    <div className="text-sm text-slate-500">Quick summary of users and resume activity</div>
                </div>

                <div className="flex gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{data.totalUsers}</div>
                        <div className="text-xs text-slate-500">Total users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{data.totalResumes}</div>
                        <div className="text-xs text-slate-500">Resumes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{data.totalDownloads}</div>
                        <div className="text-xs text-slate-500">Downloads</div>
                    </div>
                </div>
            </div>

            {/* Role breakdown */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-medium">Accounts</h3>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 border rounded">
                        <div className="text-sm text-slate-500">Confirmed</div>
                        <div className="text-lg font-semibold">{data.confirmedAccounts}</div>
                    </div>
                    <div className="p-3 border rounded">
                        <div className="text-sm text-slate-500">Pending verification</div>
                        <div className="text-lg font-semibold">{data.pendingRegistrations}</div>
                    </div>
                    <div className="p-3 border rounded">
                        <div className="text-sm text-slate-500">By role</div>
                        <div className="text-lg font-semibold">{Object.entries(data.roleCounts).map(([r, c]) => `${r}: ${c}`).join(' • ')}</div>
                    </div>
                </div>
            </div>

            {/* Users table */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-medium">Recent users</h3>
                <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-slate-500">
                                <th className="py-2">Name</th>
                                <th>Email</th>
                                <th>Country</th>
                                <th>IP</th>
                                <th>Status</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.slice(0, 50).map((u) => (
                                <tr key={u.email} className="border-t">
                                    <td className="py-2">{u.name || '—'}</td>
                                    <td>{u.email}</td>
                                    <td>{u.country || '—'}</td>
                                    <td>{u.lastLoginIp || '—'}</td>
                                    <td>{u.isVerified ? 'confirmed' : 'pending'}</td>
                                    <td>{u.role || 'user'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
