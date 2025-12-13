import React from 'react';
import { Undo2, Redo2, Save, Download, Eye, EyeOff, FileText, Loader2 } from 'lucide-react';

interface EditorToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onSave: () => void;
    isSaving: boolean;
    isDirty: boolean;
    onPreviewToggle: () => void;
    isPreview: boolean;
    onDownload: () => void;
}

export const EditorToolbar = ({
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onSave,
    isSaving,
    isDirty,
    onPreviewToggle,
    isPreview,
    onDownload
}: EditorToolbarProps) => {
    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl rounded-full px-4 py-2 flex items-center gap-4 print:hidden transition-all hover:shadow-2xl">
            <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
                    title="Undo"
                >
                    <Undo2 size={18} />
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
                    title="Redo"
                >
                    <Redo2 size={18} />
                </button>
            </div>

            <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                <button
                    onClick={onPreviewToggle}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isPreview
                            ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                >
                    {isPreview ? <Eye size={16} /> : <EyeOff size={16} />}
                    {isPreview ? 'Previewing' : 'Editing'}
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onSave}
                    disabled={isSaving || !isDirty}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isDirty
                            ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100'
                            : 'text-slate-400 cursor-default'
                        }`}
                >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? 'Saving...' : 'Save'}
                </button>

                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-medium shadow-md transition-all hover:shadow-lg active:scale-95"
                >
                    <Download size={16} />
                    Download PDF
                </button>
            </div>
        </div>
    );
};
