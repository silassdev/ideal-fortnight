'use client';

import React from 'react';
import Link from 'next/link';

export default function ConfirmFailed() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white max-w-xl w-full p-8 rounded-lg shadow text-center">
                <h1 className="text-2xl font-bold text-red-600">Verification failed</h1>
                <p className="mt-3 text-slate-600">The confirmation link is invalid or has expired. You can request a new confirmation email or reset your password.</p>

                <div className="mt-6 flex justify-center gap-3">
                    <Link href="/auth/forgot" className="px-4 py-2 bg-amber-500 text-white rounded">Request new confirmation / reset</Link>
                    <Link href="/auth?mode=login" className="px-4 py-2 border rounded">Back to login</Link>
                </div>
            </div>
        </div>
    );
}
