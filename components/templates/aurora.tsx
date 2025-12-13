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
import { EditorToolbar } from '@/components/ui/EditorToolbar';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import SaveStatusModal from '@/components/ui/SaveStatusModal';

// --- Types ---
type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
};

type EducationItem = {
  id: string;
  school: string;
  degree: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
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
  onBlur,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  isPreview?: boolean;
  onBlur?: () => void;
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, multiline]);

  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`${baseStyles} resize-none overflow-hidden ${className}`}
        placeholder={placeholder}
        rows={1}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
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

const ExperienceRow = ({ item, update, remove, isPreview }: { item: ExperienceItem, update: (id: string, field: string | object, val: any) => void, remove: (id: string) => void, isPreview: boolean }) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="grid grid-cols-1 gap-1 items-baseline">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2">
        <div className="flex flex-col">
          <InlineInput value={item.role} onChange={(v) => update(item.id, 'role', v)} className="text-lg font-bold text-slate-800 leading-tight" placeholder="Job Title" isPreview={isPreview} />
          <InlineInput value={item.company} onChange={(v) => update(item.id, 'company', v)} className="text-md font-medium text-slate-600" placeholder="Company Name" isPreview={isPreview} />
        </div>

        {isPreview ? (
          <div className="text-sm font-semibold text-slate-400 whitespace-nowrap">
            {item.startMonth} {item.startYear} - {item.current ? "Present" : `${item.endMonth} ${item.endYear}`}
          </div>
        ) : (
          <DateRangePicker
            startMonth={item.startMonth}
            startYear={item.startYear}
            endMonth={item.endMonth}
            endYear={item.endYear}
            current={item.current}
            onChange={(d) => {
              update(item.id, d, undefined);
            }}
            className="scale-90 origin-top-right transform"
          />
        )}
      </div>
    </div>
    <div className={`mt-2 ${isPreview ? 'pl-0 border-l-0' : 'pl-0 md:pl-0 border-l-2 border-slate-100 ml-1 md:ml-0 md:border-l-0'}`}>
      <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-sm text-slate-600 leading-relaxed" placeholder="• Achievements and responsibilities..." multiline isPreview={isPreview} />
    </div>
  </SortableItemWrapper>
);

const EducationRow = ({ item, update, remove, isPreview }: { item: EducationItem, update: (id: string, field: string | object, val: any) => void, remove: (id: string) => void, isPreview: boolean }) => (
  <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
    <div className="grid grid-cols-1 gap-1 items-baseline">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2">
        <div className="flex flex-col">
          <InlineInput value={item.school} onChange={(v) => update(item.id, 'school', v)} className="text-md font-bold text-slate-800" placeholder="School / University" isPreview={isPreview} />
          <InlineInput value={item.degree} onChange={(v) => update(item.id, 'degree', v)} className="text-sm text-slate-600 italic" placeholder="Degree / Field of Study" isPreview={isPreview} />
        </div>

        {isPreview ? (
          <div className="text-sm font-semibold text-slate-400 whitespace-nowrap">
            {item.startMonth} {item.startYear} - {item.current ? "Present" : `${item.endMonth} ${item.endYear}`}
          </div>
        ) : (
          <DateRangePicker
            startMonth={item.startMonth}
            startYear={item.startYear}
            endMonth={item.endMonth}
            endYear={item.endYear}
            current={item.current}
            onChange={(d) => {
              update(item.id, d, undefined);
            }}
            className="scale-90 origin-top-right transform"
          />
        )}
      </div>
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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2 w-full">
      <div className="flex flex-wrap gap-2 items-baseline w-full">
        <div className="flex-shrink-0">
          <InlineInput value={item.name} onChange={(v) => update(item.id, 'name', v)} className="text-sm font-bold text-slate-700 min-w-[150px]" placeholder="Certificate Name" isPreview={isPreview} />
        </div>
        {!isPreview && <span className="text-slate-400 text-sm hidden md:inline">-</span>}
        {isPreview && item.name && item.issuer && <span className="text-slate-400 text-sm">-</span>}
        <div className="flex-grow min-w-0">
          <InlineInput value={item.issuer} onChange={(v) => update(item.id, 'issuer', v)} className="text-sm text-slate-500 break-words w-full" placeholder="Issuer" isPreview={isPreview} multiline={true} />
        </div>
      </div>
      <InlineInput value={item.date} onChange={(v) => update(item.id, 'date', v)} className="text-xs font-semibold text-slate-400 md:text-right w-full md:w-auto" placeholder="Date" isPreview={isPreview} />
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

// --- Main Component ---

interface AuroraEditorProps {
  initialData?: ResumeData | null;
}

export default function AuroraEditor({ initialData }: AuroraEditorProps) {
  // State
  const [data, setData] = useState<ResumeData>({
    ...INITIAL_DATA,
    ...initialData,
    sectionTitles: {
      ...DEFAULT_TITLES,
      ...(initialData?.sectionTitles || {})
    }
  });

  const [history, setHistory] = useState<ResumeData[]>([data]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ isOpen: boolean; status: 'success' | 'error'; }>({ isOpen: false, status: 'success' });

  // Refs
  const componentRef = useRef<HTMLDivElement>(null);
  const historyDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sensors for Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Persistence (Legacy LS)
  useEffect(() => {
    if (!initialData) {
      const saved = localStorage.getItem('aurora_resume_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const merged = {
            ...INITIAL_DATA,
            ...parsed,
            sectionTitles: { ...DEFAULT_TITLES, ...parsed.sectionTitles }
          };
          setData(merged);
          setHistory([merged]);
        } catch (e) { console.error("LS Load Error", e); }
      }
    }
  }, [initialData]);

  // History Management
  const addToHistory = (newData: ResumeData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      // Avoid duplicates
      if (JSON.stringify(newHistory[newHistory.length - 1]) === JSON.stringify(newData)) return prev;
      newHistory.push(newData);
      if (newHistory.length > 50) newHistory.shift(); // Limit
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49)); // Adjust index logic if shifting
  };

  // Central Update Handler
  const handleDataChange = (newData: ResumeData, immediateHistory = false) => {
    setData(newData);
    setIsDirty(true);
    localStorage.setItem('aurora_resume_data', JSON.stringify(newData));

    if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);

    if (immediateHistory) {
      addToHistory(newData);
    } else {
      historyDebounceRef.current = setTimeout(() => {
        addToHistory(newData);
      }, 1000);
    }
  };

  // Actions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Save failed');
      setIsDirty(false);
      setSaveStatus({ isOpen: true, status: 'success' });
    } catch (error) {
      console.error(error);
      setSaveStatus({ isOpen: true, status: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.name} - Resume`,
    onBeforeGetContent: async () => {
      if (isDirty) {
        // We allow print but warn. Or we could auto-save.
        // For now, let's auto-save? No, safer to alert.
        const confirm = window.confirm("You have unsaved changes. It is recommended to SAVE before downloading. Continue anyway?");
        if (!confirm) throw new Error("Unsaved changes");
      }
      setIsPreview(true);
      return new Promise((resolve) => setTimeout(resolve, 300));
    },
    onAfterPrint: () => setIsPreview(false),
    onPrintError: (errorLocation: any, error: any) => {
      if (error.message !== "Unsaved changes") console.error(error);
    }
  } as any);


  // CRUD Helpers
  const handleDragEnd = (event: DragEndEvent, listKey: keyof ResumeData) => {
    const { active, over } = event;
    if (active.id !== over?.id && Array.isArray(data[listKey])) {
      const list = data[listKey] as any[];
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over?.id);
      handleDataChange({ ...data, [listKey]: arrayMove(list, oldIndex, newIndex) }, true);
    }
  };

  const updateItem = (listKey: keyof ResumeData, id: string, field: string | object, val?: any) => {
    handleDataChange({
      ...data,
      [listKey]: (data[listKey] as any[]).map(item => {
        if (item.id !== id) return item;
        if (typeof field === 'object') {
          return { ...item, ...field };
        }
        return { ...item, [field]: val };
      })
    });
  };

  const addItem = (listKey: keyof ResumeData, newItem: any) => {
    handleDataChange({
      ...data,
      [listKey]: [...(data[listKey] as any[]), { ...newItem, id: Date.now().toString() }]
    }, true);
  };

  const removeItem = (listKey: keyof ResumeData, id: string) => {
    handleDataChange({
      ...data,
      [listKey]: (data[listKey] as any[]).filter(item => item.id !== id)
    }, true);
  };

  const updateRoot = (field: keyof ResumeData, value: any) => {
    handleDataChange({ ...data, [field]: value });
  };

  const updateSectionTitle = (key: keyof SectionTitles, val: string) => {
    handleDataChange({ ...data, sectionTitles: { ...data.sectionTitles, [key]: val } });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center gap-6 font-sans">

      <SaveStatusModal
        isOpen={saveStatus.isOpen}
        status={saveStatus.status}
        onClose={() => setSaveStatus(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Action Bar */}
      <EditorToolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onSave={handleSave}
        isSaving={isSaving}
        isDirty={isDirty}
        onPreviewToggle={() => setIsPreview(!isPreview)}
        isPreview={isPreview}
        onDownload={handlePrint || (() => { })}
      />

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
              <button onClick={() => addItem('experience', { role: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
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
              <button onClick={() => addItem('education', { school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
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
          <div> {/* Wrapper to prevent fragment issues */}
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
          </div>
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