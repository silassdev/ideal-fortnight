'use client';

import React, { useEffect, useRef, useState } from 'react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import PreviewModal from './PreviewModal';
import { saveResume as apiSave } from '@/lib/resumeClient';
import useResume from '@/hooks/useResume';
import { downloadPdfSafe, downloadDoc } from '@/lib/downloadResume';
import { useRouter } from 'next/navigation';

export default function TemplateEditor({ templateKey }: { templateKey: string }) {
    const { resume, setResume, saveResume } = useResume();
    const [editing, setEditing] = useState(() => resume ?? {
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
    const previewRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    useEffect(() => { setEditing((r) => ({ ...(r ?? {}), template: templateKey })); }, [templateKey]);

    async function handleSave() {
        setSaving(true);
        // upsert via API
        try {
            const res = await apiSave(editing);
            if (res.ok && res.data) {
                setResume(res.data);
                // navigate to dashboard main or remain
                router.push('/dashboard');
            } else {
                console.error('Save failed', res);
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleDownloadPdf() {
        // render preview into element id resume-preview inside TemplateRenderer
        const previewEl = document.getElementById('resume-preview');
        if (!previewEl) return alert('Preview not available');
        await downloadPdfSafe(previewEl, { filename: `${editing.name || 'resume'}.pdf` });
    }

    async function handleDownloadDoc() {
        // Compose simple doc from editing state or rendered html
        await downloadDoc(editing, { filename: `${editing.name || 'resume'}.doc` });
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Editing: {templateKey}</h1>
                    <div className="text-sm text-slate-500">Edit fields and preview before saving</div>
                </div>

                <div className="flex gap-2">
                    <button className="px-3 py-2 border rounded" onClick={() => setPreviewOpen(true)}>Preview</button>
                    <button className="px-3 py-2 border rounded" onClick={handleDownloadDoc}>Download .doc</button>
                    <button className="px-3 py-2 bg-slate-800 text-white rounded" onClick={handleDownloadPdf}>Download PDF</button>
                    <button className="px-3 py-2 bg-emerald-600 text-white rounded" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : 'Save resume'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {/* Simple form to edit top-level fields (expandable in your real editor) */}
                    <div className="bg-white p-4 rounded shadow">
                        <label className="block text-sm">Full name</label>
                        <input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full p-2 border rounded mt-1" />

                        <label className="block text-sm mt-3">Title</label>
                        <input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full p-2 border rounded mt-1" />

                        <label className="block text-sm mt-3">Summary</label>
                        <textarea value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} className="w-full p-2 border rounded mt-1 h-28" />
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h4 className="font-medium">Live preview</h4>
                        <div className="mt-3">
                            <div id="resume-preview" className="p-3 border rounded">
                                <TemplateRenderer templateKey={templateKey} resume={editing} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <h4 className="font-medium">Share</h4>
                        <div className="mt-2 text-sm text-slate-500">Save to get a public URL you can share.</div>
                        <div className="mt-3">
                            <button className="px-3 py-2 border rounded" onClick={async () => {
                                await handleSave();
                                if (!editing.publicId && (editing as any)._id) {
                                    alert('Saved — public link ready.');
                                } else {
                                    alert('Saved.');
                                }
                            }}>Save & get link</button>
                        </div>
                    </div>
                </aside>
            </div>

            <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)}>
                <div id="resume-preview-modal" className="p-4 bg-white">
                    <TemplateRenderer templateKey={templateKey} resume={editing} />
                </div>
            </PreviewModal>
        </div>
    );
}
