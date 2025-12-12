"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Types ---
type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  date: string;
  description: string;
};

type EducationItem = {
  id: string;
  school: string;
  degree: string;
  date: string;
  description: string;
};

type ProjectItem = {
  id: string;
  name: string;
  link: string;
  tech: string;
  description: string;
};

type CertificationItem = {
  id: string;
  name: string;
  issuer: string;
  date: string;
};

type SkillCategory = {
  id: string;
  name: string;
  skills: string;
};

type SectionTitles = {
  summary: string;
  experience: string;
  education: string;
  projects: string;
  skills: string;
  certifications: string;
};

type ResumeData = {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  skills: SkillCategory[];
  sectionTitles: SectionTitles;
};

const DEFAULT_TITLES: SectionTitles = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
};

// Initial state for new users
const INITIAL_DATA: ResumeData = {
  name: "Alex Morgan",
  title: "Senior Product Designer",
  summary: "Creative designer with 5+ years of experience in building user-centric digital products.",
  email: "alex@example.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  website: "alexmorgan.design",
  linkedin: "linkedin.com/in/alexmorgan",
  github: "github.com/alexmorgan",
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  skills: [],
  sectionTitles: DEFAULT_TITLES,
};

export const metadata = {
  key: 'aurora',
  title: 'Aurora',
  description: 'A comprehensive, professional resume template with drag-and-drop sections.',
  author: 'Aurora Dev',
  authorUrl: 'https://github.com/your-org-or-user',
  thumbnail: '/templates/aurora.png',
  tags: ['professional', 'fullstack', 'drag-and-drop', 'clean'],
};


// --- Helper Components ---

const InlineInput = ({
  value,
  onChange,
  className = "",
  placeholder = "...",
  multiline = false,
  isPreview = false,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  isPreview?: boolean;
}) => {
  const baseStyles = "bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-200 rounded px-1 transition-all w-full leading-normal";

  if (isPreview) {
    if (!value) return null;
    return (
      <div className={`${className} whitespace-pre-wrap`}>
        {value}
      </div>
    );
  }

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseStyles} resize-none overflow-hidden ${className}`}
        placeholder={placeholder}
        rows={1}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = target.scrollHeight + 'px';
        }}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseStyles} ${className}`}
      placeholder={placeholder}
    />
  );
};

const SectionHeader = ({ title, onChange, className = "", isPreview }: { title: string, onChange: (val: string) => void, className?: string, isPreview?: boolean }) => {
  if (isPreview) {
    return (
      <h2 className={`text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 ${className}`}>
        {title}
      </h2>
    );
  }
  return (
    <div className={`mb-4 border-b border-slate-100 pb-2 ${className}`}>
      <input
        value={title}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-200 rounded px-1 w-full"
      />
    </div>
  );
};

// --- Sortable Components ---

const DragHandle = ({ attributes, listeners, isPreview }: { attributes: any, listeners: any, isPreview: boolean }) => {
  if (isPreview) return null;
  return (
    <div
      {...attributes}
      {...listeners}
      className="absolute -left-6 top-1 p-1.5 cursor-grab opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-opacity"
      title="Drag to reorder"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
    </div>
  );
};

const DeleteButton = ({ onDelete, isPreview }: { onDelete: () => void, isPreview: boolean }) => {
  if (isPreview) return null;
  return (
    <button
      onClick={onDelete}
      className="absolute -right-6 top-1 p-1.5 cursor-pointer opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
      title="Remove item"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
    </button>
  );
};

const SortableItemWrapper = ({ id, children, onDelete, isPreview }: { id: string, children: React.ReactNode, onDelete: () => void, isPreview: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  if (isPreview) {
    return <div className="mb-4">{children}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} className="group relative mb-4 break-inside-avoid hover:bg-slate-50/50 rounded -mx-2 px-2 transition-colors">
      <DragHandle attributes={attributes} listeners={listeners} isPreview={false} />
      {children}
      <DeleteButton onDelete={onDelete} isPreview={false} />
    </div>
  );
};

const ExperienceRow = ({ item, update, remove, isPreview }: { item: ExperienceItem, update: (id: string, field: string, val: string) => void, remove: (id: string) => void, isPreview: boolean }) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-1 items-baseline">
      <div className="flex flex-col">
        <InlineInput value={item.role} onChange={(v) => update(item.id, 'role', v)} className="text-lg font-bold text-slate-800 leading-tight" placeholder="Job Title" isPreview={isPreview} />
        <InlineInput value={item.company} onChange={(v) => update(item.id, 'company', v)} className="text-md font-medium text-slate-600" placeholder="Company Name" isPreview={isPreview} />
      </div>
      <InlineInput value={item.date} onChange={(v) => update(item.id, 'date', v)} className="text-sm font-semibold text-slate-400 md:text-right" placeholder="Jan 2020 - Present" isPreview={isPreview} />
    </div>
    <div className={`mt-2 ${isPreview ? 'pl-0 border-l-0' : 'pl-0 md:pl-0 border-l-2 border-slate-100 ml-1 md:ml-0 md:border-l-0'}`}>
      <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-sm text-slate-600 leading-relaxed" placeholder="• Achievements and responsibilities..." multiline isPreview={isPreview} />
    </div>
  </SortableItemWrapper>
);

const EducationRow = ({ item, update, remove, isPreview }: { item: EducationItem, update: (id: string, field: string, val: string) => void, remove: (id: string) => void, isPreview: boolean }) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-1 items-baseline">
      <div className="flex flex-col">
        <InlineInput value={item.school} onChange={(v) => update(item.id, 'school', v)} className="text-md font-bold text-slate-800" placeholder="School / University" isPreview={isPreview} />
        <InlineInput value={item.degree} onChange={(v) => update(item.id, 'degree', v)} className="text-sm text-slate-600 italic" placeholder="Degree / Field of Study" isPreview={isPreview} />
      </div>
      <InlineInput value={item.date} onChange={(v) => update(item.id, 'date', v)} className="text-sm font-semibold text-slate-400 md:text-right" placeholder="Graduation Year" isPreview={isPreview} />
    </div>
  </SortableItemWrapper>
);

const ProjectRow = ({ item, update, remove, isPreview }: { item: ProjectItem, update: (id: string, field: string, val: string) => void, remove: (id: string) => void, isPreview: boolean }) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        <InlineInput value={item.name} onChange={(v) => update(item.id, 'name', v)} className="text-md font-bold text-slate-800 w-auto flex-grow-0" placeholder="Project Name" isPreview={isPreview} />
        {!isPreview && <span className="text-slate-300">|</span>}
        <InlineInput value={item.link} onChange={(v) => update(item.id, 'link', v)} className="text-xs text-blue-500 w-auto" placeholder="Link (e.g., github.com/proj)" isPreview={isPreview} />
      </div>
      <InlineInput value={item.tech} onChange={(v) => update(item.id, 'tech', v)} className="text-xs font-mono text-indigo-500" placeholder="Tech Stack: React, Node, etc." isPreview={isPreview} />
      <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-sm text-slate-600 leading-relaxed" placeholder="Brief description of the project..." multiline isPreview={isPreview} />
    </div>
  </SortableItemWrapper>
);

const SkillRow = ({ item, update, remove, isPreview }: { item: SkillCategory, update: (id: string, field: string, val: string) => void, remove: (id: string) => void, isPreview: boolean }) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
      <InlineInput value={item.name} onChange={(v) => update(item.id, 'name', v)} className="text-sm font-bold text-slate-700 text-right" placeholder="Category" isPreview={isPreview} />
      <InlineInput value={item.skills} onChange={(v) => update(item.id, 'skills', v)} className="text-sm text-slate-600" placeholder="List of skills..." multiline isPreview={isPreview} />
    </div>
  </SortableItemWrapper>
);

const CertificationRow = ({ item, update, remove, isPreview }: { item: CertificationItem, update: (id: string, field: string, val: string) => void, remove: (id: string) => void, isPreview: boolean }) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="flex justify-between items-baseline">
      <div className="flex gap-2 items-baseline">
        <InlineInput value={item.name} onChange={(v) => update(item.id, 'name', v)} className="text-sm font-bold text-slate-700" placeholder="Certificate Name" isPreview={isPreview} />
        {!isPreview && <span className="text-slate-400 text-sm">-</span>}
        {isPreview && item.name && item.issuer && <span className="text-slate-400 text-sm">-</span>}
        <InlineInput value={item.issuer} onChange={(v) => update(item.id, 'issuer', v)} className="text-sm text-slate-500" placeholder="Issuer" isPreview={isPreview} />
      </div>
      <InlineInput value={item.date} onChange={(v) => update(item.id, 'date', v)} className="text-xs font-semibold text-slate-400 text-right w-24" placeholder="Date" isPreview={isPreview} />
    </div>
  </SortableItemWrapper>
);

const ContactItem = ({ value, icon, onChange, placeholder, isPreview }: any) => {
  if (isPreview && !value) return null;
  return (
    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
      <span className="text-slate-400">{icon}</span>
      <InlineInput value={value} onChange={onChange} className="w-auto min-w-[100px]" placeholder={placeholder} isPreview={isPreview} />
    </div>
  );
};


// --- Main Component ---

interface AuroraEditorProps {
  initialData?: ResumeData | null;
}

export default function AuroraEditor({ initialData }: AuroraEditorProps) {
  const [data, setData] = useState<ResumeData>(initialData || INITIAL_DATA);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.name} - Resume`,
    onBeforeGetContent: async () => {
      // Guard: Check if saved
      if (isDirty) {
        alert("Please SAVE your changes before downloading to ensure you have the latest version.");
        // We throw an error to cancel the print process, though react-to-print might log it
        throw new Error("Unsaved changes");
      }
      setIsPreview(true);
      // Wait for React to render the preview state
      return new Promise((resolve) => setTimeout(resolve, 200));
    },
    onAfterPrint: () => setIsPreview(false),
    // Handle error if we blocked it
    onPrintError: (errorLocation: any, error: any) => {
      if (error.message === "Unsaved changes") {
        // Already alerted user
      } else {
        console.error("Print failed", error);
      }
    }
  } as any);

  // Load local storage if no initial data provided (legacy behavior support)
  useEffect(() => {
    if (!initialData) {
      const saved = localStorage.getItem('aurora_resume_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setData(prev => ({ ...prev, ...parsed, sectionTitles: { ...DEFAULT_TITLES, ...parsed.sectionTitles } }));
        } catch (e) { console.error("LS Load Error", e); }
      }
    }
  }, [initialData]);

  // Mark dirty on change
  const handleDataChange = (newData: ResumeData) => {
    setData(newData);
    setIsDirty(true);
    // Still sync to LS for safety
    localStorage.setItem('aurora_resume_data', JSON.stringify(newData));
  };


  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Sending full data object
      });

      if (!res.ok) throw new Error('Save failed');

      setIsDirty(false);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };


  // --- Helpers ---
  const handleDragEnd = (event: DragEndEvent, listKey: keyof ResumeData) => {
    const { active, over } = event;
    if (active.id !== over?.id && Array.isArray(data[listKey])) {
      const list = data[listKey] as any[];
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over?.id);
      handleDataChange({ ...data, [listKey]: arrayMove(list, oldIndex, newIndex) });
    }
  };

  const updateItem = (listKey: keyof ResumeData, id: string, field: string, val: string) => {
    handleDataChange({
      ...data,
      [listKey]: (data[listKey] as any[]).map(item => item.id === id ? { ...item, [field]: val } : item)
    });
  };

  const addItem = (listKey: keyof ResumeData, newItem: any) => {
    handleDataChange({
      ...data,
      [listKey]: [...(data[listKey] as any[]), { ...newItem, id: Date.now().toString() }]
    });
  };

  const removeItem = (listKey: keyof ResumeData, id: string) => {
    handleDataChange({
      ...data,
      [listKey]: (data[listKey] as any[]).filter(item => item.id !== id)
    });
  };

  const updateRoot = (field: keyof ResumeData, value: any) => {
    handleDataChange({ ...data, [field]: value });
  };

  const updateSectionTitle = (key: keyof SectionTitles, val: string) => {
    handleDataChange({ ...data, sectionTitles: { ...data.sectionTitles, [key]: val } });
  };


  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center gap-6 font-sans">

      {/* Action Bar */}
      <div className="flex justify-between w-full max-w-[210mm] gap-4 mb-2 sticky top-4 z-50 bg-slate-100/90 backdrop-blur p-2 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 font-mono self-center hidden md:block">Aurora Editor</div>

          <div className="bg-slate-200 rounded-lg p-1 flex text-xs font-semibold">
            <button
              onClick={() => setIsPreview(false)}
              className={`px-3 py-1 rounded ${!isPreview ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Edit
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`px-3 py-1 rounded ${isPreview ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${isDirty
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
          </button>

          <button
            onClick={() => handlePrint && handlePrint()}
            className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium shadow hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span className="hidden md:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {/* Resume Frame */}
      <div
        ref={componentRef}
        id="resume-frame"
        className={`bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] relative flex flex-col print:shadow-none print:mx-auto print:w-full print:h-auto print:overflow-visible ${isPreview ? 'pointer-events-none' : ''}`}
        style={{ padding: '40px 50px' }}
      >
        {/* Header */}
        <header className="mb-8 border-b border-slate-100 pb-8">
          <InlineInput value={data.name} onChange={(v) => updateRoot('name', v)} className="text-4xl font-extrabold tracking-tight text-slate-900 mb-1" placeholder="Your Name" isPreview={isPreview} />
          <InlineInput value={data.title} onChange={(v) => updateRoot('title', v)} className="text-xl text-indigo-500 font-medium mb-4" placeholder="Professional Title" isPreview={isPreview} />

          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
            <ContactItem icon="✉" value={data.email} onChange={(v: string) => updateRoot('email', v)} placeholder="Email" isPreview={isPreview} />
            <ContactItem icon="phone" value={data.phone} onChange={(v: string) => updateRoot('phone', v)} placeholder="Phone" isPreview={isPreview} />
            <ContactItem icon="map" value={data.location} onChange={(v: string) => updateRoot('location', v)} placeholder="Location" isPreview={isPreview} />
            <ContactItem icon="🌐" value={data.website} onChange={(v: string) => updateRoot('website', v)} placeholder="Website" isPreview={isPreview} />
            <ContactItem icon="in" value={data.linkedin} onChange={(v: string) => updateRoot('linkedin', v)} placeholder="LinkedIn" isPreview={isPreview} />
            <ContactItem icon="git" value={data.github} onChange={(v: string) => updateRoot('github', v)} placeholder="GitHub" isPreview={isPreview} />
          </div>
        </header>

        {/* Summary */}
        <section className="mb-8">
          <SectionHeader title={data.sectionTitles.summary} onChange={(v) => updateSectionTitle('summary', v)} isPreview={isPreview} />
          <InlineInput value={data.summary} onChange={(v) => updateRoot('summary', v)} multiline className="text-sm text-slate-700 leading-relaxed text-justify" placeholder="Professional summary..." isPreview={isPreview} />
        </section>

        {/* Experience */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-grow">
              <SectionHeader title={data.sectionTitles.experience} onChange={(v) => updateSectionTitle('experience', v)} className="mb-0 border-b-0" isPreview={isPreview} />
            </div>
            {!isPreview && (
              <button onClick={() => addItem('experience', { role: '', company: '', date: '', description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
            )}
          </div>
          {isPreview ? (
            <div className="space-y-4">
              {data.experience.map((item) => <ExperienceRow key={item.id} item={item} update={() => { }} remove={() => { }} isPreview={true} />)}
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'experience')}>
              <SortableContext items={data.experience} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {data.experience.map((item) => (
                    <ExperienceRow key={item.id} item={item} update={(id, f, v) => updateItem('experience', id, f, v)} remove={(id) => removeItem('experience', id)} isPreview={false} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* Education */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-grow">
              <SectionHeader title={data.sectionTitles.education} onChange={(v) => updateSectionTitle('education', v)} className="mb-0 border-b-0" isPreview={isPreview} />
            </div>
            {!isPreview && (
              <button onClick={() => addItem('education', { school: '', degree: '', date: '', description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
            )}
          </div>
          {isPreview ? (
            <div className="space-y-4">
              {data.education.map((item) => <EducationRow key={item.id} item={item} update={() => { }} remove={() => { }} isPreview={true} />)}
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'education')}>
              <SortableContext items={data.education} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {data.education.map((item) => (
                    <EducationRow key={item.id} item={item} update={(id, f, v) => updateItem('education', id, f, v)} remove={(id) => removeItem('education', id)} isPreview={false} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* Projects */}
        <section className="mb-8 break-inside-avoid">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-grow">
              <SectionHeader title={data.sectionTitles.projects} onChange={(v) => updateSectionTitle('projects', v)} className="mb-0 border-b-0" isPreview={isPreview} />
            </div>
            {!isPreview && (
              <button onClick={() => addItem('projects', { name: '', link: '', tech: '', description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
            )}
          </div>
          {isPreview ? (
            <div className="space-y-4">
              {data.projects.map((item) => <ProjectRow key={item.id} item={item} update={() => { }} remove={() => { }} isPreview={true} />)}
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'projects')}>
              <SortableContext items={data.projects} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {data.projects.map((item) => (
                    <ProjectRow key={item.id} item={item} update={(id, f, v) => updateItem('projects', id, f, v)} remove={(id) => removeItem('projects', id)} isPreview={false} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* Compact Sections: Skills & Certs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 break-inside-avoid">
          {/* Skills */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div className="flex-grow">
                <SectionHeader title={data.sectionTitles.skills} onChange={(v) => updateSectionTitle('skills', v)} className="mb-0 border-b-0" isPreview={isPreview} />
              </div>
              {!isPreview && (
                <button onClick={() => addItem('skills', { name: '', skills: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
              )}
            </div>
            {isPreview ? (
              <div className="space-y-2">
                {data.skills.map((item) => <SkillRow key={item.id} item={item} update={() => { }} remove={() => { }} isPreview={true} />)}
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'skills')}>
                <SortableContext items={data.skills} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {data.skills.map((item) => (
                      <SkillRow key={item.id} item={item} update={(id, f, v) => updateItem('skills', id, f, v)} remove={(id) => removeItem('skills', id)} isPreview={false} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>

          {/* Certifications */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div className="flex-grow">
                <SectionHeader title={data.sectionTitles.certifications} onChange={(v) => updateSectionTitle('certifications', v)} className="mb-0 border-b-0" isPreview={isPreview} />
              </div>
              {!isPreview && (
                <button onClick={() => addItem('certifications', { name: '', issuer: '', date: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
              )}
            </div>
            {isPreview ? (
              <div className="space-y-2">
                {data.certifications.map((item) => <CertificationRow key={item.id} item={item} update={() => { }} remove={() => { }} isPreview={true} />)}
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'certifications')}>
                <SortableContext items={data.certifications} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {data.certifications.map((item) => (
                      <CertificationRow key={item.id} item={item} update={(id, f, v) => updateItem('certifications', id, f, v)} remove={(id) => removeItem('certifications', id)} isPreview={false} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>
        </div>

      </div>

      <style type="text/css" media="print">
        {`
          @page { size: A4; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact; 
            background: white; 
            print-color-adjust: exact;
          }
          /* Ensure the resume frame matches A4 exactly in print */
          #resume-frame {
            width: 210mm;
            min-height: 297mm;
            padding: 40px 50px !important;
            box-shadow: none !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          /* Hide non-print elements */
          button, .print-hidden {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
}