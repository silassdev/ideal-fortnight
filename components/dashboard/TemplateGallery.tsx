'use client';

import React, { useEffect, useState, useRef } from 'react';
import templates from '@/components/templates';
import TemplateCard from './TemplateCard';
import Skeleton from '@/components/ui/Skeleton';
import { useRouter } from 'next/navigation';

export default function TemplateGallery() {
    const [items, setItems] = useState(templates);
    const [visible, setVisible] = useState(6);
    const [loadingMore, setLoadingMore] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!observerRef.current) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore) {
                    setLoadingMore(true);
                    setTimeout(() => {
                        setVisible((v) => Math.min(items.length, v + 6));
                        setLoadingMore(false);
                    }, 400);
                }
            },
            { rootMargin: '200px' }
        );
        obs.observe(observerRef.current);
        return () => obs.disconnect();
    }, [items.length, loadingMore]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.slice(0, visible).map((tpl) => (
                    <TemplateCard
                        key={tpl.metadata.key}
                        metadata={tpl.metadata}
                        thumbnail={tpl.metadata.thumbnail}
                        onSelect={() => router.push(`/dashboard/template/${tpl.metadata.key}`)}
                    />
                ))}

                {visible < items.length &&
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
            </div>

            <div ref={observerRef} className="mt-6">{loadingMore ? <div className="text-sm text-slate-500">Loading more…</div> : null}</div>
        </>
    );
}
