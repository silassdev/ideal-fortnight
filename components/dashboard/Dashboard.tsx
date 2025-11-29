'use client';

import React from 'react';
import useResume from '@/hooks/useResume';
import Skeleton from '@/components/ui/Skeleton';
import TemplatePicker from './TemplatePicker';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';

export default function Dashboard() {
    const { resume, setResume, isLoading, saveResume } = useResume();

    // While loading show skeleton
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-12" />
                    <Skeleton className="h-6" />
                    <Skeleton className="h-[520px]" />
                </div>
                <aside className="space-y-4">
                    <Skeleton className="h-12" />
                    <Skeleton className="h-[420px]" />
                </aside>
            </div>
        );
    }

    // Ensure resume object exists (initial empty shapes)
    const draft = resume ?? {
        template: 'modern',
        name: '',
        title: '',
        summary: '',
        contact: { email: '', phone: '', location: '' },
        experience: [],
        education: [],
        skills: [] as string[],
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-lg font-semibold">Template</h2>
                    <TemplatePicker
                        value={draft.template}
                        onChange={(t) => setResume({ ...draft, template: t })}
                    />
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-lg font-semibold">Build Resume</h2>
                    <ResumeEditor resume={draft} onChange={(r) => setResume(r)} onSave={() => saveResume(draft)} />
                </div>
            </div>

            <aside className="space-y-6">
                <div className="bg-white rounded-lg p-4 shadow">
                    <h3 className="font-medium">Live Preview</h3>
                    <div className="mt-3">
                        <ResumePreview resume={draft} />
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                    <h3 className="font-medium">Actions</h3>
                    <div className="mt-3 flex flex-col gap-2">
                        <button
                            onClick={() => saveResume(draft)}
                            className="px-4 py-2 bg-sky-600 text-white rounded"
                        >
                            Save resume
                        </button>
                        <button
                            onClick={() => window.open(`/resume/${draft._id || ''}`, '_blank')}
                            className="px-4 py-2 border rounded"
                        >
                            Open public link
                        </button>
                        <div className="text-xs text-slate-500 mt-3">
                            One email = one resume. Saving will create or update your single resume.
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
