'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, ArrowRight, Home } from 'lucide-react';

export default function ConfirmFailedCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-slate-100 text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <XCircle className="w-10 h-10 text-red-500" />
            </motion.div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">Verification Failed</h1>

            <p className="text-slate-600 mb-8 leading-relaxed">
                The confirmation link is invalid or has expired. Please try signing up again or contact support if the issue persists.
            </p>

            <div className="space-y-3">
                <Link
                    href="/"
                    className="group flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-slate-200 hover:shadow-xl"
                >
                    <Home className="w-4 h-4" />
                    <span>Go to Homepage</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Link>
            </div>
        </motion.div>
    );
}
