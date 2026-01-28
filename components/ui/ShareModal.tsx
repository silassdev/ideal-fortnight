"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, Share2, Globe } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeId: string;
    publicId?: string;
}

export default function ShareModal({ isOpen, onClose, resumeId, publicId }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    // Generate the public link
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/resume/${publicId || resumeId}`
        : '';

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    >
                        {/* Header */}
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <Share2 size={18} />
                                </div>
                                <h3 className="font-bold text-slate-800">Share Public Link</h3>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <Globe className="text-indigo-500 shrink-0" size={24} />
                                <div className="text-sm">
                                    <p className="font-semibold text-indigo-900">Your resume is live!</p>
                                    <p className="text-indigo-700/70">Anyone with this link can view your professional resume.</p>
                                </div>
                            </div>

                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Public URL</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 truncate font-mono">
                                    {shareUrl}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shrink-0 ${copied
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                                        }`}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <a
                                    href={shareUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
                                >
                                    <ExternalLink size={16} />
                                    View Live
                                </a>
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
