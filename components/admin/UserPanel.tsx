'use client';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import UserModal from './UserModal';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function UserPanel() {
    const [users, setUsers] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch users
    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/users?page=${page}&limit=20&q=${encodeURIComponent(debouncedSearch)}`)
            .then((r) => r.json())
            .then((json) => {
                setUsers(json.items || []);
                setTotal(json.total || 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, debouncedSearch]);

    const totalPages = Math.ceil(total / 20);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded shadow">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500">
                    Total: <span className="font-medium text-slate-900">{total}</span>
                </div>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Country</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Joined</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-100 rounded w-12" /></td>
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                                        <td className="px-4 py-3"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                                    </tr>
                                ))
                            ) : users.length > 0 ? (
                                users.map((u) => (
                                    <tr
                                        key={u._id}
                                        onClick={() => setSelectedUserId(u._id)}
                                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-900">{u.name || '—'}</td>
                                        <td className="px-4 py-3 text-slate-600">{u.email}</td>
                                        <td className="px-4 py-3 text-slate-600">{u.country || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {u.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{dayjs(u.createdAt).format('MMM D, YYYY')}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {u.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t flex items-center justify-between bg-slate-50">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-1 rounded hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <span className="text-sm text-slate-600">
                        Page {page} of {totalPages || 1}
                    </span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-1 rounded hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>

            {selectedUserId && (
                <UserModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    onDelete={() => {
                        // Refresh list
                        setPage(1);
                        setDebouncedSearch(s => s + ' '); // trigger effect
                    }}
                />
            )}
        </div>
    );
}
