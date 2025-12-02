'use client';

import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

export default function EditableText({
    value,
    onChange,
    className = '',
    placeholder = 'Click to edit',
    multiline = false,
    as: Component = 'span'
}: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onChange(tempValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            handleBlur();
        }
        if (e.key === 'Escape') {
            setTempValue(value);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        const sharedProps = {
            ref: inputRef as any,
            value: tempValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTempValue(e.target.value),
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            className: `${className} outline-none ring-2 ring-indigo-500 rounded px-1`,
            placeholder
        };

        if (multiline) {
            return <textarea {...sharedProps} rows={3} />;
        }
        return <input type="text" {...sharedProps} />;
    }

    return (
        <Component
            onClick={handleClick}
            className={`${className} cursor-pointer hover:bg-indigo-50/50 hover:outline hover:outline-1 hover:outline-indigo-300 rounded px-1 transition-colors ${!value ? 'text-slate-400 italic' : ''}`}
            title="Click to edit"
        >
            {value || placeholder}
        </Component>
    );
}
