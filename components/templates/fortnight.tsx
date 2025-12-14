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
    key: 'fortnight',
    title: 'Fortnight',
    description: 'A polished, colorful sidebar resume with a striking header and compact, readable sections.',
    author: 'Silas Tyokaha',
    authorUrl: 'https://github.com/silassdev',
    thumbnail: '',
    tags: ['sidebar', 'colorful', 'modern', 'compact'],
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

export default function FortnightTemplate({ resume, className = '' }: TemplateComponentProps) {
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
        <div id="resume-preview" className={`max-w-[900px] mx-auto bg-white text-slate-900 shadow-sm ${className}`}>
            <div className="grid grid-cols-12 gap-6 p-6">
                {/* Left colorful sidebar */}
                <aside className="col-span-12 lg:col-span-4">
                    <div className="h-full rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-b from-indigo-600 via-violet-500 to-pink-500 text-white p-6">
                            <div className="flex items-center gap-4">

                                <div>
                                    <EditableField field="name" as="h1" className="text-2xl font-extrabold leading-tight" fallback="Full Name" />
                                    <EditableField field="title" as="div" className="text-sm opacity-90" fallback="Professional Title" />
                                </div>
                            </div>

                            <EditableField
                                field="summary"
                                as="p"
                                className="mt-4 text-sm opacity-90"
                                fallback="Brief professional tagline that highlights your speciality and strengths."
                                multiline
                            />
                        </div>

                        <div className="bg-white p-5 border-t">
                            <div className="space-y-3 text-sm text-slate-700">
                                {isEditMode && editing && setEditing ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <span className="text-indigo-600 font-semibold w-20">Email</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.email || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, email: val } })}
                                                placeholder="Email"
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-indigo-600 font-semibold w-20">Phone</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.phone || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, phone: val } })}
                                                placeholder="Phone"
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-indigo-600 font-semibold w-20">Location</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.location || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, location: val } })}
                                                placeholder="Location"
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-indigo-600 font-semibold w-20">Site</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.website || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, website: val } })}
                                                placeholder="Website"
                                                className="flex-1"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {contact.email && (
                                            <div className="flex items-center gap-3">
                                                <span className="text-indigo-600 font-semibold w-20">Email</span>
                                                <a href={`mailto:${contact.email}`} className="text-slate-700 underline">{contact.email}</a>
                                            </div>
                                        )}
                                        {contact.phone && (
                                            <div className="flex items-center gap-3">
                                                <span className="text-indigo-600 font-semibold w-20">Phone</span>
                                                <span className="text-slate-700">{contact.phone}</span>
                                            </div>
                                        )}
                                        {contact.location && (
                                            <div className="flex items-center gap-3">
                                                <span className="text-indigo-600 font-semibold w-20">Location</span>
                                                <span className="text-slate-700">{contact.location}</span>
                                            </div>
                                        )}
                                        {contact.website && (
                                            <div className="flex items-center gap-3">
                                                <span className="text-indigo-600 font-semibold w-20">Site</span>
                                                <a href={contact.website} target="_blank" rel="noreferrer" className="text-slate-700 underline">{contact.website}</a>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="pt-2 border-t">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Skills</h3>
                                    {isEditMode && editing && setEditing ? (
                                        <SkillsEditor
                                            skills={editing.skills || []}
                                            onChange={(v) => setEditing({ ...editing, skills: v })}
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {(resume.skills && resume.skills.length > 0)
                                                ? resume.skills.map((s, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">{s}</span>
                                                ))
                                                : <div className="text-xs text-slate-500 italic">No skills loaded</div>
                                            }
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3">
                                    <h3 className="text-sm font-semibold text-slate-900">Contact Links</h3>
                                    <div className="mt-2 space-y-1 text-xs">
                                        {isEditMode && editing && setEditing ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-16">LinkedIn:</span>
                                                    <EditableText
                                                        as="span"
                                                        value={editing.contact?.linkedin || ''}
                                                        onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, linkedin: val } })}
                                                        placeholder="URL"
                                                        className="flex-1"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-16">GitHub:</span>
                                                    <EditableText
                                                        as="span"
                                                        value={editing.contact?.github || ''}
                                                        onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, github: val } })}
                                                        placeholder="URL"
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="underline text-indigo-600 block">LinkedIn</a>}
                                                {contact.github && <a href={contact.github} target="_blank" rel="noreferrer" className="underline text-indigo-600 block">GitHub</a>}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="text-xs text-slate-400 pt-3">Template: Fortnight — SilasS</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right content area */}
                <main className="col-span-12 lg:col-span-8 space-y-5">
                    {((resume.experience || []).length > 0 || (isEditMode && editing)) && (
                        <section className="p-5 rounded border">
                            <h2 className="text-base font-semibold text-slate-800 mb-3">Experience</h2>
                            {isEditMode && editing && setEditing ? (
                                <ExperienceEditor
                                    experiences={editing.experience || []}
                                    onChange={(v) => setEditing({ ...editing, experience: v })}
                                />
                            ) : (
                                <div className="space-y-4 text-sm text-slate-700">
                                    {(resume.experience || []).length > 0 ? (resume.experience || []).map((ex) => (
                                        <div key={ex.id} className="pt-2 border-t first:pt-0 first:border-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="font-medium text-slate-900">{ex.role || 'Role'} <span className="text-slate-500">· {ex.company || 'Company'}</span></div>
                                                    <div className="text-xs text-slate-500">{ex.location || ''}</div>
                                                </div>
                                                <div className="text-xs text-slate-500">{fmtRange(ex)}</div>
                                            </div>
                                            {ex.bullets && ex.bullets.length > 0 && (
                                                <ul className="list-disc list-inside mt-2 text-sm text-slate-700">
                                                    {ex.bullets.map((b: any, i: number) => <li key={i}>{b}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    )) : <div className="text-sm text-slate-500">No experience yet</div>}
                                </div>
                            )}
                        </section>
                    )}

                    {((resume.projects || []).length > 0 || (isEditMode && editing)) && (
                        <section className="p-5 rounded border">
                            <h2 className="text-base font-semibold text-slate-800 mb-3">Projects</h2>
                            {isEditMode && editing && setEditing ? (
                                <ProjectEditor
                                    projects={editing.projects || []}
                                    onChange={(v) => setEditing({ ...editing, projects: v })}
                                />
                            ) : (
                                <div className="space-y-3 text-sm">
                                    {(resume.projects || []).length > 0
                                        ? (resume.projects || []).map((p: any, i: number) => (
                                            <div key={i}>
                                                <div className="font-medium text-slate-900">{p.title || p.name || 'Project'}</div>
                                                {p.link && <div className="text-xs text-indigo-600"><a href={p.link} target="_blank" rel="noreferrer" className="underline">{p.link}</a></div>}
                                                <div className="mt-1 text-slate-700">{p.description}</div>
                                            </div>
                                        ))
                                        : <div className="text-sm text-slate-500">No projects listed</div>
                                    }
                                </div>
                            )}
                        </section>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {((resume.education || []).length > 0 || (isEditMode && editing)) && (
                            <section className="p-5 rounded border">
                                <h2 className="text-sm font-semibold text-slate-800 mb-2">Education</h2>
                                {isEditMode && editing && setEditing ? (
                                    <EducationEditor
                                        education={editing.education || []}
                                        onChange={(v) => setEditing({ ...editing, education: v })}
                                    />
                                ) : (
                                    <div className="text-sm text-slate-700 space-y-2">
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
                        )}

                        {((resume.sections || []).filter(s => s.type === 'certifications').flatMap(s => s.items || []).length > 0 || (isEditMode && editing)) && (
                            <section className="p-5 rounded border">
                                <h2 className="text-sm font-semibold text-slate-800 mb-2">Certifications</h2>
                                <div className="text-sm text-slate-700 space-y-1">
                                    {(resume.sections || []).filter(s => s.type === 'certifications').flatMap(s => s.items || []).length > 0
                                        ? (resume.sections || []).filter(s => s.type === 'certifications').flatMap(s => s.items || []).map((c: any, i: number) => <div key={i}>{c}</div>)
                                        : <div className="text-sm text-slate-500">No certifications</div>
                                    }
                                </div>
                            </section>
                        )}
                    </div>

                    <footer className="text-xs text-slate-400">
                        {/* Footer Removed */}
                    </footer>
                </main>
            </div>
        </div>
    );
}