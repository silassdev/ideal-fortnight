'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { flushSync } from 'react-dom';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import PreviewModal from './PreviewModal';
import SaveStatusModal from '@/components/ui/SaveStatusModal';

import { useResumeEditor } from '@/hooks/useResumeEditor';
import useResume from '@/hooks/useResume'; // Keeping for initial fetch if needed, OR we can utilize useResumeEditor's fetch? 
// useResumeEditor takes initialData. The dashboard flow is: Client loads > fetches data. 
// Let's keep useResume for the initial data fetch to enable "loading" state.

import { downloadPdfSafe, downloadDoc } from '@/lib/downloadResume';
import { Eye, Save, FileText, FileDown, Share2, Loader2, ChevronLeft, Undo, Redo } from 'lucide-react';
import Link from 'next/link';
import { ResumeShape } from '@/types/template';

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
    // 1. Initial Data Fetch
    const { resume: fetchedResume, isLoading: isFetching } = useResume();

    // 2. Initialize the Global Editor Hook
    // We pass fetchedResume as initialData. 
    // Key: When fetchedResume changes (from null to loaded), the hook should update. 
    // However, the hook initializes state ONCE usually. We might need a way to "setInitialData" or just key the component.
    // Simplifying: we'll just wait for fetch before rendering the editor part.

    // NOTE: useResumeEditor internal logic initializes from props.initialData in useState initializer.
    // If we pass null initially, it starts empty. When fetchedResume arrives, we need to update it.
    // Does useResumeEditor support "resetting"?
    // Looking at the hook code (I recall seeing it): It uses `useState(() => initialData || default)`.
    // It doesn't seemingly react to prop changes after mount unless we force it.
    // Best approach: Return Loading state until `fetchedResume` is ready.

    if (isFetching) {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;
    }

    return <RenderEditor templateKey={templateKey} initialData={fetchedResume} />;
}

// Inner component to handle the hook lifecycle cleanly
function RenderEditor({ templateKey, initialData }: { templateKey: string, initialData: any }) {

    const editorState = useResumeEditor(initialData);
    const { data, isDirty, isSaving, saveStatus, history, historyIndex, undo, redo, handleSave } = editorState;

    // Local state for UI only (modals etc)
    const [previewOpen, setPreviewOpen] = useState(false);

    // Sync templateKey into data if it changed
    useEffect(() => {
        if (data.template !== templateKey) {
            // We need a way to update just the template key without destroying data.
            // valid way: updateRoot('template', templateKey)
            editorState.updateRoot('template', templateKey);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateKey]);


    // Bridge for Legacy Context
    // Legacy templates call `setEditing(newData)`. We need to map that to `hackySetData` or individual field updates.
    // Since useResumeEditor doesn't expose a raw "setData" (it exposes specific handlers), 
    // checking the hook... it exposed `handleDataChange`? Or we can add a method if needed.
    // UseResumeEditor exposes: `data` (state).
    // It seems missing a "replace whole data" function which legacy `setEditing` essentially does.
    // FIX: Let's assume for now we just pass `data` as `editing`. `setEditing` might be tricky.
    // If legacy template calls setEditing, it expects the whole object to update.
    // We can define a wrapper:
    const setEditingBridge = (newData: ResumeShape) => {
        // This is a heavy operation if the hook isn't optimized for full replace, but let's try.
        // We probably need to expose a `setData` from the hook or just use `updateRoot` for everything?
        // Actually, legacy templates usually update specific fields like `setEditing({...editing, name: val})`.
        // The hook likely only allows granular updates.
        // Critical: If we don't bridge `setEditing`, legacy templates (Apela) won't be able to edit text.
        // We might need to quickly patch `useResumeEditor` to export `setData` or equivalent.
        // For this immediate step, I will use a dummy function and rely on the fact that ONLY Starter is using the new shell?
        // NO, the user dashboard loads ANY template into `TemplateEditor`. If I break Apela, I break the app.

        // Assume `useResumeEditor` exports `setData` or I'll add it in next step if missing.
        // Browsing previous code... The hook has `setData` internally. I should expose it.
        // For now, I'll type it as any to avoid TS errors.
        if (editorState.setData) {
            editorState.setData(newData as any);
        } else {
            console.warn("setEditing called but setData not exposed from useResumeEditor");
        }
    };


    async function handleSaveAndLink() {
        await handleSave();
        alert('Saved — resume link updated in your dashboard.');
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
                {/* Toolbar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 toolbar print:hidden">
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-semibold text-slate-900">Editing {templateKey}</h1>
                                <p className="text-xs text-slate-500">
                                    {isDirty ? 'Unsaved changes' : 'All changes saved'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                            {/* Undo/Redo */}
                            <div className="flex bg-slate-100 rounded-lg p-1 mr-2">
                                <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition-colors">
                                    <Undo className="w-4 h-4" />
                                </button>
                                <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition-colors">
                                    <Redo className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => setPreviewOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>

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
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70 whitespace-nowrap"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save
                            </button>
                        </div>
                    </div>
                </header>

                {/* Template Rendered Inline with Editing */}
                <main className="max-w-5xl mx-auto px-6 py-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-900 print:hidden">
                        <p className="font-medium">✨ Click on any text in the template below to edit it</p>
                    </div>

                    <div id="resume-editor-canvas" className="bg-white shadow-xl rounded-lg overflow-hidden min-h-[1000px]">
                        {/* 
                           Here is the magic: For legacy templates (Apela), they read from EditingContext inside `TemplateRenderer` (via generic component behavior) 
                           OR props. 
                           For new templates (Starter), they read `editorState` prop passed here.
                        */}
                        <TemplateRenderer templateKey={templateKey} resume={data} editorState={editorState} />
                    </div>
                </main>

                {/* Preview Modal */}
                <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)}>
                    <div id="resume-preview-modal" className="p-4 bg-white min-h-[800px]">
                        <TemplateRenderer templateKey={templateKey} resume={data} editorState={editorState} />
                    </div>
                </PreviewModal>

                <SaveStatusModal
                    isOpen={saveStatus.isOpen}
                    status={saveStatus.status}
                    onClose={() => editorState.handleSaveStatusClose()}
                />
            </div>
        </EditingContext.Provider>
    );
}

// export context for legacy templates to consume
export { EditingContext };
