'use client';

import React from 'react';

type Props = {
    template: 'modern' | 'classic';
    accent: 'indigo' | 'emerald' | 'rose';
    compact: boolean;
    showSections: { summary: boolean; experience: boolean; education: boolean; skills: boolean };
};

/**
 * A visual SVG-based "drawing" of a resume.
 * Purpose: demonstrate layout regions, dynamic elements, and which parts change when user toggles tools.
 * This is intentionally stylized and lightweight; replace with actual preview rendering when ready.
 */
export default function ResumeDrawing({ template, accent, compact, showSections }: Props) {
    const accentMap: Record<string, string> = {
        indigo: 'fill-indigo-600',
        emerald: 'fill-emerald-600',
        rose: 'fill-rose-600',
    };

    const accentColor = accentMap[accent] ?? accentMap['indigo'];

    // small helper for dashed highlight if a section is toggled off
    const dimIfHidden = (visible: boolean) => (visible ? 'opacity-100' : 'opacity-30 grayscale');

    return (
        <div className="relative w-full max-w-3xl mx-auto p-4 bg-slate-50 rounded-md">
            {/* Paper mock */}
            <div
                id="resume-preview"
                className={`mx-auto bg-white rounded shadow-sm border overflow-hidden transform transition-all ${compact ? 'scale-95' : 'scale-100'
                    }`}
                style={{ maxWidth: 800 }}
            >
                {/* header */}
                <div className={`p-6 ${template === 'modern' ? 'flex items-center gap-6' : ''}`}>
                    {/* avatar */}
                    <div className="flex-shrink-0">
                        <div className={`w-20 h-20 rounded-full bg-slate-200 ${accent === 'indigo' ? 'ring-4 ring-indigo-100' : ''}`} />
                    </div>

                    <div className="flex-1">
                        <div className={`h-4 rounded ${accent === 'indigo' ? 'bg-indigo-500' : accent === 'emerald' ? 'bg-emerald-500' : 'bg-rose-500'} w-3/4`}></div>
                        <div className="mt-3 space-y-2">
                            <div className="h-3 w-1/2 bg-slate-200 rounded" />
                            <div className="h-2 w-1/3 bg-slate-100 rounded" />
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {/* contact row */}
                    <div className="flex gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-300" />
                            <span>Location</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-300" />
                            <span>Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-300" />
                            <span>Phone</span>
                        </div>
                    </div>

                    {/* body grid */}
                    <div className={`mt-6 grid ${template === 'modern' ? 'grid-cols-3 gap-6' : 'grid-cols-1'}`}>
                        {/* Left column (if modern) or full width */}
                        <div className={`${template === 'modern' ? 'col-span-2' : 'col-span-1'}`}>
                            {/* Summary */}
                            <div className={`rounded p-4 border ${dimIfHidden(showSections.summary)} mb-4`}>
                                <div className="h-3 w-1/3 bg-slate-200 rounded" />
                                <div className="mt-2 space-y-2">
                                    <div className="h-2 w-full bg-slate-100 rounded" />
                                    <div className="h-2 w-5/6 bg-slate-100 rounded" />
                                    <div className="h-2 w-2/3 bg-slate-100 rounded" />
                                </div>
                                <div className="mt-3 text-xs text-slate-400">Summary section — toggles with editor</div>
                            </div>

                            {/* Experience */}
                            <div className={`rounded p-4 border ${dimIfHidden(showSections.experience)} mb-4`}>
                                <div className="flex justify-between items-center">
                                    <div className="h-3 w-1/4 bg-slate-200 rounded" />
                                    <div className={`h-3 w-12 rounded ${accent === 'indigo' ? 'bg-indigo-600' : accent === 'emerald' ? 'bg-emerald-600' : 'bg-rose-600'} `} />
                                </div>
                                <div className="mt-3 space-y-2">
                                    <div className="h-2 w-full bg-slate-100 rounded" />
                                    <div className="h-2 w-4/5 bg-slate-100 rounded" />
                                    <div className="h-2 w-3/4 bg-slate-100 rounded" />
                                </div>
                                <div className="mt-3 text-xs text-slate-400">Experience entries — reorderable in editor (demo)</div>
                            </div>

                            {/* Projects (sample) */}
                            <div className="rounded p-4 border mb-4">
                                <div className="h-3 w-1/6 bg-slate-200 rounded" />
                                <div className="mt-2 space-y-2">
                                    <div className="h-2 w-3/4 bg-slate-100 rounded" />
                                    <div className="h-2 w-1/2 bg-slate-100 rounded" />
                                </div>
                            </div>
                        </div>

                        {/* Right column (sidebar for modern) */}
                        <aside className={`${template === 'modern' ? 'col-span-1' : ''}`}>
                            {/* Education */}
                            <div className={`rounded p-4 border mb-4 ${dimIfHidden(showSections.education)}`}>
                                <div className="h-3 w-1/3 bg-slate-200 rounded" />
                                <div className="mt-2 space-y-2">
                                    <div className="h-2 w-full bg-slate-100 rounded" />
                                </div>
                                <div className="mt-2 text-xs text-slate-400">Education (toggleable)</div>
                            </div>

                            {/* Skills */}
                            <div className={`rounded p-4 border mb-4 ${dimIfHidden(showSections.skills)}`}>
                                <div className="h-3 w-1/3 bg-slate-200 rounded" />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <div className="h-6 px-2 rounded bg-slate-100 text-xs">React</div>
                                    <div className="h-6 px-2 rounded bg-slate-100 text-xs">TypeScript</div>
                                    <div className="h-6 px-2 rounded bg-slate-100 text-xs">Tailwind</div>
                                </div>
                                <div className="mt-2 text-xs text-slate-400">Skills — badges reflect data-driven tags</div>
                            </div>

                            {/* Quick actions (visual only) */}
                            <div className="rounded p-3 border">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-slate-500">Tools</div>
                                    <div className="text-xs text-slate-400">live</div>
                                </div>
                                <div className="mt-3 grid gap-2">
                                    <div className="h-8 flex items-center gap-2 px-3 bg-slate-50 rounded text-sm">
                                        <span className="w-3 h-3 rounded-full bg-slate-300" />
                                        Template Switch
                                    </div>
                                    <div className="h-8 flex items-center gap-2 px-3 bg-slate-50 rounded text-sm">
                                        <span className="w-3 h-3 rounded-full bg-slate-300" />
                                        Download PDF
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* tiny legend describing "dynamic elements & logic" */}
                <div className="mt-4 text-xs text-slate-500">
                    <strong>Legend:</strong> Sections can be toggled, reordered, and styled. Tools include template switch, accent color, compact mode, and export.
                </div>
            </div>
        </div>
    );
}
