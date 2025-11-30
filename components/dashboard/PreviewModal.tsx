'use client';

import React from 'react';

export default function PreviewModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 max-w-4xl w-full max-h-[90vh] overflow-auto rounded shadow-lg">
                <div className="p-4">
                    <button onClick={onClose} className="text-sm px-2 py-1 border rounded">Close</button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
