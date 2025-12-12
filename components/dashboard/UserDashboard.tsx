'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserCircle, CloudUpload, Sparkles, Loader2 } from 'lucide-react';
import TemplateGallery from './TemplateGallery';
import useResume from '@/hooks/useResume';
import ProfileSettingsModal from './ProfileSettingsModal';
import DragDropImporter from '@/components/import/DragDropImporter';
import SuggestResumeFlow from './SuggestResumeFlow';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
    const router = useRouter();
    const { resume, isLoading } = useResume();
    const { data: session } = useSession();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showSuggestModal, setShowSuggestModal] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    // Extract first name from user's full name
    const firstName = session?.user?.name?.split(' ')[0] || 'there';

    async function handleImport(parsedResume: any) {
        setIsImporting(true);
        try {
            const res = await fetch('/api/resume/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resume: parsedResume }),
            });
            const json = await res.json();

            if (res.ok) {
                // Force a reload or just redirect to edit
                window.location.href = '/dashboard/edit';
            } else {
                alert(json.error || 'Import failed');
            }
        } catch (err) {
            console.error(err);
            alert('Import error occurred');
        } finally {
            setIsImporting(false);
        }
    }

    return (
        <div className="space-y-8">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl text-slate-800 font-bold mb-1">Welcome, {firstName}!</h1>
                    <p className="text-sm text-slate-500">Create, edit and share a single professional resume.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Profile Icon */}
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
                        title={session?.user?.name || 'Profile'}
                        aria-label="Open profile settings"
                    >
                        <UserCircle className="w-8 h-8 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </button>

                    {/* Action Buttons */}
                    {resume ? (
                        <div className="flex gap-2">
                            <Link href="/dashboard/edit" className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-sky-200">
                                Continue editing
                            </Link>
                            <Link href={`/resume/${resume.publicId || resume._id}`} className="px-4 py-2 text-slate-600 border border-slate-200 hover:border-slate-300 bg-white font-medium rounded-lg transition-all hover:bg-slate-50">
                                View public
                            </Link>
                        </div>
                    ) : (
                        <Link href="/dashboard/templates" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-emerald-200">
                            Create my resume
                        </Link>
                    )}
                </div>
            </div>

            {/* AI Suggest & Import Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* AI Suggestion Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="w-16 h-16 text-indigo-100" />
                    </div>
                    <h3 className="text-lg font-bold text-indigo-900 mb-2">Need help getting started?</h3>
                    <p className="text-sm text-indigo-700/80 mb-6 max-w-xs">
                        Answer 3 quick questions and our AI will recommend the perfect template and starter content for you.
                    </p>
                    <button
                        onClick={() => setShowSuggestModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Suggest
                    </button>
                </div>

                {/* Import Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <CloudUpload className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Already have a resume?</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                        Import your existing JSON Resume or plain text to get a head start.
                    </p>

                    {isImporting ? (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Importing...
                        </div>
                    ) : (
                        <div className="w-full">
                            {/* We wrap the Importer in a way that looks like a drop zone or button */}
                            <DragDropImporter onImported={handleImport} />
                        </div>
                    )}
                </div>
            </div>

            {showSuggestModal && (
                <SuggestResumeFlow onClose={() => setShowSuggestModal(false)} />
            )}

            <section>
                <h2 className="text-lg text-slate-600 font-medium mb-3">Choose a template</h2>
                <TemplateGallery />
            </section>


            <ProfileSettingsModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
        </div>
    );
}

