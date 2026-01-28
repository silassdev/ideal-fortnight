'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { flushSync } from 'react-dom';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import PreviewModal from './PreviewModal';
import SaveStatusModal from '@/components/ui/SaveStatusModal';
import ShareModal from '@/components/ui/ShareModal';

import { useResumeEditor } from '@/hooks/useResumeEditor';
import useResume from '@/hooks/useResume';

import { downloadPdfSafe, downloadDoc } from '@/lib/downloadResume';
import { Eye, Save, FileText, FileDown, Share2, Loader2, ChevronLeft, Undo, Redo } from 'lucide-react';
import Link from 'next/link';
import { ResumeShape } from '@/types/resume';

/**
 * EditingContext - Legacy support for 'Apela', 'Aurora' (old), etc.
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
    const { resume: fetchedResume, isLoading: isFetching } = useResume();

    if (isFetching) {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;
    }

    return <RenderEditor templateKey={templateKey} initialData={fetchedResume} />;
}

function RenderEditor({ templateKey, initialData }: { templateKey: string, initialData: any }) {
    const editorState = useResumeEditor(initialData);
    const { data, isDirty, isSaving, saveStatus, history, historyIndex, undo, redo, handleSave } = editorState;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const containerWidth = Math.min(window.innerWidth - 32, 900);
            const targetWidth = 794;
            if (containerWidth < targetWidth) {
                setScale(containerWidth / targetWidth);
            } else {
                setScale(1);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (data.template !== templateKey) {
            editorState.updateRoot('template', templateKey);
        }
    }, [templateKey]);

    const setEditingBridge = (newData: ResumeShape) => {
        if (editorState.setData) {
            editorState.setData(newData as any);
        }
    };

    async function handleSaveAndLink() {
        setShareOpen(true);
    }

    async function handleTogglePublic() {
        const newStatus = !data.isPublic;
        editorState.updateRoot('isPublic', newStatus);
        await handleSave();
    }

    function handleDownloadPdf() {
        try {
            flushSync(() => {
                editorState.setIsPreview(true);
            });
            window.print();
        } catch (err) {
            console.warn('print fallback failed', err);
            const el = document.getElementById('resume-editor-canvas');
            if (el) downloadPdfSafe(el as HTMLElement, { filename: `${data.name || 'resume'}.pdf` });
        } finally {
            setTimeout(() => {
                editorState.setIsPreview(false);
            }, 500);
        }
    }

    async function handleDownloadDoc() {
        await downloadDoc(data, { filename: `${data.name || 'resume'}.doc` });
    }

    return (
        <EditingContext.Provider value={{ editing: data, setEditing: setEditingBridge, isEditMode: true }}>
            <div className="min-h-screen bg-slate-50/50">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2 sm:py-4 toolbar print:hidden">
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-sm sm:text-lg font-semibold text-slate-900 line-clamp-1">Editing {templateKey}</h1>
                                    <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">
                                        {isDirty ? 'Unsaved changes' : 'All changes saved'}
                                    </p>
                                </div>
                            </div>
                            <div className="sm:hidden text-[10px] text-slate-400">
                                {isDirty ? 'Unsaved' : 'Saved'}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                            <div className="flex bg-slate-100 rounded-lg p-1 mr-2 shrink-0">
                                <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition-colors">
                                    <Undo className="w-4 h-4" />
                                </button>
                                <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition-colors">
                                    <Redo className="w-4 h-4" />
                                </button>
                            </div>

                            <button onClick={() => setPreviewOpen(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">Preview</span>
                            </button>

                            <button onClick={handleDownloadDoc} className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <FileText className="w-4 h-4" />
                                <span className="hidden sm:inline">DOC</span>
                            </button>

                            <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <FileDown className="w-4 h-4" />
                                <span className="hidden sm:inline">PDF</span>
                            </button>

                            <div className="h-6 w-px bg-slate-200 mx-1 shrink-0 hidden sm:block" />

                            <button onClick={handleSaveAndLink} className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <Share2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Link</span>
                            </button>

                            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 sm:px-6 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span className="hidden sm:inline">Save</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-900 hidden sm:block">
                        <p className="font-medium">✨ Click on any text in the template below to edit it</p>
                    </div>

                    <div className="relative w-full flex justify-center">
                        <div
                            style={{
                                transform: `scale(${scale})`,
                                transformOrigin: 'top center',
                                width: '210mm',
                                minWidth: '794px',
                                height: 'auto',
                                marginBottom: scale < 1 ? `-${(1 - scale) * 100}%` : '0px'
                            }}
                            className="transition-transform duration-200 ease-out"
                        >
                            <div id="resume-editor-canvas" className="bg-white shadow-xl rounded-lg overflow-hidden min-h-[1000px]">
                                <TemplateRenderer templateKey={templateKey} resume={data} editorState={editorState} />
                            </div>
                        </div>
                    </div>
                </main>

                <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)}>
                    <div id="resume-preview-modal" className="p-4 bg-white min-h-[800px]">
                        <TemplateRenderer templateKey={templateKey} resume={data} editorState={{ ...editorState, isPreview: true }} />
                    </div>
                </PreviewModal>

                <SaveStatusModal
                    isOpen={saveStatus.isOpen}
                    status={saveStatus.status}
                    onClose={() => editorState.handleSaveStatusClose()}
                />

                <ShareModal
                    isOpen={shareOpen}
                    onClose={() => setShareOpen(false)}
                    isPublic={data.isPublic || false}
                    onTogglePublic={handleTogglePublic}
                    publicUrl={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/resume/${data.publicId || ''}`}
                    isSaving={isSaving}
                />
            </div>
        </EditingContext.Provider>
    );
}

export { EditingContext };
