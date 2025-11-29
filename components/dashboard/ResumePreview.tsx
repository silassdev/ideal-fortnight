'use client';

import React from 'react';
import { ResumeShape } from '@/types/resume';
import TemplateRenderer from '@/components/templates/TemplateRenderer';

export default function ResumePreview({ resume }: { resume: ResumeShape }) {
    return (
        <div id="resume-preview" className="max-w-[640px] bg-white border rounded p-4">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200" />
                <div>
                    <div id="resume-preview" className="p-4">
                        <TemplateRenderer templateKey={resume.template || 'apela'} resume={resume} />
                    </div>
                </div>
            </div>

            <div className="mt-3 text-sm text-slate-700">
                {resume.summary || 'Brief summary about the candidate. Highlight achievements and role.'}
            </div>

            <div className="mt-4">
                <h4 className="text-sm font-medium">Experience</h4>
                <div className="mt-2 space-y-3">
                    {(resume.experience || []).map((ex) => (
                        <div key={ex.id}>
                            <div className="flex justify-between">
                                <div className="font-medium">{ex.role || 'Role'} — {ex.company || 'Company'}</div>
                                <div className="text-xs text-slate-500">{ex.start} • {ex.end}</div>
                            </div>
                            <ul className="list-disc ml-5 text-sm text-slate-700 mt-1">
                                {(ex.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-sm font-medium">Education</h4>
                <div className="mt-2 space-y-2">
                    {(resume.education || []).map((ed) => (
                        <div key={ed.id} className="text-sm">
                            <div className="font-medium">{ed.school} — {ed.degree}</div>
                            <div className="text-xs text-slate-500">{ed.start} • {ed.end}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-sm font-medium">Skills</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                    {(resume.skills || []).map((s, i) => (
                        <div key={i} className="text-xs px-2 py-1 bg-slate-100 rounded">{s}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
