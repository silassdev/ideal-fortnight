import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { InlineInput, SectionHeader, SortableItemWrapper } from '@/components/editor/SharedComponents';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export const metadata = {
  key: 'silass',
  title: 'SilasS',
  description: 'Clean two-column professional resume with strong left-profile and dense right content areas.',
  author: 'Silas Tyokaha',
  authorUrl: 'https://github.com/silassdev',
  thumbnail: '',
  tags: ['two-column', 'modern', 'professional', 'compact'],
};

const DEFAULT_TITLES = {
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  summary: 'Professional Summary',
  other: 'Other'
};

const ExperienceRow = ({ item, update, remove, isPreview }: any) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="group relative">
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1">
          <InlineInput value={item.role} onChange={(v) => update(item.id, 'role', v)} className="font-bold text-slate-900 text-[15px]" placeholder="Role" isPreview={isPreview} />
        </div>
        <div className="text-right ml-4">
          <div className="flex items-center gap-1 text-[12px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
            <InlineInput value={item.startMonth} onChange={(v) => update(item.id, 'startMonth', v)} placeholder="MM" className="w-8 text-center" isPreview={isPreview} />
            <InlineInput value={item.startYear} onChange={(v) => update(item.id, 'startYear', v)} placeholder="YYYY" className="w-12 text-center" isPreview={isPreview} />
            <span>—</span>
            {item.current ? (
              <button onClick={() => update(item.id, 'current', false)} className="text-indigo-600 hover:text-indigo-800">Present</button>
            ) : (
              <>
                <InlineInput value={item.endMonth} onChange={(v) => update(item.id, 'endMonth', v)} placeholder="MM" className="w-8 text-center" isPreview={isPreview} />
                <InlineInput value={item.endYear} onChange={(v) => update(item.id, 'endYear', v)} placeholder="YYYY" className="w-12 text-center" isPreview={isPreview} />
                {!isPreview && <button onClick={() => update(item.id, 'current', true)} className="text-[10px] text-slate-400 hover:text-indigo-600">Present?</button>}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-indigo-600 font-medium text-[13px] mb-2 flex items-center gap-2">
        <div className="w-1 h-3 bg-indigo-500/30 rounded-full" />
        <InlineInput value={item.company} onChange={(v) => update(item.id, 'company', v)} placeholder="Company" isPreview={isPreview} />
        <span className="text-slate-300">•</span>
        <InlineInput value={item.location} onChange={(v) => update(item.id, 'location', v)} placeholder="Location" className="text-slate-500 font-normal" isPreview={isPreview} />
      </div>
      <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-[13px] text-slate-600 leading-relaxed" placeholder="Description of your impact and results..." multiline isPreview={isPreview} />
    </div>
  </SortableItemWrapper>
);

const EducationRow = ({ item, update, remove, isPreview }: any) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1">
        <InlineInput value={item.school} onChange={(v) => update(item.id, 'school', v)} className="font-bold text-slate-900 text-[14px]" placeholder="School" isPreview={isPreview} />
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold whitespace-nowrap ml-4">
          <div className="flex items-center gap-1">
            <InlineInput value={item.startYear} onChange={(v) => update(item.id, 'startYear', v)} placeholder="YYYY" className="w-10" isPreview={isPreview} />
            <span>—</span>
            <InlineInput value={item.endYear} onChange={(v) => update(item.id, 'endYear', v)} placeholder="YYYY" className="w-10" isPreview={isPreview} />
          </div>
        </div>
      </div>
      <div className="text-indigo-600 text-[12px] font-medium mb-1">
        <InlineInput value={item.degree} onChange={(v) => update(item.id, 'degree', v)} placeholder="Degree" isPreview={isPreview} />
      </div>
      <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-[12px] text-slate-500 italic" placeholder="Description..." isPreview={isPreview} />
    </div>
  </SortableItemWrapper>
);

const ProjectRow = ({ item, update, remove, isPreview }: any) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <InlineInput value={item.title} onChange={(v) => update(item.id, 'title', v)} className="font-bold text-slate-900 text-[14px]" placeholder="Project Title" isPreview={isPreview} />
        <div className="h-1 w-1 bg-slate-300 rounded-full shrink-0" />
        <InlineInput value={item.link} onChange={(v) => update(item.id, 'link', v)} className="text-[11px] text-indigo-550 underline" placeholder="Link" isPreview={isPreview} />
      </div>
      <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-[13px] text-slate-600 leading-relaxed" placeholder="Briefly describe what you built..." multiline isPreview={isPreview} />
    </div>
  </SortableItemWrapper>
);

export default function SilassDevTemplate({ resume, editorState, className = '' }: any) {
  const data = editorState?.data || resume;
  const isPreview = editorState?.isPreview ?? true;

  const sectionTitles = { ...DEFAULT_TITLES, ...(data.sectionTitles || {}) };

  const handleDragEnd = (event: any, key: string) => editorState?.handleDragEnd(event, key);
  const updateItem = (key: string, id: string, field: string, val: any) => editorState?.updateItem(key, id, field, val);
  const addItem = (key: string, item: any) => editorState?.addItem(key, item);
  const removeItem = (key: string, id: string) => editorState?.removeItem(key, id);
  const updateRoot = (field: string, val: any) => editorState?.updateRoot(field, val);
  const updateSectionTitle = (key: string, val: any) => editorState?.updateSectionTitle(key, val);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  return (
    <div id="resume-preview" className={`max-w-[210mm] mx-auto min-h-[297mm] print:min-h-0 bg-white shadow-lg print:shadow-none p-[20mm] text-slate-900 font-sans ${className}`} style={{ fontFamily: '"Inter", sans-serif' }}>
      <style dangerouslySetInnerHTML={{
        __html: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');`
      }} />

      <div className="grid grid-cols-12 gap-8 h-full">
        {/* Left Column - Dark Side */}
        <aside className="col-span-12 lg:col-span-4 lg:border-r lg:pr-8 border-slate-100 flex flex-col gap-8">
          {/* Header Info */}
          <div>
            <InlineInput value={data.name} onChange={(v) => updateRoot('name', v)} className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2" placeholder="Full Name" isPreview={isPreview} />
            <InlineInput value={data.title} onChange={(v) => updateRoot('title', v)} className="text-sm font-bold text-indigo-600 uppercase tracking-widest" placeholder="Professional Title" isPreview={isPreview} />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[13px] text-slate-600 group">
              <Mail className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <InlineInput value={data.email || data.contact?.email} onChange={(v) => updateRoot('email', v)} placeholder="Email address" isPreview={isPreview} />
            </div>
            <div className="flex items-center gap-3 text-[13px] text-slate-600 group">
              <Phone className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <InlineInput value={data.phone || data.contact?.phone} onChange={(v) => updateRoot('phone', v)} placeholder="Phone number" isPreview={isPreview} />
            </div>
            <div className="flex items-center gap-3 text-[13px] text-slate-600 group">
              <MapPin className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <InlineInput value={data.location || data.contact?.location} onChange={(v) => updateRoot('location', v)} placeholder="City, Country" isPreview={isPreview} />
            </div>
            <div className="flex items-center gap-3 text-[13px] text-slate-600 group">
              <Globe className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <InlineInput value={data.website || data.contact?.website} onChange={(v) => updateRoot('website', v)} placeholder="portfolio.com" isPreview={isPreview} />
            </div>
            <div className="flex items-center gap-3 text-[13px] text-slate-600 group">
              <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <InlineInput value={data.linkedin || data.contact?.linkedin} onChange={(v) => updateRoot('linkedin', v)} placeholder="linkedin.com/in/..." isPreview={isPreview} />
            </div>
            <div className="flex items-center gap-3 text-[13px] text-slate-600 group">
              <Github className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <InlineInput value={data.github || data.contact?.github} onChange={(v) => updateRoot('github', v)} placeholder="github.com/..." isPreview={isPreview} />
            </div>
          </div>

          {/* Skills */}
          <div>
            <SectionHeader title={sectionTitles.skills} onChange={(v) => updateSectionTitle('skills', v)} isPreview={isPreview} />
            <div className="flex flex-col gap-4">
              {data.skills?.map((cat: any, i: number) => (
                <div key={i} className="group relative bg-slate-50/50 p-3 rounded-lg border border-slate-100/50">
                  {!isPreview && (
                    <button onClick={() => {
                      const updated = [...data.skills];
                      updated.splice(i, 1);
                      updateRoot('skills', updated);
                    }} className="absolute -right-2 -top-2 w-5 h-5 bg-white border border-slate-100 text-slate-300 hover:text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">×</button>
                  )}
                  <InlineInput value={cat.name} onChange={(v) => {
                    const updated = [...data.skills];
                    updated[i] = { ...updated[i], name: v };
                    updateRoot('skills', updated);
                  }} className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-1.5" placeholder="CATEGORY" isPreview={isPreview} />
                  <InlineInput value={cat.skills} onChange={(v) => {
                    const updated = [...data.skills];
                    updated[i] = { ...updated[i], skills: v };
                    updateRoot('skills', updated);
                  }} className="text-[13px] text-slate-600 leading-snug" placeholder="Skill 1, Skill 2..." multiline isPreview={isPreview} />
                </div>
              ))}
              {!isPreview && <button onClick={() => addItem('skills', { name: '', skills: '' })} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider">+ Add Category</button>}
            </div>
          </div>

          {/* Education Sidebar */}
          <div>
            <SectionHeader title={sectionTitles.education} onChange={(v) => updateSectionTitle('education', v)} isPreview={isPreview} />
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'education')}>
              <SortableContext items={data.education || []} strategy={verticalListSortingStrategy}>
                {data.education?.map((item: any) => (
                  <EducationRow key={item.id} item={item} update={(id: string, f: string, v: any) => updateItem('education', id, f, v)} remove={(id: string) => removeItem('education', id)} isPreview={isPreview} />
                ))}
              </SortableContext>
            </DndContext>
            {!isPreview && <button onClick={() => addItem('education', { school: '', degree: '', startYear: '', endYear: '', description: '' })} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider">+ Add Education</button>}
          </div>

          {/* Certifications Sidebar */}
          <div>
            <SectionHeader title={sectionTitles.certifications} onChange={(v) => updateSectionTitle('certifications', v)} isPreview={isPreview} />
            <div className="flex flex-col gap-2">
              {data.certifications?.map((cert: string, i: number) => (
                <div key={i} className="group relative flex items-center gap-2">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full shrink-0" />
                  <InlineInput value={cert} onChange={(v) => {
                    const updated = [...data.certifications];
                    updated[i] = v;
                    updateRoot('certifications', updated);
                  }} className="text-[13px] text-slate-600" placeholder="Certification Name" isPreview={isPreview} />
                  {!isPreview && (
                    <button onClick={() => {
                      const updated = [...data.certifications];
                      updated.splice(i, 1);
                      updateRoot('certifications', updated);
                    }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity whitespace-nowrap">×</button>
                  )}
                </div>
              ))}
              {!isPreview && <button onClick={() => updateRoot('certifications', [...(data.certifications || []), ''])} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider">+ Add Certification</button>}
            </div>
          </div>
        </aside>

        {/* Right Column - Content Side */}
        <main className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          {/* Summary */}
          {(data.summary || !isPreview) && (
            <div>
              <SectionHeader title={sectionTitles.summary} onChange={(v) => updateSectionTitle('summary', v)} isPreview={isPreview} />
              <InlineInput value={data.summary} onChange={(v) => updateRoot('summary', v)} multiline className="text-[14px] text-slate-600 leading-relaxed text-justify" placeholder="Professional summary..." isPreview={isPreview} />
            </div>
          )}

          {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeader title={sectionTitles.experience} onChange={(v) => updateSectionTitle('experience', v)} isPreview={isPreview} className="mb-0 flex-1" />
              {!isPreview && (
                <button onClick={() => addItem('experience', { role: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '', location: '' })} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full transition-colors">+ Add Experience</button>
              )}
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'experience')}>
              <SortableContext items={data.experience || []} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {data.experience?.map((item: any) => (
                    <ExperienceRow key={item.id} item={item} update={(id: string, f: string, v: any) => updateItem('experience', id, f, v)} remove={(id: string) => removeItem('experience', id)} isPreview={isPreview} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeader title={sectionTitles.projects} onChange={(v) => updateSectionTitle('projects', v)} isPreview={isPreview} className="mb-0 flex-1" />
              {!isPreview && (
                <button onClick={() => addItem('projects', { title: '', description: '', link: '' })} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full transition-colors">+ Add Project</button>
              )}
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'projects')}>
              <SortableContext items={data.projects || []} strategy={verticalListSortingStrategy}>
                {data.projects?.map((item: any) => (
                  <ProjectRow key={item.id} item={item} update={(id: string, f: string, v: any) => updateItem('projects', id, f, v)} remove={(id: string) => removeItem('projects', id)} isPreview={isPreview} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </main>
      </div>
    </div>
  );
}
