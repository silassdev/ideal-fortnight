import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const metadata = {
  key: 'aurora',
  title: 'Aurora',
  description: 'A clean, printable resume template with draggable experience items',
  author: 'Aurora Dev',
  authorUrl: 'https://github.com/your-org-or-user',
  thumbnail: '/templates/aurora.png',
  tags: ['resume', 'printable', 'drag-and-drop'],
};

// ... (Keep existing types: ExperienceItem) ...
type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

// --- Updated Helper Components ---

const InlineInput = ({
  value,
  onChange,
  className = "",
  placeholder = "...",
  multiline = false
}: { value: string; onChange: (val: string) => void; className?: string; placeholder?: string; multiline?: boolean }) => {
  // Added "print:placeholder-transparent" to hide "Type here..." text on the PDF
  const baseStyles = "bg-transparent border-none outline-none focus:ring-1 focus:ring-sky-200 rounded px-1 transition-all w-full print:placeholder-transparent";

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

const SortableExperienceRow = ({ item, onChange }: { item: ExperienceItem, onChange: (id: string, field: string, val: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative mb-6 break-inside-avoid">
      {/* Drag Handle - ADDED "print:hidden" so it doesn't show in PDF */}
      <div
        {...attributes}
        {...listeners}
        className="print:hidden absolute -left-8 top-2 p-2 cursor-grab opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-600 transition-opacity"
      >
        ⠿
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-8 items-start">
        <div className="flex items-center gap-1 text-sm font-semibold text-slate-500 md:text-right md:justify-end">
          <InlineInput value={item.startDate} onChange={(v) => onChange(item.id, 'startDate', v)} className="w-16 md:text-right" placeholder="Start" />
          <span>-</span>
          <InlineInput value={item.endDate} onChange={(v) => onChange(item.id, 'endDate', v)} className="w-16 md:text-right" placeholder="End" />
        </div>

        <div className="relative border-l-2 border-slate-100 pl-6 pb-2">
          <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-white print:bg-sky-500 print:print-color-adjust-exact" />
          <div className="flex flex-col gap-1">
            <InlineInput value={item.role} onChange={(v) => onChange(item.id, 'role', v)} className="text-lg font-bold text-slate-800" placeholder="Job Title" />
            <InlineInput value={item.company} onChange={(v) => onChange(item.id, 'company', v)} className="text-sm font-medium text-slate-600" placeholder="Company" />
            <InlineInput value={item.description} onChange={(v) => onChange(item.id, 'description', v)} className="text-sm text-slate-600 mt-2 leading-relaxed" placeholder="Description..." multiline />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function AuroraEditor() {
  const [resumeData, setResumeData] = useState({
    name: "Alex Morgan",
    title: "Senior Product Designer",
    summary: "Creative designer with 5+ years of experience...",
    experience: [
      { id: '1', role: 'Senior UX Designer', company: 'TechFlow', startDate: '2021', endDate: 'Present', description: 'Led dashboard redesign.' },
      { id: '2', role: 'Product Designer', company: 'Studio', startDate: '2018', endDate: '2021', description: 'Implemented design system.' },
    ] as ExperienceItem[]
  });

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // 1. Create a Reference to the Resume area
  const componentRef = useRef<HTMLDivElement>(null);

  // 2. Setup the Print Function
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${resumeData.name} - Resume`,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setResumeData((prev) => {
        const oldIndex = prev.experience.findIndex((item) => item.id === active.id);
        const newIndex = prev.experience.findIndex((item) => item.id === over?.id);
        return { ...prev, experience: arrayMove(prev.experience, oldIndex, newIndex) };
      });
    }
  };

  const updateExp = (id: string, field: string, val: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: val } : item)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center gap-6">

      {/* Action Bar */}
      <div className="flex justify-end w-full max-w-[210mm] gap-4">
        <button
          onClick={() => handlePrint && handlePrint()}
          className="bg-slate-900 text-white px-6 py-2 rounded shadow hover:bg-slate-800 font-medium transition-colors"
        >
          Download PDF
        </button>
      </div>

      {/* Resume Frame */}
      {/* Attached the Ref here */}
      <div
        ref={componentRef}
        id="resume-frame"
        className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] relative flex flex-col print:shadow-none print:w-[210mm] print:h-[297mm] print:overflow-visible"
      >
        <header className="p-12 border-b border-slate-100">
          <InlineInput value={resumeData.name} onChange={(v) => setResumeData({ ...resumeData, name: v })} className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2" />
          <InlineInput value={resumeData.title} onChange={(v) => setResumeData({ ...resumeData, title: v })} className="text-xl text-slate-500 font-medium" />
        </header>

        <main className="p-12 space-y-10">
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Profile</h2>
            <InlineInput value={resumeData.summary} onChange={(v) => setResumeData({ ...resumeData, summary: v })} multiline className="text-slate-700 leading-relaxed" />
          </section>

          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Experience</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={resumeData.experience} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {resumeData.experience.map((item) => (
                    <SortableExperienceRow key={item.id} item={item} onChange={updateExp} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Added "print:hidden" to button */}
            <button
              onClick={() => setResumeData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now().toString(), role: '', company: '', startDate: '', endDate: '', description: '' }] }))}
              className="mt-4 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity print:hidden"
            >
              + Add Experience
            </button>
          </section>
        </main>
      </div>

      <style type="text/css" media="print">
        {`
          @page { size: A4; margin: 0mm; }
          body { -webkit-print-color-adjust: exact; }
        `}
      </style>
    </div>
  );
}
