import React from 'react';
import { motion } from 'framer-motion';
import { TemplateComponentProps } from '@/types/template';

export const metadata = {
    key: 'polaris',
    title: 'Polaris',
    description: 'A modern, high-contrast two-column resume template with spotlight profile and compact, scannable content areas.',
    author: 'silas',
    authorUrl: 'https://example.com',
    thumbnail: '',
    tags: ['two-column', 'modern', 'spotlight', 'compact'],
};

export default function PolarisTemplate({ resume, className = '' }: TemplateComponentProps) {
    const contact = resume.contact || {};
    const skills = resume.skills || [];
    const sections = resume.sections || [];

    const fmtRange = (start?: string, end?: string) => {
        if (!start && !end) return '';
        if (start && !end) return `${start} — Present`;
        return `${start ?? ''} — ${end ?? ''}`;
    };

    return (
        <div className={`max-w-[980px] mx-auto bg-white text-slate-900 ${className}`}>
            <div className="grid grid-cols-12 gap-6 p-8 lg:p-12">
                {/* Left column (profile spotlight) */}
                <aside className="col-span-12 lg:col-span-4">
                    <div className="sticky top-6 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl p-6 bg-gradient-to-b from-sky-50 to-white shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-xl font-semibold text-slate-700">
                                    {resume.name ? resume.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'SN'}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-extrabold leading-tight">{resume.name || 'Full Name'}</h1>
                                    <div className="text-sm text-slate-600 mt-0.5">{resume.title || 'Product Engineer'}</div>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-slate-600">
                                <p className="leading-relaxed">{resume.summary || 'Concise summary that highlights strengths in system design, product thinking, and shipping high-quality web experiences.'}</p>
                            </div>

                            <div className="mt-4 border-t pt-3 text-sm text-slate-600 space-y-2">
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
                            </div>
                        </motion.div>

                        {/* Skills card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.08 }}
                            className="rounded-2xl p-4 bg-white border shadow-sm"
                        >
                            <h3 className="text-sm font-semibold text-slate-700">Skills</h3>
                            <div className="mt-3 flex flex-wrap gap-2">
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
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Experience</h2>
                            <div className="text-sm text-slate-500">{(resume.experience?.length || 0)} items</div>
                        </div>

                        <div className="mt-4 space-y-5">
                            {(resume.experience || []).length > 0 ? (resume.experience || []).map((ex: any) => (
                                <article key={ex.id || ex.company || Math.random()} className="pt-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-800">{ex.role || 'Role'} <span className="text-slate-500">— {ex.company || 'Company'}</span></h3>
                                            <div className="text-xs text-slate-500 mt-1">{ex.location || ''}</div>
                                            {ex.summary && <div className="text-sm text-slate-700 mt-2">{ex.summary}</div>}
                                        </div>
                                        <div className="text-xs text-slate-500">{fmtRange(ex.start, ex.end)}</div>
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
                    </section>

                    {/* Projects + Education grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <section className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h2 className="text-lg font-semibold">Projects</h2>
                            <div className="mt-3 space-y-3">
                                {(sections.filter(s => s.type === 'projects') || []).length > 0 ? sections.filter(s => s.type === 'projects').flatMap((s: any) => s.items || []).map((p: any, i: number) => (
                                    <div key={i} className="text-sm">
                                        <div className="font-medium">{p.title || p.name || 'Project'}</div>
                                        {p.link && <div className="text-xs text-sky-600 underline"><a href={p.link} target="_blank" rel="noreferrer">{p.link}</a></div>}
                                        <div className="mt-1 text-slate-700">{p.description}</div>
                                    </div>
                                )) : <div className="text-sm text-slate-600">No projects listed.</div>}
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h2 className="text-lg font-semibold">Education</h2>
                            <div className="mt-3 space-y-3 text-sm text-slate-700">
                                {(resume.education || []).length > 0 ? (resume.education || []).map((ed: any) => (
                                    <div key={ed.id || ed.school}>
                                        <div className="font-medium">{ed.school || 'School'}</div>
                                        <div className="text-xs text-slate-500">{ed.degree ? `${ed.degree} • ${fmtRange(ed.start, ed.end)}` : `${fmtRange(ed.start, ed.end)}`}</div>
                                    </div>
                                )) : <div className="text-sm text-slate-600">No education entries yet.</div>}
                            </div>
                        </section>
                    </div>

                    {/* Certifications & Extra sections */}
                    <section className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h2 className="text-lg font-semibold">Certifications & Extras</h2>
                        <div className="mt-3 text-sm text-slate-700 space-y-2">
                            {(sections.filter(s => s.type === 'certifications') || []).length > 0 ? sections.filter(s => s.type === 'certifications').flatMap((s: any) => s.items || []).map((c: any, i: number) => (
                                <div key={i} className="font-medium">{c}</div>
                            )) : <div className="text-sm text-slate-600">No certifications listed.</div>}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="mt-2 text-xs text-slate-400 text-center">
                        Generated with Polaris template • {metadata.author ? (
                            <a href={metadata.authorUrl} target="_blank" rel="noreferrer" className="underline">{metadata.author}</a>
                        ) : metadata.author}
                    </footer>
                </main>
            </div>
        </div>
    );
}
