'use client';
import React, { useCallback, useState } from 'react';

type ResumePayload = {
    name?: string;
    title?: string;
    summary?: string;
    contact?: any;
    experience?: any[];
    education?: any[];
    skills?: string[];
    meta?: any;
};

export default function DragDropImporter({ onImported }: { onImported: (resume: ResumePayload) => void }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleFile = useCallback(async (file: File) => {
        setLoading(true);
        setMessage(null);
        try {
            const name = file.name.toLowerCase();
            if (name.endsWith('.json')) {
                const text = await file.text();
                const parsed = JSON.parse(text);
                const mapped = mapJsonResume(parsed);
                onImported(mapped);
                setMessage('Imported JSON resume.');
            } else if (name.endsWith('.txt') || file.type === 'text/plain') {
                const text = await file.text();
                const mapped = mapPlainTextResume(text);
                onImported(mapped);
                setMessage('Imported plain text resume (best-effort).');
            } else {
                const text = await file.text();
                try {
                    const parsed = JSON.parse(text);
                    onImported(mapJsonResume(parsed));
                    setMessage('Imported as JSON.');
                } catch {
                    const mapped = mapPlainTextResume(text);
                    onImported(mapped);
                    setMessage('Imported by text parsing.');
                }
            }
        } catch (err: any) {
            setMessage('Import failed: ' + (err?.message || 'unknown'));
        } finally {
            setLoading(false);
        }
    }, [onImported]);

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
        handleFile(e.dataTransfer.files[0]);
    };

    const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        handleFile(e.target.files[0]);
        e.currentTarget.value = '';
    };

    return (
        <div className="p-4 border-2 border-dashed rounded text-center bg-white">
            <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="p-6"
            >
                <div className="text-sm text-slate-500">Drag & drop a resume file (JSON / TXT). Or</div>
                <label className="mt-3 inline-block cursor-pointer text-sky-600">
                    <input onChange={onSelect} type="file" accept=".json,.txt,text/*" className="hidden" />
                    <span className="underline">select a file</span>
                </label>
            </div>

            {loading && <div className="text-xs mt-2 text-slate-500">Parsing...</div>}
            {message && <div className="text-xs mt-2 text-slate-600">{message}</div>}
        </div>
    );
}

function mapJsonResume(src: any) {
    const basics = src.basics || {};
    const experience = (src.work || []).map((w: any, i: number) => ({
        id: (w.id || `imp-${i}`) + '',
        role: w.position || w.title || '',
        company: w.company || '',
        startDate: w.startDate || w.start || '',
        endDate: w.endDate || w.end || '',
        description: (w.summary || w.highlights || []).join(' ') || w.description || '',
    }));

    const education = (src.education || []).map((ed: any, i: number) => ({
        id: (ed.id || `edu-${i}`) + '',
        school: ed.institution || ed.school || '',
        degree: ed.area || ed.studyType || ed.degree || '',
        start: ed.startDate || '',
        end: ed.endDate || '',
        notes: ed.description || '',
    }));

    const skills = (src.skills || []).map((s: any) => (typeof s === 'string' ? s : s.name || s.keywords?.join(',') || ''));

    return {
        name: basics.name || '',
        title: basics.label || '',
        summary: basics.summary || basics.description || '',
        contact: {
            email: basics.email || '',
            phone: basics.phone || '',
            location: basics.location?.city ? `${basics.location.city}${basics.location.region ? ', ' + basics.location.region : ''}` : basics.location?.city || '',
            website: basics.website || basics.url || '',
        },
        experience,
        education,
        skills,
        meta: { importedFrom: 'jsonresume' },
    };
}

/** Heuristic text parser — quick extraction using regex heuristics */
function mapPlainTextResume(text: string) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const res: any = { name: '', title: '', summary: '', contact: {}, experience: [], education: [], skills: [] };

    if (lines.length > 0) res.name = lines[0];
    if (lines.length > 1) res.title = lines[1];

    const yearRange = /\b(19|20)\d{2}\s*(–|-|to)\s*(Present|(19|20)\d{2})/i;
    let currentExp: any = null;
    lines.forEach((ln) => {
        if (yearRange.test(ln)) {
            if (currentExp) res.experience.push(currentExp);
            currentExp = { id: `imp-${res.experience.length + 1}`, role: '', company: '', startDate: '', endDate: '', description: ln };
        } else {
            if (currentExp) {
                currentExp.description += ' ' + ln;
            } else {
                // fallback collect into summary
                res.summary += (res.summary ? ' ' : '') + ln;
            }
        }
    });
    if (currentExp) res.experience.push(currentExp);

    // very naive: collect words that look like skills (comma separated) at end
    const lastLine = lines[lines.length - 1] || '';
    if (lastLine.includes(',')) res.skills = lastLine.split(',').map(s => s.trim()).slice(0, 20);

    return res;
}
