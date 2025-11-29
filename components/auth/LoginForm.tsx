'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from './authClient';
import { signIn } from 'next-auth/react';

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const res = await signIn('credentials', {
            redirect: false,
            email: email.toLowerCase().trim(),
            password,
        });

        setLoading(false);

        if (res?.error) {
            setError(res.error);
            return;
        }

        if (res?.ok) {
            // Redirect to dashboard
            onSuccess?.();
            router.replace('/dashboard');
        }
    }

    async function handleGoogleLogin() {
        // No extra warning on login; redirect to NextAuth
        signIn('google', { callbackUrl: '/dashboard' });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="you@company.com"
                    className="mt-1 block w-full px-3 py-2 border rounded"
                    name="email"
                    autoComplete="email"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    type="password"
                    placeholder="Your password"
                    className="mt-1 block w-full px-3 py-2 border rounded"
                    name="password"
                    autoComplete="current-password"
                />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex gap-2 items-center">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="inline-flex items-center gap-2 px-3 py-2 border rounded bg-white hover:shadow"
                >
                    {/* Google icon */}
                    <svg className="w-4 h-4" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.6-34.6-4.6-51h-261v96.7h150.1c-6.5 34.8-26.1 64.3-55.6 84v69h89.6c52.4-48.2 82.5-119.6 82.5-198.7z" />
                        <path fill="#34A853" d="M272.3 544.3c73.5 0 135.2-24.6 180.3-66.7l-89.6-69c-24.9 16.8-56.8 26.7-90.7 26.7-69.7 0-128.8-47-150.1-110.2h-92.9v69.5C77 475.2 168.3 544.3 272.3 544.3z" />
                        <path fill="#FBBC05" d="M122.2 330.1c-5.6-16.8-8.8-34.7-8.8-53 0-18.3 3.2-36.2 8.8-53v-69.5H29.3C10.4 196.9 0 235.6 0 277.1s10.4 80.2 29.3 116.4l92.9-63.4z" />
                        <path fill="#EA4335" d="M272.3 107.8c39.9 0 75.8 13.8 104 40.9l78-78C405.8 24.6 344.1 0 272.3 0 168.3 0 77 69.1 29.3 178.1l92.9 69.5C143.5 154.8 202.6 107.8 272.3 107.8z" />
                    </svg>
                    Sign in with Google
                </button>
            </div>

            <div className="text-xs text-slate-500 mt-2">
                If you signed up via email you must confirm your email before signing in. If you used Google, you'll be signed in with your Google account.
            </div>
        </form>
    );
}
