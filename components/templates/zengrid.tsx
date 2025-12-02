import React from 'react';
import { TemplateComponentProps } from '@/types/template';
import EditableField from '../dashboard/EditableField';
import { useEditing } from '../dashboard/TemplateEditor';
import SkillsEditor from '../dashboard/SkillsEditor';
import ExperienceEditor from '../dashboard/ExperienceEditor';
import EducationEditor from '../dashboard/EducationEditor';
import ProjectEditor from '../dashboard/ProjectEditor';
import EditableText from '../dashboard/EditableText';

export const metadata = {
    key: 'zengrid',
    title: 'ZenGrid',
    description: 'A minimalist header-first resume with clear sections, subtle dividers and roomy typography for scanners.',
    author: 'Silas Tyokaha',
    authorUrl: 'https://github.com/silassdev',
    thumbnail: '',
    tags: ['minimal', 'clean', 'modern', 'spacious'],
};

// Helper to format date range
const fmtDate = (month?: string, year?: string) => {
    if (!month && !year) return '';
    if (month && year) return `${month} ${year}`;
    return month || year || '';
};

const fmtRange = (item: any) => {
    const start = fmtDate(item.startMonth, item.startYear) || item.start;
    const end = item.current ? 'Present' : (fmtDate(item.endMonth, item.endYear) || item.end);

    if (!start && !end) return '';
    if (start && !end) return `${start} — Present`;
    return `${start ?? ''} — ${end ?? ''}`;
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
    const { editing, setEditing } = editingContext || {};

    const contact = resume.contact || {};

    return (
        <div id="resume-preview" className={`max-w-[920px] mx-auto bg-white text-slate-900 ${className}`}>
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b">
                <div>
                    <EditableField field="name" as="h1" className="text-3xl font-bold tracking-tight" fallback="Full Name" />
                    <EditableField field="title" as="div" className="text-sm text-slate-600 mt-1" fallback="Professional Title" />
                </div>
                <div className="text-sm text-slate-600 space-y-1 text-right">
                    {isEditMode && editing && setEditing ? (
                        <>
                            <EditableText
                                as="div"
                                value={editing.contact?.website || ''}
                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, website: val } })}
                                placeholder="Website"
                                className="text-right"
                            />
                            <EditableText
                                as="div"
                                value={editing.contact?.email || ''}
                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, email: val } })}
                                placeholder="Email"
                                className="text-right"
                            />
                            <EditableText
                                as="div"
                                value={editing.contact?.phone || ''}
                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, phone: val } })}
                                placeholder="Phone"
                                className="text-right"
                            />
                            <EditableText
                                as="div"
                                value={editing.contact?.location || ''}
                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, location: val } })}
                                placeholder="Location"
                                className="text-right"
                            />
                        </>
                    ) : (
                        <>
                            {contact.website && <div><a href={contact.website} target="_blank" rel="noreferrer" className="underline text-sky-600">{contact.website}</a></div>}
                            {contact.email && <div><a href={`mailto:${contact.email}`} className="underline">{contact.email}</a></div>}
                            {contact.phone && <div>{contact.phone}</div>}
                            {contact.location && <div>{contact.location}</div>}
                        </>
                    )}
                </div>
            </header>

            <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: vertical list of sections */}
                <aside className="lg:col-span-1 space-y-6">
                    <section>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Core Skills</h3>
                        {isEditMode && editing && setEditing ? (
                            <SkillsEditor
                                skills={editing.skills || []}
                                onChange={(v) => setEditing({ ...editing, skills: v })}
                            />
                        ) : (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {(resume.skills && resume.skills.length > 0)
                                    ? resume.skills.map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded">{s}</span>)
                                    : ['Design', 'Frontend', 'APIs', 'Testing'].map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded">{s}</span>)
                                }
                            </div>
                        )}
                    </section>

                    <section>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Education</h3>
                        {isEditMode && editing && setEditing ? (
                            <EducationEditor
                                education={editing.education || []}
                                onChange={(v) => setEditing({ ...editing, education: v })}
                            />
                        ) : (
                            <div className="mt-2 text-sm text-slate-700 space-y-2">
                                {(resume.education || []).length > 0
                                    ? (resume.education || []).map((ed) => (
                                        <div key={ed.id}>
                                            <div className="font-medium">{ed.school || 'School'}</div>
                                            <div className="text-xs text-slate-500">{ed.degree ? `${ed.degree} • ${fmtRange(ed)}` : `${fmtRange(ed)}`}</div>
                                        </div>
                                    ))
                                    : <div className="text-sm text-slate-500">No education listed</div>
                                }
                            </div>
                        )}
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
                        {isEditMode && editing && setEditing ? (
                            <ExperienceEditor
                                experiences={editing.experience || []}
                                onChange={(v) => setEditing({ ...editing, experience: v })}
                            />
                        ) : (
                            <div className="mt-3 space-y-4">
                                {(resume.experience || []).length > 0 ? (resume.experience || []).map((ex) => (
                                    <div key={ex.id} className="pt-2 border-t first:pt-0 first:border-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <div className="font-medium text-slate-900">{ex.role || 'Role'}</div>
                                                <div className="text-xs text-slate-500">{ex.company || ''} {ex.location ? `• ${ex.location}` : ''}</div>
                                            </div>
                                            <div className="text-xs text-slate-500">{fmtRange(ex)}</div>
                                        </div>
                                        {ex.bullets && ex.bullets.length > 0 && (
                                            <ul className="list-disc list-inside mt-2 text-sm text-slate-700">
                                                {ex.bullets.map((b: any, i: number) => <li key={i}>{b}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                )) : <div className="text-sm text-slate-500">No experience provided</div>}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">Selected Projects</h2>
                        {isEditMode && editing && setEditing ? (
                            <ProjectEditor
                                projects={editing.projects || []}
                                onChange={(v) => setEditing({ ...editing, projects: v })}
                            />
                        ) : (
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                {(resume.projects || []).length > 0
                                    ? (resume.projects || []).map((p: any, i: number) => (
                                        <div key={i} className="p-3 border rounded">
                                            <div className="font-medium text-slate-900">{p.title || p.name || 'Project'}</div>
                                            {p.link && <div className="text-xs text-sky-600"><a href={p.link} target="_blank" rel="noreferrer" className="underline">{p.link}</a></div>}
                                            <div className="mt-1 text-slate-700">{p.description}</div>
                                        </div>
                                    ))
                                    : <div className="text-sm text-slate-500">No projects listed</div>
                                }
                            </div>
                        )}
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