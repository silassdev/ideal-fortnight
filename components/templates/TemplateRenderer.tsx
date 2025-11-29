'use client';

import React from 'react';
import templates from '@/components/templates'; // generated index
import { ResumeShape } from '@/types/resume';

type Props = {
    templateKey?: string;
    resume: ResumeShape;
    className?: string;
};

export default function TemplateRenderer({ templateKey = 'apela', resume, className = '' }: Props) {
    // find template in registry
    const tpl = templates.find((t) => t.metadata?.key === templateKey) || templates[0];

    if (!tpl) {
        return <div className={className}>No templates available</div>;
    }

    const TemplateComponent = tpl.component as React.ComponentType<{ resume: ResumeShape; className?: string }>;
    return <TemplateComponent resume={resume} className={className} />;
}
