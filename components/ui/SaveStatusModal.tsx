"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X } from 'lucide-react';

interface SaveStatusModalProps {
    isOpen: boolean;
    status: 'success' | 'error';
    title?: string;
    description?: string;
    onClose: () => void;
    autoCloseDelay?: number;
}

export default function SaveStatusModal({
    isOpen,
    status,
    title,
    description,
    onClose,
    autoCloseDelay = 2000,
}: SaveStatusModalProps) {

    // Auto-close for success state
    useEffect(() => {
        if (isOpen && status === 'success' && autoCloseDelay > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [isOpen, status, autoCloseDelay, onClose]);

    // Animation variants
    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants: Variants = {
        hidden: { scale: 0.8, opacity: 0, y: 20 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        exit: { scale: 0.8, opacity: 0, y: 20, transition: { duration: 0.2 } },
    };

    const iconVariants: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeInOut" }
        }
    };

    const circleVariants: Variants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { delay: 0.1, type: "spring", stiffness: 200, damping: 15 }
        }
    };

    const isSuccess = status === 'success';
    const defaultTitle = isSuccess ? 'Saved Successfully' : 'Save Failed';
    const defaultDesc = isSuccess ? 'Your resume has been saved.' : 'There was an error saving your resume.';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 relative z-10 pointer-events-auto flex flex-col items-center text-center overflow-hidden"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Icon Animation */}
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 52 52"
                                className={`w-12 h-12 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}
                            >
                                <motion.circle
                                    cx="26"
                                    cy="26"
                                    r="25"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    variants={circleVariants}
                                    initial="hidden"
                                    animate="visible"
                                />
                                {isSuccess ? (
                                    <motion.path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate="visible"
                                    />
                                ) : (
                                    <motion.path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        d="M16 16 36 36 M36 16 16 36"
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate="visible"
                                    />
                                )}
                            </motion.svg>
                        </div>

                        <h3 className={`text-xl font-bold mb-2 ${isSuccess ? 'text-slate-800' : 'text-red-600'}`}>
                            {title || defaultTitle}
                        </h3>

                        <p className="text-slate-500 mb-6 text-sm">
                            {description || defaultDesc}
                        </p>

                        {!isSuccess && (
                            <button
                                onClick={onClose}
                                className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition-colors w-full"
                            >
                                Dismiss
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
