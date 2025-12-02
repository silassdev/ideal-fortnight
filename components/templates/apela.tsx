import React from 'react';
import { TemplateComponentProps } from '@/types/template';
import EditableText from '../dashboard/EditableText';
import { useEditing } from '../dashboard/TemplateEditor';

export const metadata = {
    key: 'apela',
    title: 'Apela',
    description: 'Two-column profile with bold header and modern accent',
    author: 'Apela Dev',
    authorUrl: 'https://github.com/apela-x',
    thumbnail: '/templates/apela.png',
    tags: ['two-column', 'modern', 'accent'],
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
                <div className="w-20 h-20 rounded-full bg-slate-200" />
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
                <div className="ml-auto text-sm text-slate-500">
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
                        </>
                    ) : (
                        <>
                            <div>{resume.contact?.email}</div>
                            <div>{resume.contact?.phone}</div>
                        </>
                    )}
                </div>
            </header>

            <section className="grid grid-cols-3 gap-6 mt-6">
                <div className="col-span-2">
                    {isEditMode && editing && setEditing ? (
                        <EditableText
                            as="div"
                            className="mb-4 text-sm text-slate-700"
                            value={editing.summary || ''}
                            onChange={(val) => setEditing({ ...editing, summary: val })}
                            placeholder="Professional summary..."
                            multiline
                        />
                    ) : (
                        <div className="mb-4 text-sm text-slate-700">{resume.summary}</div>
                    )}

                    <div className="space-y-4">
                        {(resume.experience || []).map((ex) => (
                            <div key={ex.id}>
                                <div className="flex justify-between">
                                    <div className="font-medium">{ex.role} — {ex.company}</div>
                                    <div className="text-xs text-slate-500">{ex.start} — {ex.end}</div>
                                </div>
                                <ul className="list-disc ml-5 text-sm mt-1">
                                    {(ex.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="col-span-1 space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold">Education</h4>
                        {(resume.education || []).map((ed) => (
                            <div key={ed.id} className="text-sm">
                                <div className="font-medium">{ed.school}</div>
                                <div className="text-xs text-slate-500">{ed.degree} • {ed.start} - {ed.end}</div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold">Skills</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {(resume.skills || []).map((s, i) => (
                                <div key={i} className="text-xs px-2 py-1 bg-slate-100 rounded">{s}</div>
                            ))}
                        </div>
                    </div>
                </aside>
            </section>

            <footer className="mt-6 pt-4 border-t text-xs text-slate-400 flex justify-between items-center">
                <div>Generated with Apela template</div>
                <div>
                    {metadata.author && metadata.authorUrl ? (
                        <a href={metadata.authorUrl} target="_blank" rel="noopener noreferrer" className="underline">
                            {metadata.author}
                        </a>
                    ) : metadata.author}
                </div>
            </footer>
        </div>
    );
}
