// components/auth/AuthForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'login' | 'register';

type Props = {
    mode: Mode;
    onSuccess?: (message: string) => void;
};

export default function AuthForm({ mode, onSuccess }: Props) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === 'register') {
                // Register flow: POST /api/auth/register
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await res.json().catch(() => ({}));

                if (res.status === 201 || res.ok) {
                    // Registration succeeded — server should send verification email.
                    onSuccess?.('Account created. Check your email for a verification link.');
                    // Optionally clear fields
                    setName('');
                    setEmail('');
                    setPassword('');
                } else {
                    setError(data?.message || data?.error || `Registration failed (${res.status})`);
                }
            } else {
                // Login flow: POST /api/auth/login
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json().catch(() => ({}));

                if (res.ok) {
                    // Successful login — server should set cookie or return token
                    // Redirect to dashboard (server may set cookie)
                    router.replace('/dashboard');
                } else {
                    setError(data?.message || data?.error || `Login failed (${res.status})`);
                }
            }
        } catch (err) {
            setError((err as Error).message || 'Network error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
                <div>
                    <label className="block text-sm text-slate-700 mb-1">Full name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={2}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Jane Doe"
                        name="name"
                        autoComplete="name"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm text-slate-700 mb-1">Email address</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    className="w-full px-3 py-2 border rounded"
                    placeholder="you@example.com"
                    name="email"
                    autoComplete="email"
                />
            </div>

            <div>
                <label className="block text-sm text-slate-700 mb-1">Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    type="password"
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Choose a strong password"
                    name="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${loading ? 'bg-slate-400' : mode === 'register' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {loading ? 'Processing…' : mode === 'register' ? 'Create account' : 'Sign in'}
                </button>

                {mode === 'login' && (
                    <button
                        type="button"
                        onClick={() => router.push('/auth?mode=register')}
                        className="px-3 py-2 text-sm rounded border"
                    >
                        Create account
                    </button>
                )}
            </div>
        </form>
    );
}
