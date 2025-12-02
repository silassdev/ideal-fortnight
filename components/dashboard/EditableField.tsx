'use client';

/**
 * EditableField - Makes resume fields editable when in edit mode
 * Wraps text content and makes it click-to-edit while preserving the original styling
 */

import React from 'react';
import { useEditing } from './TemplateEditor';
import EditableText from './EditableText';

interface EditableFieldProps {
    field: 'name' | 'title' | 'summary' | 'email' | 'phone' | 'location' | 'website' | 'linkedin' | 'github';
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
    fallback?: string;
}

export default function EditableField({ field, className = '', placeholder, multiline = false, as = 'span', fallback }: EditableFieldProps) {
    // Try to get editing context
    let editingContext = null;
    try {
        editingContext = useEditing();
    } catch {
        // Not in editing mode
    }

    const { editing, setEditing, isEditMode } = editingContext || {};

    // Get current value based on field
    const getValue = () => {
        if (!editing) return fallback || '';

        if (field === 'name' || field === 'title' || field === 'summary') {
            return editing[field] || '';
        }

        // Contact fields
        return editing.contact?.[field] || '';
    };

    // Set value based on field
    const setValue = (val: string) => {
        if (!editing || !setEditing) return;

        if (field === 'name' || field === 'title' || field === 'summary') {
            setEditing({ ...editing, [field]: val });
        } else {
            // Contact field
            setEditing({
                ...editing,
                contact: { ...editing.contact, [field]: val }
            });
        }
    };

    const value = getValue();

    if (!isEditMode || !editing || !setEditing) {
        // Not in edit mode, render value directly
        const Component = as;
        return <Component className={className}>{value || fallback || placeholder}</Component>;
    }

    // In edit mode, use EditableText
    return (
        <EditableText
            as={as}
            className={className}
            value={value}
            onChange={setValue}
            placeholder={placeholder || fallback || `Enter ${field}`}
            multiline={multiline}
        />
    );
}
