import { ResumeShape } from '@/types/resume';
import React from 'react';

export type TemplateKey = string;

export type TemplateMetadata = {
    key: TemplateKey;           // unique id, e.g. 'apela'
    title: string;              // user-facing name
    description?: string;
    author?: string;            // e.g. 'Jane Doe'
    authorUrl?: string;         // e.g. 'https://github.com/janedoe'
    thumbnail?: string;         // optional path under /public (e.g. '/templates/apela.png')
    tags?: string[];            // e.g. ['two-column', 'modern']
    createdAt?: string;
    updatedAt?: string;
};

export type TemplateComponentProps = {
    resume: ResumeShape;
    className?: string;
};

export type TemplateExport = {
    default: React.ComponentType<TemplateComponentProps>;
    metadata: TemplateMetadata;
};
