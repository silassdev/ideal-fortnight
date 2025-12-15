"use client";

import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Shared Helper Components ---

export const InlineInput = ({
    value,
    onChange,
    className = "",
    placeholder = "...",
    multiline = false,
    isPreview = false,
    onBlur,
}: {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    isPreview?: boolean;
    onBlur?: () => void;
}) => {
    const baseStyles = "bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-200 rounded px-1 transition-all w-full leading-normal";

    if (isPreview) {
        if (!value) return null;
        return (
            <div className={`${className} whitespace-pre-wrap`}>
                {value}
            </div>
        );
    }

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value, multiline]);

    const safeValue = value ?? "";

    if (multiline) {
        return (
            <textarea
                ref={textareaRef}
                value={safeValue}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                className={`${baseStyles} resize-none overflow-hidden ${className}`}
                placeholder={placeholder}
                rows={1}
            />
        );
    }
    return (
        <input
            type="text"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={`${baseStyles} ${className}`}
            placeholder={placeholder}
        />
    );
};

export const SectionHeader = ({ title, onChange, className = "", isPreview }: { title: string, onChange: (val: string) => void, className?: string, isPreview?: boolean }) => {
    if (isPreview) {
        return (
            <h2 className={`text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 ${className}`}>
                {title}
            </h2>
        );
    }
    return (
        <div className={`mb-4 border-b border-slate-100 pb-2 ${className}`}>
            <input
                value={title ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-200 rounded px-1 w-full"
            />
        </div>
    );
};

export const ContactItem = ({ value, icon, onChange, placeholder, isPreview }: any) => {
    if (isPreview && !value) return null;
    return (
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <span className="text-slate-400">{icon}</span>
            <InlineInput value={value} onChange={onChange} className="w-auto min-w-[100px]" placeholder={placeholder} isPreview={isPreview} />
        </div>
    );
};


// --- Sortable Components ---

export const DragHandle = ({ attributes, listeners, isPreview }: { attributes: any, listeners: any, isPreview: boolean }) => {
    if (isPreview) return null;
    return (
        <div
            {...attributes}
            {...listeners}
            className="absolute -left-6 top-1 p-1.5 cursor-grab opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-opacity"
            title="Drag to reorder"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
        </div>
    );
};

export const DeleteButton = ({ onDelete, isPreview }: { onDelete: () => void, isPreview: boolean }) => {
    if (isPreview) return null;
    return (
        <button
            onClick={onDelete}
            className="absolute -right-6 top-1 p-1.5 cursor-pointer opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
            title="Remove item"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
        </button>
    );
};

export const SortableItemWrapper = ({ id, children, onDelete, isPreview }: { id: string, children: React.ReactNode, onDelete: () => void, isPreview: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 1,
        opacity: isDragging ? 0.4 : 1,
    };

    if (isPreview) {
        return <div className="mb-4">{children}</div>;
    }

    return (
        <div ref={setNodeRef} style={style} className="group relative mb-4 break-inside-avoid hover:bg-slate-50/50 rounded -mx-2 px-2 transition-colors">
            <DragHandle attributes={attributes} listeners={listeners} isPreview={false} />
            {children}
            <DeleteButton onDelete={onDelete} isPreview={false} />
        </div>
    );
};
