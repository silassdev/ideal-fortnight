"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
        <motion.div
            className="relative cursor-pointer group bg-white rounded-md shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200"
            style={{ aspectRatio: '210/297' }} // A4 Ratio
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelect}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
        >
            {/* Thumbnail Image */}
            <div className="absolute inset-0 bg-slate-100">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={metadata.title}
                        className="w-full h-full object-cover object-top"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-300 font-bold text-2xl uppercase tracking-widest">
                        {metadata.title.substring(0, 2)}
                    </div>
                )}
            </div>

            {/* Hover Overlay */}
            <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-white text-xl font-bold mb-1 transform translate-y-0 transition-transform duration-300">
                    {metadata.title}
                </h3>
                {metadata.description && (
                    <p className="text-slate-200 text-xs line-clamp-3 mb-4 max-w-[80%]">
                        {metadata.description}
                    </p>
                )}

                <button className="bg-white text-slate-900 px-6 py-2 rounded-full text-sm font-semibold hover:bg-slate-100 transition-colors">
                    Use Template
                </button>
            </div>
        </motion.div>
    );
}
