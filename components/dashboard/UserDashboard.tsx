'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserCircle } from 'lucide-react';
import TemplateGallery from './TemplateGallery';
import useResume from '@/hooks/useResume';
import ProfileSettingsModal from './ProfileSettingsModal';

export default function UserDashboard() {
    const { resume, isLoading } = useResume();
    const { data: session } = useSession();
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Extract first name from user's full name
    const firstName = session?.user?.name?.split(' ')[0] || 'there';

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow flex items-center justify-between">
                <div>
                    <h1 className="text-2xl text-slate-600 font-semibold">Welcome, {firstName}!</h1>
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
                        <UserCircle className="w-8 h-8 text-slate-600 group-hover:text-slate-900" />
                    </button>

                    {/* Action Buttons */}
                    {resume ? (
                        <div className="flex gap-2">
                            <Link href="/dashboard/edit" className="px-3 py-2 bg-sky-600 text-white rounded">Continue editing</Link>
                            <Link href={`/resume/${resume.publicId || resume._id}`} className="px-3 text-slate-600 py-2 border rounded">View public</Link>
                        </div>
                    ) : (
                        <Link href="/dashboard/templates" className="px-4 py-2 bg-emerald-600 text-white rounded">Create my resume</Link>
                    )}
                </div>
            </div>

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

