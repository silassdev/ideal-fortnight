'use client';

import React, { useState } from 'react';

export default function TemplateCard({
    metadata,
    thumbnail,
    onSelect,
}: {
    metadata: { key: string; title: string; description?: string; author?: string; authorUrl?: string };
    thumbnail?: string;
    onSelect: () => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="bg-white border rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelect}
        >
            <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {thumbnail ? (
                    <img src={thumbnail} alt={`${metadata.title} thumbnail`} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" />
                ) : (
                    <div className="text-slate-400">{metadata.title}</div>
                )}

                {/* Hover Overlay with Template Name */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-white text-center">
                        <div className="text-lg font-bold">{metadata.title}</div>
                        <div className="text-xs text-white/80">{metadata.description}</div>
                    </div>
                </div>
            </div>

            <div className="p-3">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="font-medium text-slate-900">{metadata.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{metadata.description}</div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        className="px-3 py-1 bg-sky-600 text-white rounded text-sm hover:bg-sky-700 transition-colors"
                    >
                        Select
                    </button>
                </div>

                <div className="text-xs text-slate-400 mt-2">
                    {metadata.author ? (<a href={metadata.authorUrl} target="_blank" rel="noreferrer" className="underline hover:text-sky-600">{metadata.author}</a>) : null}
                </div>
            </div>
        </div>
    );
}
