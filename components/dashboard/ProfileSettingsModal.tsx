'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, User, Mail, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [fullName, setFullName] = useState(session?.user?.name || '');
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleUpdateName = async () => {
        if (!fullName.trim()) {
            setError('Name cannot be empty');
            return;
        }

        setIsUpdating(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/user/update-name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: fullName }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update name');
            }

            // Update session with new name
            await update({ ...session, user: { ...session?.user, name: fullName } });

            setSuccess('Name updated successfully!');
            setError(null);

            // Refresh the page to reflect changes
            setTimeout(() => {
                router.refresh();
            }, 1000);
        } catch (err: any) {
            console.error('Name update error:', err);
            setError(err.message);
            setSuccess(null);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation.toLowerCase() !== 'delete') {
            setError('Please type "delete" to confirm');
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            const res = await fetch('/api/user/delete-account', {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete account');
            }

            // Sign out and redirect to home
            await signOut({ redirect: false });
            router.push('/');
        } catch (err: any) {
            setError(err.message);
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-slate-900">Profile Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </div>
                    )}

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Full Name
                        </label>
                        <Input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full"
                        />
                        <button
                            onClick={handleUpdateName}
                            disabled={isUpdating || fullName === session?.user?.name}
                            className="mt-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Name'
                            )}
                        </button>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                        </label>
                        <Input
                            type="email"
                            value={session?.user?.email || ''}
                            disabled
                            className="w-full bg-slate-50 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
                    </div>

                    {/* Delete Account */}
                    <div className="pt-6 border-t">
                        <div className="flex items-center gap-2 mb-3">
                            <Trash2 className="w-5 h-5 text-red-600" />
                            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                        </div>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-start gap-2 text-sm text-red-800">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Are you sure you want to delete your account?</p>
                                        <p className="mt-1 text-red-700">This action cannot be undone. All your data will be permanently deleted.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-800 mb-1">
                                        Type <span className="font-mono bg-red-100 px-1 rounded">delete</span> to confirm
                                    </label>
                                    <Input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        placeholder="Type 'delete' here"
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting || deleteConfirmation.toLowerCase() !== 'delete'}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                Confirm Delete
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setDeleteConfirmation('');
                                            setError(null);
                                        }}
                                        disabled={isDeleting}
                                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
