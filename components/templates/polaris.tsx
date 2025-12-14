import React from 'react';
import { motion } from 'framer-motion';
import { TemplateComponentProps } from '@/types/template';
import EditableField from '../dashboard/EditableField';
import { useEditing } from '../dashboard/TemplateEditor';
import SkillsEditor from '../dashboard/SkillsEditor';
import ExperienceEditor from '../dashboard/ExperienceEditor';
import EducationEditor from '../dashboard/EducationEditor';
import ProjectEditor from '../dashboard/ProjectEditor';
import EditableText from '../dashboard/EditableText';

export const metadata = {
    key: 'polaris',
    title: 'Polaris',
    description: 'A modern, high-contrast two-column resume template with spotlight profile and compact, scannable content areas.',
    author: 'silas',
    authorUrl: 'https://github.com/silassdev',
    thumbnail: '',
    tags: ['two-column', 'modern', 'spotlight', 'compact'],
};

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

export default function PolarisTemplate({ resume, className = '' }: TemplateComponentProps) {
    let editingContext = null;
    try {
        editingContext = useEditing();
    } catch {
    }
    const isEditMode = editingContext?.isEditMode;
    const { editing, setEditing } = editingContext || {};

    const contact = resume.contact || {};
    const skills = resume.skills || [];

    return (
        <div id="resume-preview" className={`max-w-[980px] mx-auto bg-white text-slate-900 ${className}`}>
            <div className="grid grid-cols-12 gap-6 p-8 lg:p-12">
                <aside className="col-span-12 lg:col-span-4">
                    <div className="sticky top-6 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl p-6 bg-gradient-to-b from-sky-50 to-white shadow-md"
                        >
                            <div className="flex items-center gap-4">

                                <div>
                                    <EditableField field="name" as="h1" className="text-2xl font-extrabold leading-tight" fallback="Full Name" />
                                    <EditableField field="title" as="div" className="text-sm text-slate-600 mt-0.5" fallback="Product Engineer" />
                                </div>
                            </div>

                            <EditableField
                                field="summary"
                                as="p"
                                className="mt-4 text-sm text-slate-600 leading-relaxed"
                                fallback="Concise summary that highlights strengths in system design, product thinking, and shipping high-quality web experiences."
                                multiline
                            />

                            <div className="mt-4 border-t pt-3 text-sm text-slate-600 space-y-2">
                                {isEditMode && editing && setEditing ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="w-20 text-slate-500">Location</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.location || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, location: val } })}
                                                placeholder="Location"
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-20 text-slate-500">Website</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.website || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, website: val } })}
                                                placeholder="Website"
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-20 text-slate-500">Email</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.email || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, email: val } })}
                                                placeholder="Email"
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-20 text-slate-500">Phone</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.phone || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, phone: val } })}
                                                placeholder="Phone"
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-20 text-slate-500">LinkedIn</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.linkedin || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, linkedin: val } })}
                                                placeholder="LinkedIn"
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-20 text-slate-500">GitHub</span>
                                            <EditableText
                                                as="span"
                                                value={editing.contact?.github || ''}
                                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, github: val } })}
                                                placeholder="GitHub"
                                                className="flex-1"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {contact.location && (
                                            <div className="flex items-start gap-2">
                                                <span className="w-20 text-slate-500">Location</span>
                                                <span className="flex-1">{contact.location}</span>
                                            </div>
                                        )}
                                        {contact.website && (
                                            <div className="flex items-start gap-2">
                                                <span className="w-20 text-slate-500">Website</span>
                                                <a className="flex-1 text-sky-600 underline" href={contact.website} target="_blank" rel="noreferrer">{contact.website}</a>
                                            </div>
                                        )}
                                        {contact.email && (
                                            <div className="flex items-start gap-2">
                                                <span className="w-20 text-slate-500">Email</span>
                                                <a className="flex-1 text-slate-700" href={`mailto:${contact.email}`}>{contact.email}</a>
                                            </div>
                                        )}
                                        {contact.phone && (
                                            <div className="flex items-start gap-2">
                                                <span className="w-20 text-slate-500">Phone</span>
                                                <span className="flex-1">{contact.phone}</span>
                                            </div>
                                        )}
                                        {contact.linkedin && (
                                            <div className="flex items-start gap-2">
                                                <span className="w-20 text-slate-500">LinkedIn</span>
                                                <a className="flex-1 text-sky-600 underline" href={contact.linkedin} target="_blank" rel="noreferrer">{contact.linkedin}</a>
                                            </div>
                                        )}
                                        {contact.github && (
                                            <div className="flex items-start gap-2">
                                                <span className="w-20 text-slate-500">GitHub</span>
                                                <a className="flex-1 text-sky-600 underline" href={contact.github} target="_blank" rel="noreferrer">{contact.github}</a>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Skills card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.08 }}
                            className="rounded-2xl p-4 bg-white border shadow-sm"
                        >
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Skills</h3>
                            {isEditMode && editing && setEditing ? (
                                <SkillsEditor
                                    skills={editing.skills || []}
                                    onChange={(v) => setEditing({ ...editing, skills: v })}
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {skills.length > 0 ? skills.map((s, i) => (
                                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">{s}</span>
                                    )) : (
                                        <>
                                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100">JavaScript</span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100">TypeScript</span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100">React</span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100">Node.js</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Quick highlights / badges */}
                        <motion.div className="rounded-2xl p-4 bg-white border shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-700">Highlights</h3>
                            <div className="mt-3 text-sm text-slate-600 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-sky-500" />
                                    <span>Built and scaled production systems for 1M+ users</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-sky-500" />
                                    <span>Led cross-functional teams across product & infra</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="text-xs text-slate-400">Template: Polaris</div>
                    </div>
                </aside>

                {/* Right column (content) */}
                <main className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Experience */}
                    <section className="bg-white p-6 rounded-2xl border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Experience</h2>
                            {/* <div className="text-sm text-slate-500">{(resume.experience?.length || 0)} items</div> */}
                        </div>

                        {isEditMode && editing && setEditing ? (
                            <ExperienceEditor
                                experiences={editing.experience || []}
                                onChange={(v) => setEditing({ ...editing, experience: v })}
                            />
                        ) : (
                            <div className="space-y-5">
                                {(resume.experience || []).length > 0 ? (resume.experience || []).map((ex: any) => (
                                    <article key={ex.id || ex.company || Math.random()} className="pt-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-slate-800">{ex.role || 'Role'} <span className="text-slate-500">— {ex.company || 'Company'}</span></h3>
                                                <div className="text-xs text-slate-500 mt-1">{ex.location || ''}</div>
                                                {ex.summary && <div className="text-sm text-slate-700 mt-2">{ex.summary}</div>}
                                            </div>
                                            <div className="text-xs text-slate-500">{fmtRange(ex)}</div>
                                        </div>

                                        {ex.bullets && ex.bullets.length > 0 && (
                                            <ul className="list-disc list-inside mt-3 text-sm text-slate-700">
                                                {ex.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                                            </ul>
                                        )}
                                    </article>
                                )) : (
                                    <div className="text-sm text-slate-600">No experience entries yet.</div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Projects + Education grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <section className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h2 className="text-lg font-semibold mb-3">Projects</h2>
                            {isEditMode && editing && setEditing ? (
                                <ProjectEditor
                                    projects={editing.projects || []}
                                    onChange={(v) => setEditing({ ...editing, projects: v })}
                                />
                            ) : (
                                <div className="space-y-3">
                                    {(resume.projects || []).length > 0 ? (resume.projects || []).map((p: any, i: number) => (
                                        <div key={i} className="text-sm">
                                            <div className="font-medium">{p.title || p.name || 'Project'}</div>
                                            {p.link && <div className="text-xs text-sky-600 underline"><a href={p.link} target="_blank" rel="noreferrer">{p.link}</a></div>}
                                            <div className="mt-1 text-slate-700">{p.description}</div>
                                        </div>
                                    )) : <div className="text-sm text-slate-600">No projects listed.</div>}
                                </div>
                            )}
                        </section>

                        <section className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h2 className="text-lg font-semibold mb-3">Education</h2>
                            {isEditMode && editing && setEditing ? (
                                <EducationEditor
                                    education={editing.education || []}
                                    onChange={(v) => setEditing({ ...editing, education: v })}
                                />
                            ) : (
                                <div className="space-y-3 text-sm text-slate-700">
                                    {(resume.education || []).length > 0 ? (resume.education || []).map((ed: any) => (
                                        <div key={ed.id || ed.school}>
                                            <div className="font-medium">{ed.school || 'School'}</div>
                                            <div className="text-xs text-slate-500">{ed.degree ? `${ed.degree} • ${fmtRange(ed)}` : `${fmtRange(ed)}`}</div>
                                        </div>
                                    )) : <div className="text-sm text-slate-600">No education entries yet.</div>}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Certifications & Extra sections */}
                    <section className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h2 className="text-lg font-semibold mb-3">Certifications & Extras</h2>
                        <div className="text-sm text-slate-700 space-y-2">
                            {(resume.sections || []).filter(s => s.type === 'certifications').flatMap((s: any) => s.items || []).length > 0 ? (resume.sections || []).filter(s => s.type === 'certifications').flatMap((s: any) => s.items || []).map((c: any, i: number) => (
                                <div key={i} className="font-medium">{c}</div>
                            )) : <div className="text-sm text-slate-600">No certifications listed.</div>}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="mt-2 text-xs text-slate-400 text-center">
                        {/* Footer Removed */}
                    </footer>
                </main>
            </div>
        </div>
    );
}
