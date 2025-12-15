'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function PreviewModal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const viewportWidth = window.innerWidth - 64;
            const a4Width = 794;

            if (viewportWidth < a4Width) {
                setScale(viewportWidth / a4Width);
            } else {
                setScale(1);
            }
        };

        if (open) {
            handleResize();
            window.addEventListener('resize', handleResize);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">Resume Preview</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        aria-label="Close preview"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="overflow-auto flex-1 p-4">
                    <div className="flex justify-center">
                        <div
                            style={{
                                transform: `scale(${scale})`,
                                transformOrigin: 'top center',
                                width: '794px',
                                marginBottom: scale < 1 ? `${(1 - scale) * 100}%` : '0px'
                            }}
                            className="transition-transform duration-200"
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
