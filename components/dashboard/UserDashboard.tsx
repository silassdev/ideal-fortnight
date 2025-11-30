'use client';

import React from 'react';
import Link from 'next/link';
import TemplateGallery from './TemplateGallery';
import useResume from '@/hooks/useResume';

export default function UserDashboard() {
    const { resume, isLoading } = useResume();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Your Resume</h1>
                    <p className="text-sm text-slate-500">Create, edit and share a single professional resume.</p>
                </div>

                <div>
                    {resume ? (
                        <div className="flex gap-2">
                            <Link href="/dashboard/edit" className="px-3 py-2 bg-sky-600 text-white rounded">Continue editing</Link>
                            <Link href={`/resume/${resume.publicId || resume._id}`} className="px-3 py-2 border rounded">View public</Link>
                        </div>
                    ) : (
                        <Link href="/dashboard/templates" className="px-4 py-2 bg-emerald-600 text-white rounded">Create my resume</Link>
                    )}
                </div>
            </div>

            <section>
                <h2 className="text-lg font-medium mb-3">Choose a template</h2>
                <TemplateGallery />
            </section>
        </div>
    );
}
