"use client";

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
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import {
    InlineInput,
    SectionHeader,
    ContactItem,
    SortableItemWrapper
} from '@/components/editor/SharedComponents';

// Minimal Types
interface StarterProps {
    resume: any;
    editorState?: any;
}

export const metadata = {
    key: 'starter',
    title: 'Starter',
    description: 'A minimal, clean template perfect for juniors or concise resumes.',
    author: 'Aurora Dev',
    authorUrl: 'https://github.com/your-org-or-user',
    thumbnail: '/templates/starter.png', // Placeholder or use a generic one
    tags: ['minimal', 'clean', 'junior'],
};

// Row Components (Simplified Logic, can be extracted further if needed, but defining here for template-specific styling if needed)
const ExperienceRow = ({ item, update, remove, isPreview }: any) => (
    <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
        <div className="mb-5 last:mb-0">
            <div className="flex justify-between items-baseline mb-1">
                <div className="flex-1 mr-4">
                    <InlineInput value={item.role} onChange={(v) => update(item.id, 'role', v)} placeholder="Role / Job Title" className="font-semibold text-slate-900 text-[15px]" isPreview={isPreview} />
                </div>
                {!isPreview ? (
                    <DateRangePicker
                        startMonth={item.startMonth}
                        startYear={item.startYear}
                        endMonth={item.endMonth}
                        endYear={item.endYear}
                        current={item.current}
                        onChange={(d) => update(item.id, d, undefined)}
                        className="scale-90 origin-top-right transform"
                    />
                ) : (
                    <div className="text-[12px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.startMonth} {item.startYear} — {item.current ? "Present" : `${item.endMonth} ${item.endYear}`}
                    </div>
                )}
            </div>
            <div className="text-sm font-medium text-indigo-600 mb-2">
                <InlineInput value={item.company} onChange={(v) => update(item.id, 'company', v)} placeholder="Company" isPreview={isPreview} />
            </div>
            <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-[13.5px] text-slate-600 leading-relaxed" placeholder="Description..." multiline isPreview={isPreview} />
        </div>
    </SortableItemWrapper>
);

const EducationRow = ({ item, update, remove, isPreview }: any) => (
    <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-baseline mb-1">
                <div className="flex-1 mr-4">
                    <InlineInput value={item.school} onChange={(v) => update(item.id, 'school', v)} placeholder="School" className="font-semibold text-slate-900 text-[15px]" isPreview={isPreview} />
                </div>
                {!isPreview ? (
                    <DateRangePicker
                        startMonth={item.startMonth}
                        startYear={item.startYear}
                        endMonth={item.endMonth}
                        endYear={item.endYear}
                        current={item.current}
                        onChange={(d) => update(item.id, d, undefined)}
                        className="scale-90 origin-top-right transform"
                    />
                ) : (
                    <div className="text-[12px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.startMonth} {item.startYear} — {item.current ? "Present" : `${item.endMonth} ${item.endYear}`}
                    </div>
                )}
            </div>
            <div className="text-sm font-medium text-indigo-600 mb-1">
                <InlineInput value={item.degree} onChange={(v) => update(item.id, 'degree', v)} placeholder="Degree" isPreview={isPreview} />
            </div>
            <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-[13.5px] text-slate-600 leading-relaxed" placeholder="Description..." multiline isPreview={isPreview} />
        </div>
    </SortableItemWrapper>
);


const DEFAULT_TITLES = {
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    certifications: 'Certifications',
    summary: 'Professional Summary'
};


export default function Starter({ resume, editorState }: StarterProps) {
    // Fallback to resume prop if editorState is missing (e.g. public view)
    const data = editorState?.data || resume;
    const isPreview = editorState?.isPreview ?? true; // Default to true for public/preview

    // Ensure sectionTitles exist
    const sectionTitles = { ...DEFAULT_TITLES, ...(data.sectionTitles || {}) };

    // Dummy handlers if editorState is missing
    const handleDragEnd = editorState?.handleDragEnd || (() => { });
    const updateItem = editorState?.updateItem || (() => { });
    const addItem = editorState?.addItem || (() => { });
    const removeItem = editorState?.removeItem || (() => { });
    const updateRoot = editorState?.updateRoot || (() => { });
    const updateSectionTitle = editorState?.updateSectionTitle || (() => { });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    return (
        <div id="resume-preview" className="text-slate-800 max-w-[210mm] mx-auto min-h-[297mm] print:min-h-0 bg-white p-[20mm] shadow-lg print:shadow-none print:p-0" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
            ` }} />
            {/* Header (Modernized) */}
            <div className="text-center mb-9 border-b-2 pb-8 border-slate-100">
                <InlineInput value={data.name} onChange={(v) => updateRoot('name', v)} className="text-[36px] font-bold tracking-tight text-slate-900 text-center mb-0" placeholder="Your Name" isPreview={isPreview} />
                <InlineInput value={data.title} onChange={(v) => updateRoot('title', v)} className="text-[16px] text-indigo-600 font-medium uppercase tracking-[0.15em] text-center mb-5" placeholder="Role / Title" isPreview={isPreview} />

                <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <InlineInput value={data.email || data.contact?.email} onChange={(v) => updateRoot('email', v)} placeholder="Email" isPreview={isPreview} className="w-auto min-w-[50px]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <InlineInput value={data.phone || data.contact?.phone} onChange={(v) => updateRoot('phone', v)} placeholder="Phone" isPreview={isPreview} className="w-auto min-w-[50px]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <InlineInput value={data.location || data.contact?.location} onChange={(v) => updateRoot('location', v)} placeholder="Location" isPreview={isPreview} className="w-auto min-w-[50px]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <InlineInput value={data.website || data.contact?.website} onChange={(v) => updateRoot('website', v)} placeholder="Website" isPreview={isPreview} className="w-auto min-w-[50px]" />
                    </div>
                </div>
            </div>

            {/* Summary */}
            {(data.summary || !isPreview) && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <SectionHeader title={sectionTitles.summary} onChange={(v) => updateSectionTitle('summary', v)} isPreview={isPreview} className="border-none mb-0 text-slate-900 text-[14px] font-bold uppercase tracking-wider whitespace-nowrap" />
                        <div className="h-[1px] bg-slate-100 flex-1" />
                    </div>
                    <InlineInput value={data.summary} onChange={(v) => updateRoot('summary', v)} multiline className="text-[14px] text-slate-600 leading-relaxed text-justify" placeholder="Professional summary..." isPreview={isPreview} />
                </div>
            )}

            {/* Experience */}
            {(data.experience?.length > 0 || !isPreview) && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                        <SectionHeader title={sectionTitles.experience} onChange={(v) => updateSectionTitle('experience', v)} isPreview={isPreview} className="border-none mb-0 text-slate-900 text-[14px] font-bold uppercase tracking-wider whitespace-nowrap" />
                        <div className="h-[1px] bg-slate-100 flex-1" />
                        {!isPreview && (
                            <button onClick={() => addItem('experience', { role: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' })} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded">+ ADD</button>
                        )}
                    </div>
                    <DndContext id="starter-dnd-experience" sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'experience')}>
                        <SortableContext items={data.experience} strategy={verticalListSortingStrategy}>
                            <div className="space-y-6">
                                {data.experience.map((item: any) => (
                                    <ExperienceRow key={item.id} item={item} update={(id: string, f: any, v: any) => updateItem('experience', id, f, v)} remove={(id: string) => removeItem('experience', id)} isPreview={isPreview} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}

            {/* Education */}
            {(data.education?.length > 0 || !isPreview) && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                        <SectionHeader title={sectionTitles.education} onChange={(v) => updateSectionTitle('education', v)} isPreview={isPreview} className="border-none mb-0 text-slate-900 text-[14px] font-bold uppercase tracking-wider whitespace-nowrap" />
                        <div className="h-[1px] bg-slate-100 flex-1" />
                        {!isPreview && (
                            <button onClick={() => addItem('education', { school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' })} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded">+ ADD</button>
                        )}
                    </div>
                    <DndContext id="starter-dnd-education" sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'education')}>
                        <SortableContext items={data.education} strategy={verticalListSortingStrategy}>
                            <div className="space-y-5">
                                {data.education.map((item: any) => (
                                    <EducationRow key={item.id} item={item} update={(id: string, f: any, v: any) => updateItem('education', id, f, v)} remove={(id: string) => removeItem('education', id)} isPreview={isPreview} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}

            {/* Skills */}
            {(data.skills?.length > 0 || !isPreview) && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                        <SectionHeader title={sectionTitles.skills} onChange={(v) => updateSectionTitle('skills', v)} isPreview={isPreview} className="border-none mb-0 text-slate-900 text-[14px] font-bold uppercase tracking-wider whitespace-nowrap" />
                        <div className="h-[1px] bg-slate-100 flex-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {data.skills.map((cat: any) => (
                            <div key={cat.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 group relative">
                                <InlineInput value={cat.name} onChange={(v) => updateItem('skills', cat.id, 'name', v)} className="font-bold text-[12px] text-slate-900 uppercase tracking-wide mb-1" placeholder="Category" isPreview={isPreview} />
                                <InlineInput value={cat.skills} onChange={(v) => updateItem('skills', cat.id, 'skills', v)} className="text-[13px] text-slate-600" placeholder="List skills..." multiline isPreview={isPreview} />
                                {!isPreview && (
                                    <button onClick={() => removeItem('skills', cat.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-red-500 transition-opacity font-bold">REMOVE</button>
                                )}
                            </div>
                        ))}
                        {!isPreview && (
                            <button onClick={() => addItem('skills', { name: '', skills: '' })} className="bg-slate-100 p-3 rounded-lg text-[11px] text-slate-500 hover:bg-slate-200 uppercase font-bold text-center border border-dashed border-slate-300">+ Add Category</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
