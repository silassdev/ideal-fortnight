import React from 'react';
import { TemplateComponentProps } from '@/types/template';
import EditableField from '../dashboard/EditableField';
import { useEditing } from '../dashboard/TemplateEditor';

export const metadata = {
    key: 'zengrid',
    title: 'ZenGrid',
    description: 'A minimalist header-first resume with clear sections, subtle dividers and roomy typography for scanners.',
    author: 'Silas Tyokaha',
    authorUrl: 'https://github.com/silassdev',
    thumbnail: '',
    tags: ['minimal', 'clean', 'modern', 'spacious'],
};

export default function ZenGridTemplate({ resume, className = '' }: TemplateComponentProps) {
    // Check for editing context
    let editingContext = null;
    try {
        editingContext = useEditing();
    } catch {
        // Not in editing mode
    }
    const isEditMode = editingContext?.isEditMode;

    const fmtRange = (start?: string, end?: string) => {
        if (!start && !end) return '';
        if (start && !end) return `${start} — Present`;
        return `${start ?? ''} — ${end ?? ''}`;
    };

    const contact = resume.contact || {};

    return (
        <div id="resume-zengrid" className={`max-w-[920px] mx-auto bg-white text-slate-900 ${className}`}>
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b">
                <div>
                    <EditableField field="name" as="h1" className="text-3xl font-bold tracking-tight" fallback="Full Name" />
                    <EditableField field="title" as="div" className="text-sm text-slate-600 mt-1" fallback="Professional Title" />
                </div>
                <div className="text-sm text-slate-600 space-y-1 text-right">
                    {contact.website && <div><a href={contact.website} target="_blank" rel="noreferrer" className="underline text-sky-600">{contact.website}</a></div>}
                    {contact.email && <div><a href={`mailto:${contact.email}`} className="underline">{contact.email}</a></div>}
                    {contact.phone && <div>{contact.phone}</div>}
                    {contact.location && <div>{contact.location}</div>}
                </div>
            </header>

            <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: vertical list of sections */}
                <aside className="lg:col-span-1 space-y-6">
                    <section>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Core Skills</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {(resume.skills && resume.skills.length > 0)
                                ? resume.skills.map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded">{s}</span>)
                                : ['Design', 'Frontend', 'APIs', 'Testing'].map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded">{s}</span>)
                            }
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Languages</h3>
                        <ul className="mt-2 text-sm text-slate-700 list-inside list-disc">
                            {(resume.sections || []).filter(s => s.type === 'languages').flatMap(s => s.items || []).length > 0
                                ? (resume.sections || []).filter(s => s.type === 'languages').flatMap(s => s.items || []).map((l: any, i: number) => <li key={i}>{l}</li>)
                                : <li>English (Fluent)</li>
                            }
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Certifications</h3>
                        <div className="mt-2 text-sm text-slate-700">
                            {(resume.sections || []).filter(s => s.type === 'certifications').flatMap(s => s.items || []).length > 0
                                ? (resume.sections || []).filter(s => s.type === 'certifications').flatMap(s => s.items || []).map((c: any, i: number) => <div key={i}>{c}</div>)
                                : <div className="text-sm text-slate-500">None listed</div>
                            }
                        </div>
                    </section>
                </aside>

                {/* Right column: main stream */}
                <section className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">Professional Summary</h2>
                        <EditableField
                            field="summary"
                            as="p"
                            className="mt-2 text-sm text-slate-700"
                            fallback="Concise summary describing experience, focus areas, and the value you bring."
                            multiline
                        />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">Work Experience</h2>
                        <div className="mt-3 space-y-4">
                            {(resume.experience || []).length > 0 ? (resume.experience || []).map((ex) => (
                                <div key={ex.id} className="pt-2 border-t first:pt-0 first:border-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <div className="font-medium text-slate-900">{ex.role || 'Role'}</div>
                                            <div className="text-xs text-slate-500">{ex.company || ''} {ex.location ? `• ${ex.location}` : ''}</div>
                                        </div>
                                        <div className="text-xs text-slate-500">{fmtRange(ex.start, ex.end)}</div>
                                    </div>
                                    {ex.bullets && ex.bullets.length > 0 && (
                                        <ul className="list-disc list-inside mt-2 text-sm text-slate-700">
                                            {ex.bullets.map((b: any, i: number) => <li key={i}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            )) : <div className="text-sm text-slate-500">No experience provided</div>}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">Selected Projects</h2>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {(resume.sections || []).filter(s => s.type === 'projects').flatMap(s => s.items || []).length > 0
                                ? (resume.sections || []).filter(s => s.type === 'projects').flatMap(s => s.items || []).map((p: any, i: number) => (
                                    <div key={i} className="p-3 border rounded">
                                        <div className="font-medium text-slate-900">{p.title || p.name || 'Project'}</div>
                                        {p.link && <div className="text-xs text-sky-600"><a href={p.link} target="_blank" rel="noreferrer" className="underline">{p.link}</a></div>}
                                        <div className="mt-1 text-slate-700">{p.description}</div>
                                    </div>
                                ))
                                : <div className="text-sm text-slate-500">No projects listed</div>
                            }
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t">
                        <div>Generated with ZenGrid template</div>
                        <div>
                            {metadata.authorUrl ? (
                                <a href={metadata.authorUrl} target="_blank" rel="noreferrer" className="underline">{metadata.author}</a>
                            ) : metadata.author}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}