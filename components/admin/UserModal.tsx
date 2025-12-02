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
                    <h3 className="text-lg font-semibold">User details</h3>
                    <button onClick={onClose} className="px-2 py-1 border rounded">Close</button>
                </div>

                {loading ? <div className="mt-4 space-y-2"><div className="h-6 bg-slate-100 rounded animate-pulse" /></div> : (
                    <>
                        {user ? (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-slate-500">Full name</div>
                                    <div className="font-medium">{user.name || '—'}</div>

                                    <div className="text-sm text-slate-500 mt-3">Email</div>
                                    <div>{user.email}</div>

                                    <div className="text-sm text-slate-500 mt-3">Country</div>
                                    <div>{user.country || '—'}</div>

                                    <div className="text-sm text-slate-500 mt-3">Joined</div>
                                    <div>{user.createdAt ? dayjs(user.createdAt).format('YYYY-MM-DD HH:mm') : '—'}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-slate-500">Last login IP</div>
                                    <div>{user.lastLoginIp || '—'}</div>

                                    <div className="text-sm text-slate-500 mt-3">Role</div>
                                    <div>{user.role || 'user'}</div>

                                    <div className="text-sm text-slate-500 mt-3">Verified</div>
                                    <div>{user.isVerified ? 'Yes' : 'No'}</div>
                                </div>

                                <div className="md:col-span-2 mt-3">
                                    <div className="flex gap-2">
                                        <button onClick={handleDelete} className="px-3 py-2 bg-red-600 text-white rounded">Delete user</button>
                                        <button onClick={onClose} className="px-3 py-2 border rounded">Close</button>
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
