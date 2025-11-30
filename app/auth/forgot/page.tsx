'use client';

import React, { useState } from 'react';

export default function ForgotPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('loading');
        setError(null);

        try {
            const res = await fetch('/api/auth/reset-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const json = await res.json();
            if (!res.ok) {
                setError(json?.error || 'Request failed');
                setStatus('error');
                return;
            }
            setStatus('sent');
        } catch (err: any) {
            setError(err?.message || 'Network error');
            setStatus('error');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white max-w-md w-full p-6 rounded shadow text-center">
                <h1 className="text-lg font-semibold">Reset your password</h1>
                <p className="text-sm text-slate-600 mt-2">Enter the email used for your account and we'll send a secure reset link.</p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex justify-center gap-2">
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Sending…' : 'Send reset link'}
                        </button>
                        <a className="px-4 py-2 border rounded" href="/auth?mode=login">Cancel</a>
                    </div>
                </form>

                {status === 'sent' && <div className="mt-3 text-sm text-emerald-600">If that email exists, we sent instructions to it.</div>}
                {status === 'error' && <div className="mt-3 text-sm text-red-600">{error}</div>}
            </div>
        </div>
    );
}
