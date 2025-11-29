'use client';

export default function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}
