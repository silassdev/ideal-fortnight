'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Confetti from '@/components/ui/Confetti';

function WelcomeParticles({ count = 16 }: { count?: number }) {
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            size: Math.floor(Math.random() * 10) + 6,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 6 + Math.random() * 6,
            opacity: 0.12 + Math.random() * 0.18,
            yOffset: 12 + Math.random() * 28,
            hue: 180 + Math.floor(Math.random() * 60),
        }));
    }, [count]);

    return (
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <motion.span
                    key={p.id}
                    className="absolute rounded-full blur-sm"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.left}%`,
                        background: `hsla(${p.hue},70%,65%,${p.opacity})`,
                        transform: 'translate3d(0,0,0)'
                    }}
                    initial={{ y: p.yOffset, scale: 0.9, opacity: 0 }}
                    animate={{ y: -p.yOffset, scale: 1.05, opacity: [0, p.opacity, 0] }}
                    transition={{
                        delay: p.delay,
                        duration: p.duration,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </div>
    );
}

export default function ConfirmedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6 relative">
            <Confetti pieces={36} />

            <WelcomeParticles count={18} />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="bg-white max-w-xl w-full p-8 rounded-2xl shadow-xl border border-slate-100 text-center relative z-10"
            >
                <motion.div
                    initial={{ scale: 0.85, rotate: -6 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 }}
                    className="w-24 h-24 bg-sky-50 dark:bg-sky-900/5 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M20 6L9 17l-5-5" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="text-3xl font-semibold text-slate-900 mb-2"
                >
                    You're all set <span className="inline-block transition-transform duration-200 group-hover:rotate-12"><svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 inline text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20" /><path d="M5 3v12" /><path d="M19 3v6" /><path d="M2 15h20" /><path d="M4 21h16" /><path d="M12 3v18" /></svg></span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.18 }}
                    className="text-slate-600 mb-6 leading-relaxed"
                >
                    Your email has been verified. You can now sign in and finish your profile.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.26 }}
                    className="mt-4 flex justify-center gap-3"
                >
                    <Link href="/?auth=login" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-sky-600 text-white font-medium shadow-md hover:scale-[1.02] transition-transform">
                        Proceed to login
                    </Link>

                    <Link href="/" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                        Back to home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
