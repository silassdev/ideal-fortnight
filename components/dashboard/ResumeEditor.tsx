// components/dashboard/ResumeEditor.tsx
'use client';

import React from 'react';
import { ResumeShape } from '@/types/resume';

type Props = {
    resume: ResumeShape;
    onChange: (r: ResumeShape) => void;
    onSave: () => void;
};

export default function ResumeEditor({ resume, onChange, onSave }: Props) {
    // helpers to manipulate arrays
    function addExperience() {
        const ex = { id: Date.now().toString(), company: '', role: '', start: '', end: '', bullets: [''] };
        onChange({ ...resume, experience: [...(resume.experience || []), ex] });
    }
    function updateExperience(idx: number, patch: any) {
        const list = [...(resume.experience || [])];
        list[idx] = { ...list[idx], ...patch };
        onChange({ ...resume, experience: list });
    }
    function removeExperience(idx: number) {
        const list = [...(resume.experience || [])];
        list.splice(idx, 1);
        onChange({ ...resume, experience: list });
    }

    function addEducation() {
        const ed = { id: Date.now().toString(), school: '', degree: '', start: '', end: '' };
        onChange({ ...resume, education: [...(resume.education || []), ed] });
    }

    function addSkill(tag = '') {
        onChange({ ...resume, skills: [...(resume.skills || []), tag] });
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm text-slate-700">Full name</label>
                    <input
                        value={resume.name || ''}
                        onChange={(e) => onChange({ ...resume, name: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm text-slate-700">Title</label>
                    <input
                        value={resume.title || ''}
                        onChange={(e) => onChange({ ...resume, title: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border rounded"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm text-slate-700">Summary</label>
                <textarea
                    value={resume.summary || ''}
                    onChange={(e) => onChange({ ...resume, summary: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded h-28"
                />
            </div>

            <section>
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Experience</h4>
                    <button onClick={addExperience} className="text-sm px-2 py-1 border rounded">Add</button>
                </div>

                <div className="space-y-3 mt-3">
                    {(resume.experience || []).map((ex, i) => (
                        <div key={ex.id} className="p-3 border rounded">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                    value={ex.company}
                                    onChange={(e) => updateExperience(i, { company: e.target.value })}
                                    placeholder="Company"
                                    className="p-2 border rounded"
                                />
                                <input
                                    value={ex.role}
                                    onChange={(e) => updateExperience(i, { role: e.target.value })}
                                    placeholder="Role"
                                    className="p-2 border rounded"
                                />
                                <input
                                    value={ex.start}
                                    onChange={(e) => updateExperience(i, { start: e.target.value })}
                                    placeholder="Start - End"
                                    className="p-2 border rounded"
                                />
                            </div>

                            <div className="mt-2">
                                <label className="text-sm text-slate-600">Bullets</label>
                                {(ex.bullets || []).map((b: string, bi: number) => (
                                    <div key={bi} className="flex gap-2 items-center mt-2">
                                        <input
                                            value={b}
                                            onChange={(e) => {
                                                const bullets = [...(ex.bullets || [])];
                                                bullets[bi] = e.target.value;
                                                updateExperience(i, { bullets });
                                            }}
                                            className="flex-1 p-2 border rounded"
                                        />
                                        <button
                                            onClick={() => {
                                                const bullets = [...(ex.bullets || [])];
                                                bullets.splice(bi, 1);
                                                updateExperience(i, { bullets });
                                            }}
                                            className="px-2 py-1 border rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => updateExperience(i, { bullets: [...(ex.bullets || []), ''] })}
                                    className="mt-2 text-sm px-2 py-1 border rounded"
                                >
                                    Add bullet
                                </button>
                            </div>

                            <div className="mt-3 text-right">
                                <button onClick={() => removeExperience(i)} className="text-sm text-red-600">Remove experience</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Education</h4>
                    <button onClick={addEducation} className="text-sm px-2 py-1 border rounded">Add</button>
                </div>

                <div className="space-y-2 mt-3">
                    {(resume.education || []).map((ed, i) => (
                        <div key={ed.id} className="p-3 border rounded grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                                value={ed.school}
                                onChange={(e) => {
                                    const list = [...(resume.education || [])];
                                    list[i] = { ...list[i], school: e.target.value };
                                    onChange({ ...resume, education: list });
                                }}
                                placeholder="School"
                                className="p-2 border rounded"
                            />
                            <input
                                value={ed.degree}
                                onChange={(e) => {
                                    const list = [...(resume.education || [])];
                                    list[i] = { ...list[i], degree: e.target.value };
                                    onChange({ ...resume, education: list });
                                }}
                                placeholder="Degree"
                                className="p-2 border rounded"
                            />
                            <input
                                value={ed.start}
                                onChange={(e) => {
                                    const list = [...(resume.education || [])];
                                    list[i] = { ...list[i], start: e.target.value };
                                    onChange({ ...resume, education: list });
                                }}
                                placeholder="Start - End"
                                className="p-2 border rounded"
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h4 className="font-medium">Skills</h4>
                <div className="mt-2 flex gap-2 items-center">
                    <input id="skillInput" placeholder="Add skill and press Enter"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.currentTarget as HTMLInputElement;
                                const v = input.value.trim();
                                if (v) {
                                    addSkill(v);
                                    input.value = '';
                                }
                            }
                        }}
                        className="flex-1 p-2 border rounded"
                    />
                    <button onClick={() => {
                        const el = document.getElementById('skillInput') as HTMLInputElement | null;
                        const v = el?.value.trim();
                        if (v) {
                            addSkill(v);
                            el!.value = '';
                        }
                    }} className="px-3 py-2 border rounded">Add</button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {(resume.skills || []).map((s, i) => (
                        <div key={i} className="px-3 py-1 bg-slate-100 rounded flex items-center gap-2">
                            <span className="text-sm">{s}</span>
                            <button onClick={() => {
                                const list = [...(resume.skills || [])];
                                list.splice(i, 1);
                                onChange({ ...resume, skills: list });
                            }} className="text-xs text-red-600">x</button>
                        </div>
                    ))}
                </div>
            </section>

            <div className="pt-4 border-t flex justify-end gap-3">
                <button onClick={onSave} className="px-4 py-2 bg-sky-600 text-white rounded">Save</button>
            </div>
        </div>
    );
}
