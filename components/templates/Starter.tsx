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
    editorState: any;
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
        <div className="mb-2">
            <div className="flex justify-between items-baseline mb-1">
                <div className="font-bold text-slate-800">
                    <InlineInput value={item.role} onChange={(v) => update(item.id, 'role', v)} placeholder="Role / Job Title" className="font-bold" isPreview={isPreview} />
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
                    <div className="text-sm text-slate-500">
                        {item.startMonth} {item.startYear} - {item.current ? "Present" : `${item.endMonth} ${item.endYear}`}
                    </div>
                )}
            </div>
            <div className="text-sm text-slate-600 mb-2">
                <InlineInput value={item.company} onChange={(v) => update(item.id, 'company', v)} placeholder="Company" isPreview={isPreview} />
            </div>
            <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-sm text-slate-600 leading-relaxed" placeholder="Description..." multiline isPreview={isPreview} />
        </div>
    </SortableItemWrapper>
);

const EducationRow = ({ item, update, remove, isPreview }: any) => (
    <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
        <div className="mb-2">
            <div className="flex justify-between items-baseline mb-1">
                <div className="font-bold text-slate-800">
                    <InlineInput value={item.school} onChange={(v) => update(item.id, 'school', v)} placeholder="School" className="font-bold" isPreview={isPreview} />
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
                    <div className="text-sm text-slate-500">
                        {item.startMonth} {item.startYear} - {item.current ? "Present" : `${item.endMonth} ${item.endYear}`}
                    </div>
                )}
            </div>
            <div className="text-sm text-slate-600">
                <InlineInput value={item.degree} onChange={(v) => update(item.id, 'degree', v)} placeholder="Degree" isPreview={isPreview} />
            </div>
        </div>
    </SortableItemWrapper>
);


export default function Starter({ editorState }: StarterProps) {
    const { data, isPreview, handleDragEnd, updateItem, addItem, removeItem, updateRoot, updateSectionTitle } = editorState;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    return (
        <div id="resume-preview" className="font-sans text-slate-800 max-w-[210mm] mx-auto min-h-[297mm]">
            {/* Header (Minimal: Centered) */}
            <div className="text-center mb-10 border-b pb-6 border-slate-200">
                <InlineInput value={data.name} onChange={(v) => updateRoot('name', v)} className="text-4xl font-light tracking-wide text-slate-900 text-center mb-2" placeholder="Your Name" isPreview={isPreview} />
                <InlineInput value={data.title} onChange={(v) => updateRoot('title', v)} className="text-lg text-slate-500 uppercase tracking-widest text-center mb-4" placeholder="Role / Title" isPreview={isPreview} />

                <div className="flex justify-center flex-wrap gap-4 text-sm text-slate-400">
                    <ContactItem icon="✉" value={data.email} onChange={(v: string) => updateRoot('email', v)} placeholder="Email" isPreview={isPreview} />
                    <ContactItem icon="phone" value={data.phone} onChange={(v: string) => updateRoot('phone', v)} placeholder="Phone" isPreview={isPreview} />
                    <ContactItem icon="map" value={data.location} onChange={(v: string) => updateRoot('location', v)} placeholder="Location" isPreview={isPreview} />
                    <ContactItem icon="🌐" value={data.website} onChange={(v: string) => updateRoot('website', v)} placeholder="Website" isPreview={isPreview} />
                </div>
            </div>

            {/* Summary */}
            {(data.summary || !isPreview) && (
                <div className="mb-8">
                    <SectionHeader title={data.sectionTitles.summary} onChange={(v) => updateSectionTitle('summary', v)} isPreview={isPreview} className="border-none mb-2 text-slate-900" />
                    <InlineInput value={data.summary} onChange={(v) => updateRoot('summary', v)} multiline className="text-slate-600 leading-relaxed" placeholder="Professional summary..." isPreview={isPreview} />
                </div>
            )}

            {/* Experience */}
            {(data.experience?.length > 0 || !isPreview) && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                        <SectionHeader title={data.sectionTitles.experience} onChange={(v) => updateSectionTitle('experience', v)} isPreview={isPreview} className="border-none mb-0 pb-0 text-slate-900" />
                        {!isPreview && (
                            <button onClick={() => addItem('experience', { role: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
                        )}
                    </div>
                    <DndContext id="starter-dnd-experience" sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'experience')}>
                        <SortableContext items={data.experience} strategy={verticalListSortingStrategy}>
                            <div>
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
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                        <SectionHeader title={data.sectionTitles.education} onChange={(v) => updateSectionTitle('education', v)} isPreview={isPreview} className="border-none mb-0 pb-0 text-slate-900" />
                        {!isPreview && (
                            <button onClick={() => addItem('education', { school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
                        )}
                    </div>
                    <DndContext id="starter-dnd-education" sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'education')}>
                        <SortableContext items={data.education} strategy={verticalListSortingStrategy}>
                            <div>
                                {data.education.map((item: any) => (
                                    <EducationRow key={item.id} item={item} update={(id: string, f: any, v: any) => updateItem('education', id, f, v)} remove={(id: string) => removeItem('education', id)} isPreview={isPreview} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}

            {/* Skills (Simple Text Area for Minimal) */}
            {(data.skills?.length > 0 || !isPreview) && (
                <div className="mb-8">
                    <SectionHeader title={data.sectionTitles.skills} onChange={(v) => updateSectionTitle('skills', v)} isPreview={isPreview} className="border-none mb-2 pb-2 border-b border-slate-200 text-slate-900" />
                    {!isPreview && <p className="text-xs text-slate-400 mb-2">Hack for Starter: Use 'Skills' input as a free-form list.</p>}
                    {/* Since Starter is minimal, let's just use the first skill category as a big list, or just a custom implementation. 
             But to keep it compatible with data schema, we should probably iterate categories. 
             Let's just show categories simply. */}
                    <div className="flex flex-wrap gap-4">
                        {data.skills.map((cat: any) => (
                            <div key={cat.id} className="bg-slate-50 p-2 rounded">
                                <InlineInput value={cat.name} onChange={(v) => updateItem('skills', cat.id, 'name', v)} className="font-bold text-sm mb-1" placeholder="Category" isPreview={isPreview} />
                                <InlineInput value={cat.skills} onChange={(v) => updateItem('skills', cat.id, 'skills', v)} className="text-sm text-slate-600" placeholder="List skills..." multiline isPreview={isPreview} />
                                {!isPreview && <button onClick={() => removeItem('skills', cat.id)} className="text-xs text-red-500 mt-1">Remove</button>}
                            </div>
                        ))}
                        {!isPreview && <button onClick={() => addItem('skills', { name: '', skills: '' })} className="bg-slate-100 p-2 rounded text-xs text-slate-500 hover:bg-slate-200">+ Category</button>}
                    </div>
                </div>
            )}

        </div>
    );
}
