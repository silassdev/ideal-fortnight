import React from 'react';
import { TemplateComponentProps } from '@/types/template';

export const metadata = {
    key: 'fortnight',
    title: 'Fortnight',
    description: 'A polished, colorful sidebar resume with a striking header and compact, readable sections.',
    author: 'Silas Tyokaha',
    authorUrl: 'https://github.com/silassdev',
    thumbnail: '',
    tags: ['sidebar', 'colorful', 'modern', 'compact'],
};

export default function FortnightTemplate({ resume, className = '' }: TemplateComponentProps) {
    const fmtRange = (start?: string, end?: string) => {
        if (!start && !end) return '';
        if (start && !end) return `${start} — Present`;
        return `${start ?? ''} — ${end ?? ''}`;
    };

    const contact = resume.contact || {};

    return (
        <div id="resume-aurora" className={`max-w-[900px] mx-auto bg-white text-slate-900 shadow-sm ${className}`}>
            <div className="grid grid-cols-12 gap-6 p-6">
                {/* Left colorful sidebar */}
                <aside className="col-span-12 lg:col-span-4">
                    <div className="h-full rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-b from-indigo-600 via-violet-500 to-pink-500 text-white p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                                    {resume.name ? resume.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'FN'}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-extrabold leading-tight">{resume.name || 'Full Name'}</h1>
                                    <div className="text-sm opacity-90">{resume.title || 'Professional Title'}</div>
                                </div>
                            </div>

                            <p className="mt-4 text-sm opacity-90">{resume.summary ? resume.summary.split('.').slice(0, 2).join('. ') + (resume.summary.endsWith('.') ? '' : '.') : 'Brief professional tagline that highlights your speciality and strengths.'}</p>
                        </div>

                        <div className="bg-white p-5 border-t">
                            <div className="space-y-3 text-sm text-slate-700">
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

                                <div className="pt-2 border-t">
                                    <h3 className="text-sm font-semibold text-slate-900">Skills</h3>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {(resume.skills && resume.skills.length > 0)
                                            ? resume.skills.map((s, i) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">{s}</span>
                                            ))
                                            : ['JavaScript', 'React', 'Node.js', 'TypeScript'].map((s, i) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">{s}</span>
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="pt-3">
                                    <h3 className="text-sm font-semibold text-slate-900">Contact Links</h3>
                                    <div className="mt-2 space-y-1 text-xs">
                                        {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="underline text-indigo-600">LinkedIn</a>}
                                        {contact.github && <a href={contact.github} target="_blank" rel="noreferrer" className="underline text-indigo-600">GitHub</a>}
                                    </div>
                                </div>

                                <div className="text-xs text-slate-400 pt-3">Template: Fortnight — SilasS</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right content area */}
                <main className="col-span-12 lg:col-span-8 space-y-5">
                    <section className="p-5 rounded border">
                        <h2 className="text-base font-semibold text-slate-800">Experience</h2>
                        <div className="mt-3 space-y-4 text-sm text-slate-700">
                            {(resume.experience || []).length > 0 ? (resume.experience || []).map((ex) => (
                                <div key={ex.id} className="pt-2 border-t first:pt-0 first:border-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium text-slate-900">{ex.role || 'Role'} <span className="text-slate-500">· {ex.company || 'Company'}</span></div>
                                            <div className="text-xs text-slate-500">{ex.location || ''}</div>
                                        </div>
                                        <div className="text-xs text-slate-500">{fmtRange(ex.start, ex.end)}</div>
                                    </div>
                                    {ex.bullets && ex.bullets.length > 0 && (
                                        <ul className="list-disc list-inside mt-2 text-sm text-slate-700">
                                            {ex.bullets.map((b: any, i: number) => <li key={i}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            )) : <div className="text-sm text-slate-500">No experience yet</div>}
                        </div>
                    </section>

                    <section className="p-5 rounded border">
                        <h2 className="text-base font-semibold text-slate-800">Projects</h2>
                        <div className="mt-3 space-y-3 text-sm">
                            {(resume.sections || []).filter(s => s.type === 'projects').flatMap(s => s.items || []).length > 0
                                ? (resume.sections || []).filter(s => s.type === 'projects').flatMap(s => s.items || []).map((p: any, i: number) => (
                                    <div key={i}>
                                        <div className="font-medium text-slate-900">{p.title || p.name || 'Project'}</div>
                                        {p.link && <div className="text-xs text-indigo-600"><a href={p.link} target="_blank" rel="noreferrer" className="underline">{p.link}</a></div>}
                                        <div className="mt-1 text-slate-700">{p.description}</div>
                                    </div>
                                ))
                                : <div className="text-sm text-slate-500">No projects listed</div>
                            }
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <section className="p-5 rounded border">
                            <h2 className="text-sm font-semibold text-slate-800">Education</h2>
                            <div className="mt-2 text-sm text-slate-700 space-y-2">
                                {(resume.education || []).length > 0
                                    ? (resume.education || []).map((ed) => (
                                        <div key={ed.id}>
                                            <div className="font-medium">{ed.school || 'School'}</div>
                                            <div className="text-xs text-slate-500">{ed.degree ? `${ed.degree} • ${fmtRange(ed.start, ed.end)}` : `${fmtRange(ed.start, ed.end)}`}</div>
                                        </div>
                                    ))
                                    : <div className="text-sm text-slate-500">No education listed</div>
                                }
                            </div>
                        </section>

                        <section className="p-5 rounded border">
                            <h2 className="text-sm font-semibold text-slate-800">Certifications</h2>
                            <div className="mt-2 text-sm text-slate-700 space-y-1">
                                {(resume.sections || []).filter(s => s.type === 'certifications').flatMap(s => s.items || []).length > 0
                                    ? (resume.sections || []).filter(s => s.type === 'certifications').flatMap(s => s.items || []).map((c: any, i: number) => <div key={i}>{c}</div>)
                                    : <div className="text-sm text-slate-500">No certifications</div>
                                }
                            </div>
                        </section>
                    </div>

                    <footer className="text-xs text-slate-400">
                        <div className="flex items-center justify-between">
                            <div>Generated with Fortnight template</div>
                            <div>
                                {metadata.authorUrl ? (
                                    <a href={metadata.authorUrl} target="_blank" rel="noreferrer" className="underline text-indigo-600">{metadata.author}</a>
                                ) : metadata.author}
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}