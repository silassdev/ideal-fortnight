'use client';

import React, { useEffect, useState } from 'react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import PreviewModal from './PreviewModal';
import { saveResume as apiSave } from '@/lib/resumeClient';
import useResume from '@/hooks/useResume';
import { downloadPdfSafe, downloadDoc } from '@/lib/downloadResume';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import { Eye, Save, FileText, FileDown, Share2, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { ResumeShape } from '@/types/template';

export default function TemplateEditor({ templateKey }: { templateKey: string }) {
    const { resume, setResume } = useResume();
    const [editing, setEditing] = useState<ResumeShape>(() => resume ?? {
        template: templateKey,
        name: '',
        title: '',
        summary: '',
        contact: {},
        experience: [],
        education: [],
        skills: [],
    });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => { setEditing((r) => ({ ...(r ?? {}), template: templateKey })); }, [templateKey]);

    async function handleSave() {
        setSaving(true);
        try {
            const res = await apiSave(editing);
            if (res.ok && res.data) {
                setResume(res.data);
                // Optional: show toast
            } else {
                console.error('Save failed', res);
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleSaveAndLink() {
        await handleSave();
        if (!editing.publicId && (editing as any)._id) {
            alert('Saved — public link ready.');
        } else {
            alert('Saved.');
        }
    }

    async function handleDownloadPdf() {
        // We need to render the preview temporarily or use the modal's content if open
        // For now, we'll open the preview modal to ensure the element exists, then download
        setPreviewOpen(true);
        // Wait for modal to render
        setTimeout(async () => {
            const previewEl = document.getElementById('resume-preview-modal');
            if (!previewEl) return alert('Preview not available');
            await downloadPdfSafe(previewEl, { filename: `${editing.name || 'resume'}.pdf` });
            setPreviewOpen(false);
        }, 500);
    }

    async function handleDownloadDoc() {
        await downloadDoc(editing, { filename: `${editing.name || 'resume'}.doc` });
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Toolbar */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">Editing {templateKey}</h1>
                            <p className="text-xs text-slate-500">Last saved: {resume?.updatedAt ? new Date(resume.updatedAt).toLocaleTimeString() : 'Unsaved'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        <button
                            onClick={() => setPreviewOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                        >
                            <Eye className="w-4 h-4" />
                            Live Preview
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-1" />

                        <button
                            onClick={handleDownloadDoc}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                            title="Download Word Doc"
                        >
                            <FileText className="w-4 h-4" />
                            DOC
                        </button>

                        <button
                            onClick={handleDownloadPdf}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                            title="Download PDF"
                        >
                            <FileDown className="w-4 h-4" />
                            PDF
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-1" />

                        <button
                            onClick={handleSaveAndLink}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                        >
                            <Share2 className="w-4 h-4" />
                            Link
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70 whitespace-nowrap"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Editor Area */}
            <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">

                {/* Personal Details */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-semibold text-slate-900">Personal Details</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Full Name"
                            placeholder="e.g. John Doe"
                            value={editing.name || ''}
                            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        />
                        <Input
                            label="Professional Title"
                            placeholder="e.g. Senior Software Engineer"
                            value={editing.title || ''}
                            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                            <textarea
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
                                placeholder="Briefly describe your professional background and key achievements..."
                                value={editing.summary || ''}
                                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                            />
                        </div>
                    </div>
                </section>

                {/* Contact Info */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-semibold text-slate-900">Contact Information</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            value={editing.contact?.email || ''}
                            onChange={(e) => setEditing({ ...editing, contact: { ...editing.contact, email: e.target.value } })}
                        />
                        <Input
                            label="Phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={editing.contact?.phone || ''}
                            onChange={(e) => setEditing({ ...editing, contact: { ...editing.contact, phone: e.target.value } })}
                        />
                        <Input
                            label="Location"
                            placeholder="City, Country"
                            value={editing.contact?.location || ''}
                            onChange={(e) => setEditing({ ...editing, contact: { ...editing.contact, location: e.target.value } })}
                        />
                        <Input
                            label="Website / Portfolio"
                            placeholder="https://..."
                            value={editing.contact?.website || ''}
                            onChange={(e) => setEditing({ ...editing, contact: { ...editing.contact, website: e.target.value } })}
                        />
                        <Input
                            label="LinkedIn"
                            placeholder="linkedin.com/in/..."
                            value={editing.contact?.linkedin || ''}
                            onChange={(e) => setEditing({ ...editing, contact: { ...editing.contact, linkedin: e.target.value } })}
                        />
                        <Input
                            label="GitHub"
                            placeholder="github.com/..."
                            value={editing.contact?.github || ''}
                            onChange={(e) => setEditing({ ...editing, contact: { ...editing.contact, github: e.target.value } })}
                        />
                    </div>
                </section>

                {/* Placeholder for other sections */}
                <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                    <p>Experience, Education, and Skills sections would go here...</p>
                    <p className="text-sm mt-2">(Keeping it simple for this redesign step)</p>
                </div>

            </main>

            <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)}>
                <div id="resume-preview-modal" className="p-4 bg-white min-h-[800px]">
                    <TemplateRenderer templateKey={templateKey} resume={editing} />
                </div>
            </PreviewModal>
        </div>
    );
}
