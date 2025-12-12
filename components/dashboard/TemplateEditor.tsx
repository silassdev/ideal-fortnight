'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import PreviewModal from './PreviewModal';
import { saveResume as apiSave } from '@/lib/resumeClient';
import useResume from '@/hooks/useResume';
import { downloadPdfSafe, downloadDoc } from '@/lib/downloadResume';
import { Eye, Save, FileText, FileDown, Share2, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ResumeShape } from '@/types/template';
import EditableText from './EditableText';

/**
 * EditingContext - exposes the editing state and setter for templates and subcomponents (EditableText etc.)
 */
const EditingContext = createContext<{
    editing: ResumeShape;
    setEditing: (resume: ResumeShape) => void;
    isEditMode: boolean;
} | null>(null);

export function useEditing() {
    const context = useContext(EditingContext);
    if (!context) throw new Error('useEditing must be used within EditingContext');
    return context;
}

export default function TemplateEditor({ templateKey }: { templateKey: string }) {
    const { resume, setResume } = useResume();
    const [editing, setEditing] = useState<ResumeShape>(() =>
        (resume as ResumeShape) ?? {
            template: templateKey,
            name: '',
            title: '',
            summary: '',
            contact: {},
            experience: [],
            education: [],
            skills: [],
        }
    );

    const [previewOpen, setPreviewOpen] = useState(false);
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        setEditing((r) => ({ ...(r ?? {}), template: templateKey }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateKey]);

    async function handleSave() {
        setSaving(true);
        try {
            const res = await apiSave(editing);
            if (res.ok && res.data) {
                setResume(res.data);
            } else {
                console.error('Save failed', res);
                alert('Save failed. See console.');
            }
        } catch (err) {
            console.error('Save error', err);
            alert('Save error. See console.');
        } finally {
            setSaving(false);
        }
    }

    async function handleSaveAndLink() {
        await handleSave();
        alert('Saved — resume link updated in your dashboard.');
    }

    function handleDownloadPdf() {
        // Prefer print for CSS-aware output; you can also call downloadPdfSafe for programmatic PDF
        try {
            window.print();
        } catch (err) {
            console.warn('print fallback failed, trying programmatic pdf', err);
            const el = document.getElementById('resume-editor-canvas');
            if (el) downloadPdfSafe(el as HTMLElement, { filename: `${editing.name || 'resume'}.pdf` });
            else alert('Preview not available for PDF generation.');
        }
    }

    async function handleDownloadDoc() {
        await downloadDoc(editing, { filename: `${editing.name || 'resume'}.doc` });
    }



    return (
        <EditingContext.Provider value={{ editing, setEditing, isEditMode: true }}>
            <div className="min-h-screen bg-slate-50/50">
                {/* Toolbar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 toolbar">
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-semibold text-slate-900">Editing {templateKey}</h1>
                                <p className="text-xs text-slate-500">
                                    Click on any text to edit • Last saved: {resume?.updatedAt ? new Date(resume.updatedAt).toLocaleTimeString() : 'Unsaved'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                            <button
                                onClick={() => setPreviewOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                            >
                                <Eye className="w-4 h-4" />
                                Preview
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
                                title="Print or Save as PDF"
                            >
                                <FileDown className="w-4 h-4" />
                                Print / PDF
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

                {/* Template Rendered Inline with Editing */}
                <main className="max-w-5xl mx-auto px-6 py-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-900">
                        <p className="font-medium">✨ Click on any text in the template below to edit it</p>
                        <p className="text-xs mt-1 text-amber-700">The template will maintain its original layout and design</p>
                    </div>

                    <div id="resume-editor-canvas" className="bg-white shadow-xl rounded-lg overflow-hidden">
                        {/* TemplateRenderer should use EditableText / useEditing() internally */}
                        <TemplateRenderer templateKey={editing.template || templateKey} resume={editing} />
                    </div>
                </main>

                {/* Preview Modal */}
                <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)}>
                    <div id="resume-preview-modal" className="p-4 bg-white min-h-[800px]">
                        <TemplateRenderer templateKey={editing.template || templateKey} resume={editing} />
                    </div>
                </PreviewModal>
            </div>
        </EditingContext.Provider>
    );
}

// export context for templates to consume
export { EditingContext };
