"use client";

import React, { useState } from 'react';
import { useResumeEditor } from '@/hooks/useResumeEditor';
import EditorShell from '@/components/editor/EditorShell';
import Starter from '@/components/templates/Starter';
import AuroraEditor from '@/components/templates/aurora'; // We can keep Aurora accessible if we want, or eventually refactor it.
// Note: AuroraEditor currently HAS its own internal state management. 
// If we want to switch between them, Aurora needs to be refactored to accept editorState OR we use two different editors.
// For this task, the user asked for "Starter" validation.
// Let's implement a simple selector for specific template testing.

interface ResumeEditorClientProps {
    initialData: any;
}

export default function ResumeEditorClient({ initialData }: ResumeEditorClientProps) {
    // We can default to 'starter' for now to test the new flow
    const [template, setTemplate] = useState<'starter' | 'aurora'>('starter');

    // NOTE: 'aurora' (Legacy) has its own internal state. 
    // 'starter' (New) uses the lifted state.
    // Ideally we refactor Aurora to use the lifted state too.

    const editorState = useResumeEditor(initialData);

    if (template === 'aurora') {
        // Legacy rendering for Aurora (it manages its own state for now)
        return (
            <div>
                {/* Simple switcher for demo purposes */}
                <div className="fixed bottom-4 left-4 z-50 bg-white p-2 border rounded shadow">
                    Template:
                    <select value={template} onChange={(e) => setTemplate(e.target.value as any)} className="ml-2 border rounded">
                        <option value="aurora">Aurora (Legacy)</option>
                        <option value="starter">Starter (New)</option>
                    </select>
                </div>
                <AuroraEditor initialData={initialData} />
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Simple switcher for demo purposes */}
            <div className="fixed bottom-4 left-4 z-50 bg-white p-2 border rounded shadow print:hidden">
                Template:
                <select value={template} onChange={(e) => setTemplate(e.target.value as any)} className="ml-2 border rounded">
                    <option value="aurora">Aurora (Legacy)</option>
                    <option value="starter">Starter (New)</option>
                </select>
            </div>

            <EditorShell editorState={editorState}>
                {/* Here we can dynamically render templates that support the new Architecture */}
                <Starter editorState={editorState} />
            </EditorShell>
        </div>
    );
}
