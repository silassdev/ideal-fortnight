// components/auth/AuthForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (mode === 'register') {
            if (password.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
        }

        setLoading(true);

        try {
            if (mode === 'register') {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });
                const data = await res.json().catch(() => ({}));
                if (res.status === 201 || res.ok) {
                    setInfo('Account created. Check your email for verification link.');
                    setName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    onSuccess?.('Account created. Verify your email to activate.');
                } else {
                    setError(data?.message || data?.error || `Registration failed (${res.status})`);
                }
            } else {
                // login
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                    // server should set httpOnly cookie
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

            {mode === 'register' && (
                <div>
                    <label className="block text-sm text-slate-700 mb-1">Confirm password</label>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        type="password"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Re-enter password"
                        name="confirmPassword"
                        autoComplete="new-password"
                    />
                </div>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}
            {info && <div className="text-sm text-emerald-600">{info}</div>}

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${loading ? 'bg-slate-400' : mode === 'register' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {loading ? 'Processing…' : mode === 'register' ? 'Create account' : 'Sign in'}
                </button>

                {/* Google sign-in button */}
                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="inline-flex items-center gap-2 px-3 py-2 border rounded bg-white text-sm hover:shadow"
                >
                    {/* Google icon (SVG) */}
                    <svg className="w-4 h-4" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.6-34.6-4.6-51h-261v96.7h150.1c-6.5 34.8-26.1 64.3-55.6 84v69h89.6c52.4-48.2 82.5-119.6 82.5-198.7z" />
                        <path fill="#34A853" d="M272.3 544.3c73.5 0 135.2-24.6 180.3-66.7l-89.6-69c-24.9 16.8-56.8 26.7-90.7 26.7-69.7 0-128.8-47-150.1-110.2h-92.9v69.5C77 475.2 168.3 544.3 272.3 544.3z" />
                        <path fill="#FBBC05" d="M122.2 330.1c-5.6-16.8-8.8-34.7-8.8-53 0-18.3 3.2-36.2 8.8-53v-69.5H29.3C10.4 196.9 0 235.6 0 277.1s10.4 80.2 29.3 116.4l92.9-63.4z" />
                        <path fill="#EA4335" d="M272.3 107.8c39.9 0 75.8 13.8 104 40.9l78-78C405.8 24.6 344.1 0 272.3 0 168.3 0 77 69.1 29.3 178.1l92.9 69.5C143.5 154.8 202.6 107.8 272.3 107.8z" />
                    </svg>
                    {mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}
                </button>
            </div>
        </form>
    );
}
