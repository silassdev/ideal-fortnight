'use client';

import React from 'react';

export type CountryDatum = { country: string | null; count: number };

export default function CountryChart({
    data,
    title = 'By country',
    maxBars = 8,
    width = 640,
    heightPerBar = 28,
}: {
    data: CountryDatum[];
    title?: string;
    maxBars?: number;
    width?: number;
    heightPerBar?: number;
}) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-3 rounded shadow">
                <div className="text-sm font-medium mb-2">{title}</div>
                <div className="text-xs text-slate-500">No data</div>
            </div>
        );
    }

    // sort and take top N
    const top = [...data].sort((a, b) => b.count - a.count).slice(0, maxBars);
    const max = Math.max(...top.map((d) => d.count), 1);

    const chartHeight = top.length * heightPerBar + 40;

    return (
        <div className="bg-white p-3 rounded shadow">
            <div className="text-sm font-medium mb-3">{title}</div>
            <svg viewBox={`0 0 ${width} ${chartHeight}`} width="100%" height={chartHeight} role="img" aria-label={title}>
                {top.map((d, i) => {
                    const barMaxWidth = width - 160; // leave room for labels
                    const barWidth = (d.count / max) * barMaxWidth;
                    const y = 20 + i * heightPerBar;
                    const labelY = y + heightPerBar / 2 + 4;
                    return (
                        <g key={d.country ?? `null-${i}`}>
                            {/* country label */}
                            <text x={8} y={labelY} fontSize={12} fill="#334155" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                                {d.country ?? 'Unknown'}
                            </text>

                            {/* bar background */}
                            <rect x={140} y={y + 6} rx={4} ry={4} width={barMaxWidth} height={12} fill="#e6e9ee" />

                            {/* bar value */}
                            <rect x={140} y={y + 6} rx={4} ry={4} width={Math.max(barWidth, 2)} height={12} fill="#0ea5e9" />

                            {/* count label */}
                            <text x={140 + barMaxWidth + 8} y={labelY} fontSize={12} fill="#475569" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                                {d.count}
                            </text>
                        </g>
                    );
                })}
            </svg>
            <div className="text-xs text-slate-500 mt-2">Top {top.length} countries</div>
        </div>
    );
}
