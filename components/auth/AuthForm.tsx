// components/auth/AuthForm.tsx
'use client';

import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

export default function AuthForm({ defaultMode = 'login' as 'login' | 'register' }) {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

    return (
        <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
                    <p className="text-sm text-slate-500">{mode === 'login' ? 'Sign in to access your dashboard' : 'Register and confirm your email to activate'}</p>
                </div>
                <div className="flex gap-2 bg-slate-100 rounded p-1">
                    <button
                        aria-pressed={mode === 'login'}
                        onClick={() => setMode('login')}
                        className={`px-3 py-1 rounded text-sm ${mode === 'login' ? 'bg-white shadow' : 'text-slate-600'}`}
                    >
                        Login
                    </button>
                    <button
                        aria-pressed={mode === 'register'}
                        onClick={() => setMode('register')}
                        className={`px-3 py-1 rounded text-sm ${mode === 'register' ? 'bg-white shadow' : 'text-slate-600'}`}
                    >
                        Register
                    </button>
                </div>
            </div>

            {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
    );
}
