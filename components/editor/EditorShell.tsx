"use client";

import React from 'react';
import { EditorToolbar } from '@/components/ui/EditorToolbar';
import SaveStatusModal from '@/components/ui/SaveStatusModal';

interface EditorShellProps {
    editorState: any;
    children: React.ReactNode;
}

export default function EditorShell({ editorState, children }: EditorShellProps) {
    const {
        historyIndex,
        history,
        isPreview,
        setIsPreview,
        isSaving,
        isDirty,
        saveStatus,
        setSaveStatus,
        componentRef,
        handleUndo,
        handleRedo,
        handleSave,
        handlePrint,
    } = editorState;

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center gap-6 font-sans">

            {/* Modal */}
            <SaveStatusModal
                isOpen={saveStatus.isOpen}
                status={saveStatus.status}
                onClose={() => setSaveStatus((prev: any) => ({ ...prev, isOpen: false }))}
            />

            {/* Action Bar */}
            <EditorToolbar
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onSave={handleSave}
                isSaving={isSaving}
                isDirty={isDirty}
                onPreviewToggle={() => setIsPreview(!isPreview)}
                isPreview={isPreview}
                onDownload={handlePrint || (() => { })}
            />

            {/* Resume Frame (Printable Area) */}
            <div
                ref={componentRef}
                id="resume-frame"
                className={`bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] relative flex flex-col print:shadow-none print:mx-auto print:w-full print:h-auto print:overflow-visible ${isPreview ? 'pointer-events-none' : ''}`}
                style={{ padding: '40px 50px' }}
            >
                {children}
            </div>

            <style type="text/css" media="print">
                {`
          @page { size: A4; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact; 
            background: white; 
            print-color-adjust: exact;
          }
          #resume-frame {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            box-shadow: none;
            padding: 40px 50px !important;
          }
          /* Hide non-print elements */
          nav, header, footer, button, .no-print { display: none !important; }
        `}
            </style>
        </div>
    );
}
