'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface BulletListEditorProps {
    bullets: string[];
    onChange: (bullets: string[]) => void;
    placeholder?: string;
    className?: string;
}

export default function BulletListEditor({
    bullets = [],
    onChange,
    placeholder = 'Enter a bullet point...',
    className = ''
}: BulletListEditorProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editingIndex !== null && textareaRef.current) {
            textareaRef.current.focus();
            // Auto-resize textarea
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [editingIndex, editValue]);

    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditValue(bullets[index] || '');
    };

    const saveEdit = () => {
        if (editingIndex !== null) {
            const newBullets = [...bullets];
            if (editValue.trim()) {
                newBullets[editingIndex] = editValue.trim();
            } else {
                // Remove empty bullet
                newBullets.splice(editingIndex, 1);
            }
            onChange(newBullets);
        }
        setEditingIndex(null);
        setEditValue('');
    };

    const addBullet = () => {
        onChange([...bullets, '']);
        setEditingIndex(bullets.length);
        setEditValue('');
    };

    const removeBullet = (index: number) => {
        const newBullets = bullets.filter((_, i) => i !== index);
        onChange(newBullets);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveEdit();
            // Add new bullet point
            setTimeout(() => addBullet(), 10);
        } else if (e.key === 'Escape') {
            setEditingIndex(null);
            setEditValue('');
        } else if (e.key === 'Backspace' && editValue === '' && editingIndex !== null) {
            // Remove current bullet if it's empty
            e.preventDefault();
            removeBullet(editingIndex);
            setEditingIndex(null);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {bullets.length === 0 && editingIndex === null ? (
                <div className="text-sm text-slate-400 italic">
                    No bullet points yet. Click + to add.
                </div>
            ) : (
                <ul className="space-y-2">
                    {bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start gap-2 group">
                            <span className="text-slate-600 mt-2 select-none">•</span>
                            {editingIndex === index ? (
                                <textarea
                                    ref={textareaRef}
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={saveEdit}
                                    placeholder={placeholder}
                                    className="flex-1 px-3 py-1.5 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none min-h-[40px]"
                                    rows={1}
                                />
                            ) : (
                                <>
                                    <div
                                        onClick={() => startEditing(index)}
                                        className="flex-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded cursor-pointer border border-transparent hover:border-slate-200"
                                    >
                                        {bullet || <span className="text-slate-400 italic">Empty bullet</span>}
                                    </div>
                                    <button
                                        onClick={() => removeBullet(index)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                                        aria-label="Remove bullet"
                                    >
                                        <X className="w-4 h-4 text-red-600" />
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <button
                onClick={addBullet}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-50 rounded transition-colors"
            >
                <Plus className="w-4 h-4" />
                Add bullet point
            </button>
        </div>
    );
}
