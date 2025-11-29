'use client';

import React from 'react';
import templates from '@/components/templates';

type Props = {
    value: string;
    onChange: (key: string) => void;
};

export default function TemplatePicker({ value, onChange }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {templates.map((tpl) => (
                <button
                    key={tpl.metadata.key}
                    onClick={() => onChange(tpl.metadata.key)}
                    className={`p-3 border rounded text-left hover:shadow-sm ${value === tpl.metadata.key ? 'border-sky-600 ring-2 ring-sky-100' : 'border-slate-200'}`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">{tpl.metadata.title}</div>
                            <div className="text-xs text-slate-500">{tpl.metadata.description}</div>
                            <div className="text-xs text-slate-400 mt-2">
                                {tpl.metadata.author ? (
                                    <>
                                        by <a href={tpl.metadata.authorUrl} target="_blank" rel="noreferrer" className="underline">{tpl.metadata.author}</a>
                                    </>
                                ) : null}
                            </div>
                        </div>
                        <div className="ml-2">
                            {tpl.metadata.thumbnail ? (
                                <img src={tpl.metadata.thumbnail} alt={`${tpl.metadata.title} thumbnail`} className="w-16 h-10 object-cover rounded" />
                            ) : (
                                <div className="w-16 h-10 bg-slate-100 border rounded" />
                            )}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}
