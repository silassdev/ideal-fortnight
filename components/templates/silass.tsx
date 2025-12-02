import React from 'react';
import { TemplateComponentProps } from '@/types/template';
import EditableField from '../dashboard/EditableField';
import { useEditing } from '../dashboard/TemplateEditor';

export const metadata = {
  key: 'silass',
  title: 'SilasS',
  description: 'Clean two-column professional resume with strong left-profile and dense right content areas.',
  author: 'Silas Tyokaha',
  authorUrl: 'https://github.com/silassdev',
  thumbnail: '',
  tags: ['two-column', 'modern', 'professional', 'compact'],
};

export default function SilassDevTemplate({ resume, className = '' }: TemplateComponentProps) {
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
    <div id="resume-preview" className={`max-w-[900px] mx-auto bg-white text-slate-900 ${className}`}>
      <div className="grid grid-cols-12 gap-6 p-8">
        {/* Left column (profile) */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="flex flex-col items-start gap-4">
            <div className="w-full bg-slate-50 p-6 rounded">
              <EditableField field="name" as="h1" className="text-3xl font-extrabold tracking-tight" fallback="Full Name" />
              <EditableField field="title" as="div" className="text-sm text-slate-600 mt-1" fallback="Professional Title" />

              <div className="mt-4 border-t pt-3 text-sm text-slate-600">
                {contact.location && (
                  <div className="flex items-start gap-2 py-1">
                    <span className="w-20 text-slate-500">Location</span>
                    <span className="flex-1">{contact.location}</span>
                  </div>
                )}

                {contact.website && (
                  <div className="flex items-start gap-2 py-1">
                    <span className="w-20 text-slate-500">Website</span>
                    <a className="flex-1 text-sky-600 underline" href={contact.website} target="_blank" rel="noreferrer">
                      {contact.website}
                    </a>
                  </div>
                )}

                {contact.email && (
                  <div className="flex items-start gap-2 py-1">
                    <span className="w-20 text-slate-500">Email</span>
                    <a className="flex-1 text-slate-700" href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                )}

                {contact.phone && (
                  <div className="flex items-start gap-2 py-1">
                    <span className="w-20 text-slate-500">Phone</span>
                    <span className="flex-1">{contact.phone}</span>
                  </div>
                )}

                {contact.linkedin && (
                  <div className="flex items-start gap-2 py-1">
                    <span className="w-20 text-slate-500">LinkedIn</span>
                    <a className="flex-1 text-sky-600 underline" href={contact.linkedin} target="_blank" rel="noreferrer">
                      {contact.linkedin}
                    </a>
                  </div>
                )}

                {contact.github && (
                  <div className="flex items-start gap-2 py-1">
                    <span className="w-20 text-slate-500">GitHub</span>
                    <a className="flex-1 text-sky-600 underline" href={contact.github} target="_blank" rel="noreferrer">
                      {contact.github}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="w-full bg-white p-4 rounded border">
              <h3 className="text-sm font-semibold text-slate-700">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(resume.skills && resume.skills.length > 0)
                  ? resume.skills.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded">{s}</span>
                  ))
                  : (
                    <>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded">JavaScript</span>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded">TypeScript</span>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded">React</span>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded">Node.js</span>
                    </>
                  )}
              </div>
            </div>

            {/* Certifications */}
            <div className="w-full bg-white p-4 rounded border">
              <h3 className="text-sm font-semibold text-slate-700">Certifications</h3>
              <ul className="mt-2 text-sm list-disc list-inside text-slate-600">
                {(resume.sections || []).filter(s => s.type === 'certifications').length > 0
                  ? (resume.sections || []).filter(s => s.type === 'certifications').flatMap(s => s.items || []).map((c: any, i: number) => (
                    <li key={i}>{c}</li>
                  ))
                  : <li>No certifications listed</li>
                }
              </ul>
            </div>

            <div className="text-xs text-slate-400">Template: SilasSDev</div>
          </div>
        </aside>

        {/* Right column (content) */}
        <main className="col-span-12 lg:col-span-8 space-y-6">
          {/* Summary */}
          <section className="bg-white p-6 rounded border">
            <h2 className="text-lg font-semibold">Summary</h2>
            <EditableField
              field="summary"
              as="p"
              className="mt-3 text-sm text-slate-700 leading-relaxed"
              fallback="A concise, impactful professional summary goes here. Mention core strengths, years of experience, and what you bring to a team."
              multiline
            />
          </section>

          {/* Experience */}
          <section className="bg-white p-6 rounded border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Experience</h2>
              <div className="text-sm text-slate-500">{(resume.experience?.length || 0)} items</div>
            </div>

            <div className="mt-4 space-y-4">
              {(resume.experience || []).length > 0 ? (resume.experience || []).map((ex) => (
                <article key={ex.id} className="pt-2 border-t first:pt-0 first:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{ex.role || 'Role'} <span className="text-slate-500">— {ex.company || 'Company'}</span></h3>
                      <div className="text-xs text-slate-500">{ex.location || ''}</div>
                    </div>
                    <div className="text-xs text-slate-500">{fmtRange(ex.start, ex.end)}</div>
                  </div>

                  {ex.bullets && ex.bullets.length > 0 && (
                    <ul className="list-disc list-inside mt-2 text-sm text-slate-700">
                      {ex.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </article>
              )) : (
                <div className="text-sm text-slate-600">No experience entries yet.</div>
              )}
            </div>
          </section>

          {/* Projects */}
          <section className="bg-white p-6 rounded border">
            <h2 className="text-lg font-semibold">Projects</h2>
            <div className="mt-3 space-y-3">
              {(resume.sections || []).filter(s => s.type === 'projects').length > 0
                ? (resume.sections || []).filter(s => s.type === 'projects').flatMap(s => s.items || []).map((p: any, i: number) => (
                  <div key={i} className="text-sm">
                    <div className="font-medium">{p.title || p.name || 'Project'}</div>
                    <div className="text-xs text-slate-500">{p.link ? <a href={p.link} className="underline text-sky-600">{p.link}</a> : null}</div>
                    <div className="mt-1">{p.description}</div>
                  </div>
                ))
                : <div className="text-sm text-slate-600">No projects listed.</div>
              }
            </div>
          </section>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="bg-white p-6 rounded border">
              <h2 className="text-lg font-semibold">Education</h2>
              <div className="mt-3 space-y-3 text-sm text-slate-700">
                {(resume.education || []).length > 0
                  ? (resume.education || []).map((ed) => (
                    <div key={ed.id}>
                      <div className="font-medium">{ed.school || 'School'}</div>
                      <div className="text-xs text-slate-500">{ed.degree ? `${ed.degree} • ${fmtRange(ed.start, ed.end)}` : `${fmtRange(ed.start, ed.end)}`}</div>
                    </div>
                  ))
                  : <div className="text-sm text-slate-600">No education entries yet.</div>
                }
              </div>
            </section>

            <section className="bg-white p-6 rounded border">
              <h2 className="text-lg font-semibold">Certifications</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                {(resume.sections || []).filter(s => s.type === 'certifications').length > 0
                  ? (resume.sections || []).filter(s => s.type === 'certifications').flatMap(s => s.items || []).map((c: any, i: number) => (
                    <div key={i} className="font-medium">{c}</div>
                  ))
                  : <div className="text-sm text-slate-600">No certifications listed.</div>
                }
              </div>
            </section>
          </div>

          {/* Footer / meta */}
          <footer className="mt-2 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <div>Generated with SilasSDev template</div>
              <div>
                {metadata.authorUrl ? (
                  <a href={metadata.authorUrl} target="_blank" rel="noreferrer" className="underline">{metadata.author}</a>
                ) : metadata.author}
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
