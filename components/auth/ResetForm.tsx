'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    id?: string;
    label?: string;
    error?: string | null;
    hint?: string;
};

function Input({ id, label, error, hint, className = '', ...props }: InputProps) {
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
        <div className={`w-full text-left ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1 antialiased">
                    {label}
                </label>
            )}

            <input
                id={id}
                aria-invalid={!!error}
                aria-describedby={describedBy}
                className={`
          w-full px-3 py-2 border rounded-md
          bg-white text-slate-900 placeholder-slate-400
          border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300
          shadow-sm antialiased text-sm
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
                {...props}
            />

            {hint && !error && (
                <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
                    {hint}
                </p>
            )}

            {error && (
                <p id={`${id}-error`} className="mt-1 text-xs text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function ResetForm({ token }: { token?: string }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const newFieldErrors: typeof fieldErrors = {};
        if (password.length < 6) newFieldErrors.password = 'Password must be at least 6 characters';
        if (password !== confirm) newFieldErrors.confirm = 'Passwords do not match';
        if (Object.keys(newFieldErrors).length) {
            setFieldErrors(newFieldErrors);
            return;
        }

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
        // compact, responsive card — use mx-auto to center inside any layout
        <div className="w-full max-w-md mx-auto bg-white rounded-lg p-4 sm:p-6 shadow-sm sm:shadow-md">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 antialiased">Set a new password</h1>
            <p className="text-sm text-slate-600 mt-1">Enter a strong password to finish resetting your account.</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <Input
                    id="password"
                    label="New password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    required
                    error={fieldErrors.password}
                    hint="Use a mix of letters, numbers and symbols."
                />

                <Input
                    id="confirm"
                    label="Confirm password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    required
                    error={fieldErrors.confirm}
                />

                <div className="flex flex-col sm:flex-row sm:justify-center gap-3 mt-2">
                    <button
                        type="submit"
                        className={`
              inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md
              bg-emerald-600 text-white text-sm font-medium antialiased
              hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300
              disabled:opacity-60 disabled:cursor-not-allowed transition w-full sm:w-auto
            `}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <>
                                <svg
                                    className="w-4 h-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Saving…
                            </>
                        ) : (
                            'Set password'
                        )}
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition w-full sm:w-auto"
                    >
                        Cancel
                    </Link>
                </div>
            </form>

            {status === 'success' && (
                <div className="mt-3 text-sm text-emerald-700" role="status">
                    Password updated.{' '}
                    <Link href="/?auth=login" className="underline text-emerald-700">
                        Sign in
                    </Link>
                </div>
            )}

            {status === 'error' && error && (
                <div className="mt-3 text-sm text-red-600" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}
