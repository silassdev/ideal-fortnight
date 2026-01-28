"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, Globe, Lock } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    isPublic: boolean;
    publicUrl: string;
    onTogglePublic: () => void;
    isSaving?: boolean;
}

export default function ShareModal({
    isOpen,
    onClose,
    isPublic,
    publicUrl,
    onTogglePublic,
    isSaving = false,
}: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden z-10"
                    >
                        {/* Header Image/Background */}
                        <div className="h-32 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <div className="absolute -bottom-6 left-6 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-indigo-600">
                                <Globe size={24} />
                            </div>
                        </div>

                        <div className="p-8 pt-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Share Resume</h2>
                            <p className="text-slate-500 text-sm mb-6">
                                Publish your resume and share it with recruiters through a unique public link.
                            </p>

                            {/* Status Toggle */}
                            <div className={`p-4 rounded-2xl border transition-all mb-6 ${isPublic ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPublic ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                                            {isPublic ? <Globe size={16} /> : <Lock size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">
                                                {isPublic ? 'Public Access' : 'Private Mode'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {isPublic ? 'Active on search engines' : 'Only you can access'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onTogglePublic}
                                        disabled={isSaving}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPublic ? 'bg-indigo-600' : 'bg-slate-300'} ${isSaving ? 'opacity-50' : ''}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Link Area */}
                            {isPublic ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Shareable URL</p>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                readOnly
                                                value={publicUrl}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 pr-12 font-mono scrollbar-hide"
                                            />
                                            <button
                                                onClick={handleCopy}
                                                className="absolute right-2 top-1.5 p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                                title="Copy to clipboard"
                                            >
                                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <a
                                            href={publicUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                                        >
                                            <ExternalLink size={16} />
                                            View Page
                                        </a>
                                        <button
                                            onClick={handleCopy}
                                            className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
                                        >
                                            Copy Link
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 px-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <p className="text-sm text-amber-800 mb-1">Link sharing is currently disabled</p>
                                    <p className="text-xs text-amber-600/70">Switch to Public mode to generate a link for recruiters.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
