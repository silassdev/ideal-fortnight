'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

export type TemplateEditingState<T = any> = {
    editing: T;
    setEditing: (next: T | ((prev: T) => T)) => void;
    isEditing: boolean;
    setEditingMode: (v: boolean) => void;
    toggleEditingMode: () => void;
};

/**
 * TemplateWrapper provides a small editing context used by templates.
 *
 * Usage:
 * <TemplateWrapper initialData={resumeData}>
 *   <YourTemplate />
 * </TemplateWrapper>
 *
 * Inside template components use `useTemplateMode()` to read/write editing state
 * and to switch between edit/export modes.
 */
const TemplateContext = createContext<TemplateEditingState | undefined>(undefined);

export function useTemplateMode<T = any>(): TemplateEditingState<T> {
    const ctx = useContext(TemplateContext as React.Context<TemplateEditingState | undefined>);
    if (!ctx) throw new Error('useTemplateMode must be used inside TemplateWrapper');
    return ctx as TemplateEditingState<T>;
}

export default function TemplateWrapper<T = any>({
    children,
    initialData,
    initialEditMode = true,
}: {
    children: React.ReactNode;
    initialData?: T;
    initialEditMode?: boolean;
}) {
    const [editing, setEditingState] = useState<T>((initialData as T) ?? ({} as T));
    const [isEditing, setIsEditing] = useState<boolean>(initialEditMode);

    const setEditing = (next: T | ((prev: T) => T)) => {
        setEditingState((prev) => {
            if (typeof next === 'function') {
                // @ts-ignore - allow function updater
                return (next as (p: T) => T)(prev);
            }
            return next as T;
        });
    };

    const setEditingMode = (v: boolean) => setIsEditing(v);
    const toggleEditingMode = () => setIsEditing((s) => !s);

    const value = useMemo(
        () => ({
            editing,
            setEditing,
            isEditing,
            setEditingMode,
            toggleEditingMode,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editing, isEditing]
    );

    return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
}
