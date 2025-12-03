'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-900">Check your email</h3>
                    <p className="text-sm text-green-700 mt-1">
                        If an account exists with that email, we've sent a password reset link.
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    autoComplete="email"
                />
                <p className="text-xs text-slate-500 mt-1">
                    Enter your email and we'll send you a link to reset your password.
                </p>
            </div>

            {error && (
                <div className="text-sm text-red-600 p-3 bg-red-50 rounded border border-red-200">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-4 py-2 rounded text-white ${loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="px-4 py-2 border rounded hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
