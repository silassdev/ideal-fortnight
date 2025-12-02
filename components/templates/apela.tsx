import React from 'react';
import { TemplateComponentProps } from '@/types/template';
import EditableText from '../dashboard/EditableText';
import { useEditing } from '../dashboard/TemplateEditor';
import SkillsEditor from '../dashboard/SkillsEditor';
import ExperienceEditor from '../dashboard/ExperienceEditor';
import EducationEditor from '../dashboard/EducationEditor';
import ProjectEditor from '../dashboard/ProjectEditor';

export const metadata = {
    key: 'apela',
    title: 'Apela',
    description: 'Two-column profile with bold header and modern accent',
    author: 'Apela Dev',
    authorUrl: 'https://github.com/apela-x',
    thumbnail: '/templates/apela.png',
    tags: ['two-column', 'modern', 'accent'],
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

export default function ApelaTemplate({ resume, className = '' }: TemplateComponentProps) {
    // Check if we're in editing mode
    let editingContext = null;
    try {
        editingContext = useEditing();
    } catch {
        // Not in editing mode, render normally
    }

    const isEditMode = editingContext?.isEditMode;
    const { editing, setEditing } = editingContext || {};

    return (
        <div className={`max-w-[800px] bg-white p-6 text-slate-900 ${className}`} id="resume-preview">
            <header className="flex items-center gap-4 pb-4 border-b">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {resume.name ? resume.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'UN'}
                </div>
                <div>
                    {isEditMode && editing && setEditing ? (
                        <EditableText
                            as="h1"
                            className="text-2xl font-extrabold"
                            value={editing.name || ''}
                            onChange={(val) => setEditing({ ...editing, name: val })}
                            placeholder="Full name"
                        />
                    ) : (
                        <h1 className="text-2xl font-extrabold">{resume.name || 'Full name'}</h1>
                    )}

                    {isEditMode && editing && setEditing ? (
                        <EditableText
                            as="div"
                            className="text-sm text-slate-600"
                            value={editing.title || ''}
                            onChange={(val) => setEditing({ ...editing, title: val })}
                            placeholder="Professional title"
                        />
                    ) : (
                        <div className="text-sm text-slate-600">{resume.title || 'Professional title'}</div>
                    )}
                </div>
                <div className="ml-auto text-sm text-slate-500 text-right">
                    {isEditMode && editing && setEditing ? (
                        <>
                            <EditableText
                                as="div"
                                value={editing.contact?.email || ''}
                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, email: val } })}
                                placeholder="email@example.com"
                            />
                            <EditableText
                                as="div"
                                value={editing.contact?.phone || ''}
                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, phone: val } })}
                                placeholder="+1 (555) 000-0000"
                            />
                            <EditableText
                                as="div"
                                value={editing.contact?.location || ''}
                                onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, location: val } })}
                                placeholder="City, Country"
                            />
                        </>
                    ) : (
                        <>
                            <div>{resume.contact?.email}</div>
                            <div>{resume.contact?.phone}</div>
                            <div>{resume.contact?.location}</div>
                        </>
                    )}
                </div>
            </header>

            <section className="grid grid-cols-3 gap-6 mt-6">
                <div className="col-span-2 space-y-6">
                    {/* Summary */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Summary</h3>
                        {isEditMode && editing && setEditing ? (
                            <EditableText
                                as="div"
                                className="text-sm text-slate-700"
                                value={editing.summary || ''}
                                onChange={(val) => setEditing({ ...editing, summary: val })}
                                placeholder="Professional summary..."
                                multiline
                            />
                        ) : (
                            <div className="text-sm text-slate-700">{resume.summary}</div>
                        )}
                    </div>

                    {/* Experience */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Experience</h3>
                        {isEditMode && editing && setEditing ? (
                            <ExperienceEditor
                                experiences={editing.experience || []}
                                onChange={(v) => setEditing({ ...editing, experience: v })}
                            />
                        ) : (
                            <div className="space-y-4">
                                {(resume.experience || []).map((ex) => (
                                    <div key={ex.id}>
                                        <div className="flex justify-between items-baseline">
                                            <div className="font-bold text-slate-800">{ex.role}</div>
                                            <div className="text-xs text-slate-500 font-medium">{fmtRange(ex)}</div>
                                        </div>
                                        <div className="text-sm text-slate-600 font-medium mb-1">{ex.company} {ex.location ? `• ${ex.location}` : ''}</div>
                                        <ul className="list-disc ml-4 text-sm text-slate-700 space-y-0.5">
                                            {(ex.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Projects */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Projects</h3>
                        {isEditMode && editing && setEditing ? (
                            <ProjectEditor
                                projects={editing.projects || []}
                                onChange={(v) => setEditing({ ...editing, projects: v })}
                            />
                        ) : (
                            <div className="space-y-4">
                                {(resume.projects || []).map((proj) => (
                                    <div key={proj.id}>
                                        <div className="flex justify-between items-baseline">
                                            <div className="font-bold text-slate-800">
                                                {proj.title}
                                                {proj.link && (
                                                    <a href={proj.link} target="_blank" rel="noreferrer" className="ml-2 text-sky-600 hover:underline text-xs font-normal">
                                                        Link ↗
                                                    </a>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium">{fmtRange(proj)}</div>
                                        </div>
                                        <div className="text-sm text-slate-700 mb-1">{proj.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="col-span-1 space-y-6">
                    {/* Education */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Education</h4>
                        {isEditMode && editing && setEditing ? (
                            <EducationEditor
                                education={editing.education || []}
                                onChange={(v) => setEditing({ ...editing, education: v })}
                            />
                        ) : (
                            <div className="space-y-4">
                                {(resume.education || []).map((ed) => (
                                    <div key={ed.id} className="text-sm">
                                        <div className="font-bold text-slate-800">{ed.school}</div>
                                        <div className="text-slate-600">{ed.degree}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{fmtRange(ed)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Skills */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Skills</h4>
                        {isEditMode && editing && setEditing ? (
                            <SkillsEditor
                                skills={editing.skills || []}
                                onChange={(v) => setEditing({ ...editing, skills: v })}
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {(resume.skills || []).map((s, i) => (
                                    <div key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded font-medium">{s}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
            </section>

            <footer className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
                <div>Generated with Apela template</div>
                <div>
                    {metadata.author && metadata.authorUrl ? (
                        <a href={metadata.authorUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">
                            {metadata.author}
                        </a>
                    ) : metadata.author}
                </div>
            </footer>
        </div>
    );
}
