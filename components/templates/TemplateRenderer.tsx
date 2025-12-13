'use client';

import React from 'react';
import templates from '@/components/templates';
import { ResumeShape } from '@/types/resume';

type Props = {
    templateKey?: string;
    resume: ResumeShape;
    editorState?: any; // Added for new templates
    className?: string;
};

export default function TemplateRenderer({ templateKey = 'apela', resume, editorState, className = '' }: Props) {
    const tpl = templates.find((t) => t.metadata?.key === templateKey) || templates[0];

    if (!tpl) {
        return <div className={className}>No templates available</div>;
    }

    const TemplateComponent = tpl.component as React.ComponentType<{ resume: ResumeShape; editorState?: any; className?: string }>;
    return <TemplateComponent resume={resume} editorState={editorState} className={className} />;
}
