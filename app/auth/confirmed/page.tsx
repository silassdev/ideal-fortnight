'use client';

import React from 'react';
import Link from 'next/link';
import Confetti from '@/components/ui/Confetti';

export default function ConfirmedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative">
            <Confetti pieces={36} />
            <div className="bg-white max-w-xl w-full p-8 rounded-lg shadow text-center relative z-10">
                <h1 className="text-2xl font-bold">You're all set 🎉</h1>
                <p className="mt-3 text-slate-600">Your email has been verified. You can now sign in and finish your profile.</p>

                <div className="mt-6 flex justify-center gap-3">
                    <Link href="/?auth=login" className="px-4 py-2 bg-sky-600 text-white rounded">Proceed to login</Link>
                    <Link href="/" className="px-4 py-2 border rounded">Back to home</Link>
                </div>
            </div>
        </div>
    );
}
