"use client";

import React, { useEffect, useState, useRef } from 'react';
import templates from '@/components/templates';
import TemplateCard from './TemplateCard';
import Skeleton from '@/components/ui/Skeleton';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TemplateGallery() {
    const [items, setItems] = useState(templates);
    const [visible, setVisible] = useState(8); // Start with more items since they are smaller (A4)
    const [loadingMore, setLoadingMore] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const hasMore = visible < items.length;

    useEffect(() => {
        if (!observerRef.current || !hasMore) return;

        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore) {
                    setLoadingMore(true);
                    // Simulate network delay for effect
                    setTimeout(() => {
                        setVisible((v) => Math.min(items.length, v + 8));
                        setLoadingMore(false);
                    }, 600);
                }
            },
            { rootMargin: '100px' }
        );
        obs.observe(observerRef.current);
        return () => obs.disconnect();
    }, [items.length, loadingMore, hasMore]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {items.slice(0, visible).map((tpl, i) => (
                    <motion.div
                        key={tpl.metadata.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <TemplateCard
                            metadata={tpl.metadata}
                            thumbnail={tpl.metadata.thumbnail}
                            onSelect={() => router.push(`/dashboard/template/${tpl.metadata.key}`)}
                        />
                    </motion.div>
                ))}

                {loadingMore && hasMore && (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={`skeleton-${i}`} className="aspect-[210/297]">
                            <Skeleton className="w-full h-full rounded-md" />
                        </div>
                    ))
                )}
            </div>

            {hasMore ? (
                <div ref={observerRef} className="mt-12 flex justify-center h-20">
                    {/* Invisible trigger or spinner if strictly needed, but skeleton handles visual loading */}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center pb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-400 text-sm">
                        <span>✨</span>
                        <span>You've seen all {items.length} templates</span>
                    </div>
                </motion.div>
            )}
        </>
    );
}
