'use client';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

type Props = { userId: string; onClose: () => void; onDelete?: () => void };

export default function UserModal({ userId, onClose, onDelete }: Props) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetch('/api/admin/users?userId=' + encodeURIComponent(userId))
            .then((r) => r.json())
            .then((json) => { if (mounted) setUser(json.user || null); })
            .catch(() => { })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [userId]);

    async function handleDelete() {
        if (!confirm('Delete user and all data?')) return;
        const res = await fetch('/api/admin/users/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: userId }) });
        const json = await res.json();
        if (json?.ok) {
            alert('Deleted');
            onDelete?.();
            onClose();
        } else {
            alert(json?.error || 'Delete failed');
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl bg-white rounded shadow p-4 overflow-auto max-h-[90vh]">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg text-slate-500 font-semibold">User details</h3>
                    <button onClick={onClose} className="px-2 text-slate-400 py-1 border rounded">Close</button>
                </div>

                {loading ? <div className="mt-4 space-y-2"><div className="h-6 bg-slate-100 rounded animate-pulse" /></div> : (
                    <>
                        {user ? (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Full name</div>
                                    <div className="font-medium text-slate-900 text-lg">{user.name || '—'}</div>

                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mt-4 mb-1">Email</div>
                                    <div className="text-slate-700">{user.email}</div>

                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mt-4 mb-1">Country</div>
                                    <div className="flex items-center gap-2">
                                        {user.country ? (
                                            <>
                                                <span className="text-slate-700 font-medium">
                                                    {new Intl.DisplayNames(['en'], { type: 'region' }).of(user.country) || user.country}
                                                </span>
                                                <img
                                                    src={`https://flagcdn.com/24x18/${user.country.toLowerCase()}.png`}
                                                    alt={user.country}
                                                    className="rounded-sm shadow-sm"
                                                />
                                            </>
                                        ) : (
                                            <span className="text-slate-700 font-medium">—</span>
                                        )}
                                    </div>

                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mt-4 mb-1">Joined</div>
                                    <div className="text-slate-700">{user.createdAt ? dayjs(user.createdAt).format('MMM D, YYYY • h:mm A') : '—'}</div>
                                </div>

                                <div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Last login IP</div>
                                    <div className="font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block text-sm">{user.lastLoginIp || '—'}</div>

                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mt-4 mb-1">Role</div>
                                    <div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {user.role || 'user'}
                                        </span>
                                    </div>

                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mt-4 mb-1">Status</div>
                                    <div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {user.isVerified ? 'Verified' : 'Pending Verification'}
                                        </span>
                                    </div>
                                </div>

                                <div className="md:col-span-2 mt-3">
                                    <div className="flex gap-2">
                                        <button onClick={handleDelete} className="px-3 py-2 bg-red-600 text-white rounded">Delete user</button>
                                        <button onClick={onClose} className="px-3 py-2 text-slate-600 border rounded">Close</button>
                                    </div>
                                </div>
                            </div>
                        ) : <div className="mt-4 text-sm text-slate-500">User not found</div>}
                    </>
                )}
            </div>
        </div>
    );
}
