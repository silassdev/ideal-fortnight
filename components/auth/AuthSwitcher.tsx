// components/auth/AuthSwitcher.tsx
'use client';

import { useState } from 'react';
import AuthForm from './AuthForm';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

type Props = {
    defaultMode?: 'login' | 'register';
};

export default function AuthSwitcher({ defaultMode = 'login' }: Props) {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
    const [message, setMessage] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    // keep mode in URL so deep-linking works
    const setModeAndPush = (m: 'login' | 'register') => {
        setMode(m);
        const url = `/auth?mode=${m}`;
        // shallow push for client router (keeps page without full reload)
        router.replace(url);
        setMessage(null);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
                    <p className="text-sm text-slate-500">
                        {mode === 'login' ? 'Sign in to access your dashboard' : 'Register and verify your email to continue'}
                    </p>
                </div>
                <div className="flex gap-2 bg-slate-100 rounded p-1">
                    <button
                        aria-pressed={mode === 'login'}
                        onClick={() => setModeAndPush('login')}
                        className={`px-3 py-1 rounded text-sm ${mode === 'login' ? 'bg-white shadow' : 'text-slate-600'}`}
                    >
                        Login
                    </button>
                    <button
                        aria-pressed={mode === 'register'}
                        onClick={() => setModeAndPush('register')}
                        className={`px-3 py-1 rounded text-sm ${mode === 'register' ? 'bg-white shadow' : 'text-slate-600'}`}
                    >
                        Register
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <AuthForm mode={mode} onSuccess={(msg) => setMessage(msg)} />
                    {message ? <div className="mt-4 text-sm text-green-600">{message}</div> : null}

                    <div className="mt-4">
                        <div className="text-xs text-slate-500 mb-2">Or sign in with</div>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    signIn('google', {
                                        callbackUrl: '/dashboard',
                                    })
                                }
                                className="flex-1 px-4 py-2 rounded border bg-white text-sm hover:shadow"
                            >
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>

                <aside className="hidden md:block p-4 rounded border bg-slate-50">
                    <h3 className="text-sm font-semibold mb-2">Why create an account?</h3>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                        <li>Save multiple resume versions</li>
                        <li>Share public resume links</li>
                        <li>Download high-quality PDFs</li>
                        <li>Manage templates and preferences</li>
                    </ul>
                </aside>
            </div>
        </div>
    );
}
