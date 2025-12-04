'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { loginUser } from './authClient';
import { signIn } from 'next-auth/react';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
    const router = useRouter();
    const [showForgotPassword, setShowForgotPassword] = useState(false);
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
            onSuccess?.();
            router.replace('/dashboard');
        }
    }

    async function handleGoogleLogin() {
        signIn('google', { callbackUrl: '/dashboard' });
    }

    async function handleGithubLogin() {
        signIn('github', { callbackUrl: '/dashboard' });
    }

    if (showForgotPassword) {
        return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="you@company.com"
                    name="email"
                    autoComplete="email"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-indigo-600 hover:text-indigo-700"
                    >
                        Forgot password?
                    </button>
                </div>
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    type="password"
                    placeholder="Your password"
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
                    className="
                    inline-flex items-center gap-3 px-4 py-2 border rounded-md
                    bg-white hover:bg-gray-50 shadow-sm
                    text-base font-medium leading-none tracking-wide text-slate-500
                    antialiased
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                "
                    aria-label="Sign in with Google"
                >
                    <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.6-34.6-4.6-51h-261v96.7h150.1c-6.5 34.8-26.1 64.3-55.6 84v69h89.6c52.4-48.2 82.5-119.6 82.5-198.7z" />
                        <path fill="#34A853" d="M272.3 544.3c73.5 0 135.2-24.6 180.3-66.7l-89.6-69c-24.9 16.8-56.8 26.7-90.7 26.7-69.7 0-128.8-47-150.1-110.2h-92.9v69.5C77 475.2 168.3 544.3 272.3 544.3z" />
                        <path fill="#FBBC05" d="M122.2 330.1c-5.6-16.8-8.8-34.7-8.8-53 0-18.3 3.2-36.2 8.8-53v-69.5H29.3C10.4 196.9 0 235.6 0 277.1s10.4 80.2 29.3 116.4l92.9-63.4z" />
                        <path fill="#EA4335" d="M272.3 107.8c39.9 0 75.8 13.8 104 40.9l78-78C405.8 24.6 344.1 0 272.3 0 168.3 0 77 69.1 29.3 178.1l92.9 69.5C143.5 154.8 202.6 107.8 272.3 107.8z" />
                    </svg>

                    Sign in with Google
                </button>

                <button
                    type="button"
                    onClick={handleGithubLogin}
                    className="
                    inline-flex items-center gap-3 px-4 py-2 border rounded-md
                    bg-white hover:bg-gray-50 shadow-sm
                    text-base font-medium leading-none tracking-wide text-slate-500
                    antialiased
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                "
                    aria-label="Sign in with GitHub"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>

                    Sign in with GitHub
                </button>

            </div>

            <div className="text-xs text-slate-500 mt-2">
                If you signed up via email you must confirm your email before signing in. If you used Google, you'll be signed in with your Google account.
            </div>
        </form>
    );
}
