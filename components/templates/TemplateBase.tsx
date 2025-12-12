'use client';
import React from 'react';
import { useTemplateMode } from './TemplateWrapper';

export type TemplateProps<T> = {
    data: T;
    onChange: (next: T) => void;
    onSave?: () => Promise<void> | void;
    onPreview?: () => void;
    className?: string;
};

/** InlineField: editable or static depending on template mode */
export function InlineField({ value, onChange, placeholder, className, multiline = false }: {
    value: string | undefined;
    onChange?: (v: string) => void;
    placeholder?: string;
    className?: string;
    multiline?: boolean;
}) {
    const { isEditing } = useTemplateMode();

    if (!isEditing) {
        return <span className={className}>{value || placeholder || ''}</span>;
    }

    if (multiline) {
        return <textarea className={className} value={value || ''} onChange={(e) => onChange?.(e.target.value)} />;
    }
    return <input className={className} value={value || ''} onChange={(e) => onChange?.(e.target.value)} />;
}

/** TemplateBase provides a simple layout wrapper for templates */
export default function TemplateBase<T>({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`template-base ${className || ''}`}>
            {children}
        </div>
    );
}
