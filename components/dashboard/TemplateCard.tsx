'use client';

import React from 'react';

export default function TemplateCard({
    metadata,
    thumbnail,
    onSelect,
}: {
    metadata: { key: string; title: string; description?: string; author?: string; authorUrl?: string };
    thumbnail?: string;
    onSelect: () => void;
}) {
    return (
        <div className="bg-white border rounded shadow-sm overflow-hidden">
            <div className="h-40 bg-slate-100 flex items-center justify-center">
                {thumbnail ? (
                    // keep image small; prefer public/templates/<key>.png
                    // use next/image if desired
                    <img src={thumbnail} alt={`${metadata.title} thumbnail`} className="object-cover w-full h-full" />
                ) : (
                    <div className="text-slate-400">{metadata.title}</div>
                )}
            </div>

            <div className="p-3">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="font-medium">{metadata.title}</div>
                        <div className="text-xs text-slate-500">{metadata.description}</div>
                    </div>
                    <button onClick={onSelect} className="px-3 py-1 bg-sky-600 text-white rounded text-sm">Select</button>
                </div>

                <div className="text-xs text-slate-400 mt-2">
                    {metadata.author ? (<a href={metadata.authorUrl} target="_blank" rel="noreferrer" className="underline">{metadata.author}</a>) : null}
                </div>
            </div>
        </div>
    );
}
