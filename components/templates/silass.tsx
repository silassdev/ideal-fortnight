import React from 'react';
import { TemplateComponentProps } from '@/types/template';
import EditableField from '../dashboard/EditableField';
import { useEditing } from '../dashboard/TemplateEditor';
import SkillsEditor from '../dashboard/SkillsEditor';
import ExperienceEditor from '../dashboard/ExperienceEditor';
import EducationEditor from '../dashboard/EducationEditor';
import ProjectEditor from '../dashboard/ProjectEditor';
import EditableText from '../dashboard/EditableText';
import CertificationsEditor from '../dashboard/CertificationsEditor';

export const metadata = {
  key: 'silass',
  title: 'SilasS',
  description: 'Clean two-column professional resume with strong left-profile and dense right content areas.',
  author: 'Silas Tyokaha',
  authorUrl: 'https://github.com/silassdev',
  thumbnail: '',
  tags: ['two-column', 'modern', 'professional', 'compact'],
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

export default function SilassDevTemplate({ resume, className = '' }: TemplateComponentProps) {
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
    <div id="resume-preview" className={`max-w-[900px] mx-auto bg-white text-slate-900 ${className}`}>
      <div className="grid grid-cols-12 gap-6 p-8">
        {/* Left column (profile) */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="flex flex-col items-start gap-4">
            <div className="w-full bg-slate-50 p-6 rounded">
              <EditableField field="name" as="h1" className="text-3xl font-extrabold tracking-tight" fallback="Full Name" />
              <EditableField field="title" as="div" className="text-sm text-slate-600 mt-1" fallback="Professional Title" />

              <div className="mt-4 border-t pt-3 text-sm text-slate-600">
                {isEditMode && editing && setEditing ? (
                  <>
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-20 text-slate-500">Location</span>
                      <EditableText
                        as="span"
                        value={editing.contact?.location || ''}
                        onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, location: val } })}
                        placeholder="Location"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-20 text-slate-500">Website</span>
                      <EditableText
                        as="span"
                        value={editing.contact?.website || ''}
                        onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, website: val } })}
                        placeholder="Website"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-20 text-slate-500">Email</span>
                      <EditableText
                        as="span"
                        value={editing.contact?.email || ''}
                        onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, email: val } })}
                        placeholder="Email"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-20 text-slate-500">Phone</span>
                      <EditableText
                        as="span"
                        value={editing.contact?.phone || ''}
                        onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, phone: val } })}
                        placeholder="Phone"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-20 text-slate-500">LinkedIn</span>
                      <EditableText
                        as="span"
                        value={editing.contact?.linkedin || ''}
                        onChange={(val) => setEditing({ ...editing, contact: { ...editing.contact, linkedin: val } })}
                        placeholder="LinkedIn"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-1">
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
                  </>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="w-full bg-white p-4 rounded border">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Skills</h3>
              {isEditMode && editing && setEditing ? (
                <SkillsEditor
                  skills={editing.skills || []}
                  onChange={(v) => setEditing({ ...editing, skills: v })}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
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
              )}
            </div>

            {/* Certifications */}
            <div className="w-full bg-white p-4 rounded border">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Certifications</h3>
              {isEditMode && editing && setEditing ? (
                <CertificationsEditor
                  certifications={editing.certifications || []}
                  onChange={(v) => setEditing({ ...editing, certifications: v })}
                />
              ) : (
                <ul className="text-sm list-disc list-inside text-slate-600">
                  {(resume.certifications && resume.certifications.length > 0)
                    ? resume.certifications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))
                    : <li>No certifications listed</li>
                  }
                </ul>
              )}
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
              <div className="space-y-4">
                {(resume.experience || []).length > 0 ? (resume.experience || []).map((ex) => (
                  <article key={ex.id} className="pt-2 border-t first:pt-0 first:border-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{ex.role || 'Role'} <span className="text-slate-500">— {ex.company || 'Company'}</span></h3>
                        <div className="text-xs text-slate-500">{ex.location || ''}</div>
                      </div>
                      <div className="text-xs text-slate-500">{fmtRange(ex)}</div>
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
            )}
          </section>

          {/* Projects */}
          <section className="bg-white p-6 rounded border">
            <h2 className="text-lg font-semibold mb-3">Projects</h2>
            {isEditMode && editing && setEditing ? (
              <ProjectEditor
                projects={editing.projects || []}
                onChange={(v) => setEditing({ ...editing, projects: v })}
              />
            ) : (
              <div className="space-y-3">
                {(resume.projects || []).length > 0
                  ? (resume.projects || []).map((p: any, i: number) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium">{p.title || p.name || 'Project'}</div>
                      <div className="text-xs text-slate-500">{p.link ? <a href={p.link} className="underline text-sky-600">{p.link}</a> : null}</div>
                      <div className="mt-1">{p.description}</div>
                    </div>
                  ))
                  : <div className="text-sm text-slate-600">No projects listed.</div>
                }
              </div>
            )}
          </section>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="bg-white p-6 rounded border">
              <h2 className="text-lg font-semibold mb-3">Education</h2>
              {isEditMode && editing && setEditing ? (
                <EducationEditor
                  education={editing.education || []}
                  onChange={(v) => setEditing({ ...editing, education: v })}
                />
              ) : (
                <div className="space-y-3 text-sm text-slate-700">
                  {(resume.education || []).length > 0
                    ? (resume.education || []).map((ed) => (
                      <div key={ed.id}>
                        <div className="font-medium">{ed.school || 'School'}</div>
                        <div className="text-xs text-slate-500">{ed.degree ? `${ed.degree} • ${fmtRange(ed)}` : `${fmtRange(ed)}`}</div>
                      </div>
                    ))
                    : <div className="text-sm text-slate-600">No education entries yet.</div>
                  }
                </div>
              )}
            </section>

            <section className="bg-white p-6 rounded border">
              <h2 className="text-lg font-semibold mb-3">Certifications</h2>
              {isEditMode && editing && setEditing ? (
                <CertificationsEditor
                  certifications={editing.certifications || []}
                  onChange={(v) => setEditing({ ...editing, certifications: v })}
                />
              ) : (
                <div className="space-y-2 text-sm text-slate-700">
                  {(resume.certifications && resume.certifications.length > 0)
                    ? resume.certifications.map((c, i) => (
                      <div key={i} className="font-medium">{c}</div>
                    ))
                    : <div className="text-sm text-slate-600">No certifications listed.</div>
                  }
                </div>
              )}
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
