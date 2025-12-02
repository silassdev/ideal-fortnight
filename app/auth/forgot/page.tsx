'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

function Particles({ count = 14 }: { count?: number }) {
    const items = useMemo(
        () =>
            Array.from({ length: count }).map((_, i) => ({
                id: i,
                left: Math.random() * 100,
                size: 6 + Math.floor(Math.random() * 12),
                delay: Math.random() * 2,
                duration: 6 + Math.random() * 6,
                opacity: 0.06 + Math.random() * 0.12,
                y: 8 + Math.random() * 20,
                hue: 200 + Math.floor(Math.random() * 40),
            })),
        [count]
    );

    return (
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            {items.map((p) => (
                <motion.span
                    key={p.id}
                    className="absolute rounded-full blur-sm"
                    style={{
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size,
                        background: `hsla(${p.hue},80%,60%,${p.opacity})`,
                        transform: 'translate3d(0,0,0)',
                    }}
                    initial={{ y: p.y, opacity: 0 }}
                    animate={{ y: -p.y, opacity: [0, p.opacity, 0] }}
                    transition={{
                        delay: p.delay,
                        duration: p.duration,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

export default function ForgotPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setError(null);

        try {
            const res = await fetch('/api/auth/reset-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError((json && (json.error || json.message)) || 'Request failed. Please try again.');
                setStatus('error');
                return;
            }

            setStatus('sent');
        } catch (err: any) {
            setError(err?.message || 'Network error. Please try again.');
            setStatus('error');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6 relative">
            {/* decorative particles */}
            <Particles count={16} />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative z-10 bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-100"
            >
                {/* header icon */}
                <motion.div
                    initial={{ scale: 0.9, rotate: -4 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.06 }}
                    className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                    <Mail className="w-7 h-7 text-sky-600" />
                </motion.div>

                <h1 className="text-xl font-semibold text-slate-900 text-center">Reset your password</h1>
                <p className="text-sm text-slate-600 text-center mt-2">
                    Enter the email used for your account and we'll send a secure reset link.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-describedby="status-message">
                    <label className="sr-only" htmlFor="email">
                        Email address
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200"
                        aria-invalid={status === 'error' ? true : undefined}
                        aria-busy={status === 'loading' ? true : undefined}
                    />

                    <div className="flex justify-center gap-3">
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'sent'}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-sky-600 text-white font-medium shadow hover:scale-[1.02] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-transform"
                        >
                            {/* spinner vs text */}
                            {status === 'loading' ? (
                                <>
                                    <svg
                                        className="w-4 h-4 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden
                                    >
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    <span>Sending…</span>
                                </>
                            ) : status === 'sent' ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Sent</span>
                                </>
                            ) : (
                                <>
                                    <span>Send reset link</span>
                                </>
                            )}
                        </button>

                        <Link href="/auth?mode=login" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Cancel</span>
                        </Link>
                    </div>
                </form>

                {/* live status messages */}
                <div id="status-message" className="mt-4 min-h-[1.25rem]" aria-live="polite">
                    {status === 'sent' && (
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28 }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded bg-emerald-50 text-emerald-700 text-sm mx-auto"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>If that email exists, we sent instructions to it.</span>
                        </motion.div>
                    )}

                    {status === 'error' && error && (
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28 }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded bg-red-50 text-red-700 text-sm mx-auto"
                        >
                            <span>{error}</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
