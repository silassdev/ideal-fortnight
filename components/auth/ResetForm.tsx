'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ResetForm({ token }: { token?: string }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (password.length < 6) return setError('Password must be at least 6 characters');
        if (password !== confirm) return setError('Passwords do not match');

        setStatus('loading');
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            const json = await res.json();
            if (!res.ok) {
                setError(json?.error || 'Reset failed');
                setStatus('error');
                return;
            }
            setStatus('success');
        } catch (err: any) {
            setError(err?.message || 'Network error');
            setStatus('error');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white max-w-md w-full p-6 rounded shadow text-center">
                <h1 className="text-lg font-semibold">Set a new password</h1>
                <p className="text-sm text-slate-600 mt-2">Enter a strong password to finish resetting your account.</p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <input type="password" required value={password} placeholder="New password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="password" required value={confirm} placeholder="Confirm password" onChange={(e) => setConfirm(e.target.value)} className="w-full p-2 border rounded" />
                    <div className="flex justify-center gap-2">
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Saving…' : 'Set password'}
                        </button>
                        <Link href="/auth?mode=login" className="px-4 py-2 border rounded">Cancel</Link>
                    </div>
                </form>

                {status === 'success' && (
                    <div className="mt-3 text-emerald-600">
                        Password updated. <Link href="/auth?mode=login" className="underline">Sign in</Link>
                    </div>
                )}
                {status === 'error' && <div className="mt-3 text-red-600">{error}</div>}
            </div>
        </div>
    );
}
