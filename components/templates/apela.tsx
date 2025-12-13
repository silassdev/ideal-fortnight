import React from 'react';
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
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TemplateComponentProps } from '@/types/template'; // Still useful for types, but we rely on editorState
import {
    InlineInput,
    ContactItem,
    SortableItemWrapper,
    SectionHeader
} from '../editor/SharedComponents';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

export const metadata = {
    key: 'apela',
    title: 'Apela',
    description: 'Two-column profile with bold header and modern accent',
    author: 'Apela Dev',
    authorUrl: 'https://github.com/apela-x',
    thumbnail: '/templates/apela.png',
    tags: ['two-column', 'modern', 'accent'],
};

// --- Row Components for Apela Styling ---

const ApelaExperienceRow = ({ item, update, remove, isPreview }: any) => (
    <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
        <div className="mb-4">
            <div className="flex justify-between items-baseline">
                <div className="font-bold text-slate-800 text-md">
                    <InlineInput value={item.role} onChange={(v) => update(item.id, 'role', v)} placeholder="Role" className="font-bold" isPreview={isPreview} />
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
                    <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        {item.startMonth} {item.startYear} - {item.current ? "Present" : `${item.endMonth} ${item.endYear}`}
                    </div>
                )}
            </div>
            <div className="text-sm text-slate-600 font-medium mb-1 flex items-center gap-1">
                <InlineInput value={item.company} onChange={(v) => update(item.id, 'company', v)} placeholder="Company" isPreview={isPreview} />
                {item.location && <span>•</span>}
                <InlineInput value={item.location} onChange={(v) => update(item.id, 'location', v)} placeholder="Location" isPreview={isPreview} />
            </div>
            <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-sm text-slate-700 leading-relaxed" placeholder="Description/Bullets..." multiline isPreview={isPreview} />
        </div>
    </SortableItemWrapper>
);

const ApelaProjectRow = ({ item, update, remove, isPreview }: any) => (
    <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
        <div className="mb-4">
            <div className="flex justify-between items-baseline">
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <InlineInput value={item.title || item.name} onChange={(v) => update(item.id, 'title', v)} placeholder="Project Title" className="font-bold" isPreview={isPreview} />
                    {/* Link logic */}
                    <InlineInput value={item.link} onChange={(v) => update(item.id, 'link', v)} placeholder="Link" className="text-xs text-sky-600 font-normal" isPreview={isPreview} />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                    {/* Simplified date for projects if needed, or just remove if not in schema for proj */}
                </div>
            </div>
            <InlineInput value={item.description} onChange={(v) => update(item.id, 'description', v)} className="text-sm text-slate-700 leading-relaxed" placeholder="Description..." multiline isPreview={isPreview} />
        </div>
    </SortableItemWrapper>
);

const ApelaEducationRow = ({ item, update, remove, isPreview }: any) => (
    <SortableItemWrapper id={item.id} onDelete={() => remove(item.id)} isPreview={isPreview}>
        <div className="mb-4 text-sm">
            <div className="font-bold text-slate-800">
                <InlineInput value={item.school} onChange={(v) => update(item.id, 'school', v)} placeholder="School" className="font-bold" isPreview={isPreview} />
            </div>
            <div className="text-slate-600">
                <InlineInput value={item.degree} onChange={(v) => update(item.id, 'degree', v)} placeholder="Degree" isPreview={isPreview} />
            </div>
            {!isPreview ? (
                <div className="mt-1">
                    <DateRangePicker
                        startMonth={item.startMonth}
                        startYear={item.startYear}
                        endMonth={item.endMonth}
                        endYear={item.endYear}
                        current={item.current}
                        onChange={(d) => update(item.id, d, undefined)}
                        className="scale-90 origin-left transform"
                    />
                </div>
            ) : (
                <div className="text-xs text-slate-500 mt-0.5">
                    {item.startMonth} {item.startYear} - {item.current ? "Present" : `${item.endMonth} ${item.endYear}`}
                </div>
            )}
        </div>
    </SortableItemWrapper>
);


// --- Main Component ---

export default function ApelaTemplate({ resume, editorState, className = '' }: TemplateComponentProps & { editorState?: any }) {
    // Legacy Bridge: If editorState not provided (e.g. strict preview mode without editor), use 'resume' prop.
    // However, for the dashboard editor, editorState is key.

    // We favor editorState.data if available, else resume.
    const data = editorState?.data || resume;
    const isPreview = editorState?.isPreview || false;

    // Handlers
    const updateRoot = editorState?.updateRoot || (() => { });
    const updateItem = editorState?.updateItem || (() => { });
    const addItem = editorState?.addItem || (() => { });
    const removeItem = editorState?.removeItem || (() => { });
    const handleDragEnd = editorState?.handleDragEnd || (() => { });
    const updateSectionTitle = editorState?.updateSectionTitle || (() => { });

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    return (
        <div className={`max-w-[800px] bg-white p-6 text-slate-900 min-h-[1100px] ${className}`} id="resume-preview">

            {/* Header */}
            <header className="flex items-center gap-4 pb-4 border-b border-slate-200">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
                    {data.name ? data.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'UN'}
                </div>
                <div className="flex-grow">
                    <InlineInput value={data.name} onChange={(v) => updateRoot('name', v)} className="text-2xl font-extrabold text-slate-900" placeholder="Full Name" isPreview={isPreview} />
                    <InlineInput value={data.title} onChange={(v) => updateRoot('title', v)} className="text-sm text-slate-600" placeholder="Professional Title" isPreview={isPreview} />
                </div>
                <div className="text-right text-sm text-slate-500 space-y-1">
                    <InlineInput value={data.email} onChange={(v) => updateRoot('email', v)} placeholder="Email" className="text-right w-full" isPreview={isPreview} />
                    <InlineInput value={data.phone} onChange={(v) => updateRoot('phone', v)} placeholder="Phone" className="text-right w-full" isPreview={isPreview} />
                    <InlineInput value={data.location} onChange={(v) => updateRoot('location', v)} placeholder="Location" className="text-right w-full" isPreview={isPreview} />
                </div>
            </header>

            <section className="grid grid-cols-3 gap-8 mt-8">
                {/* Left Column (Main) */}
                <div className="col-span-2 space-y-8">

                    {/* Summary */}
                    <div>
                        <SectionHeader title={data.sectionTitles?.summary || "Summary"} onChange={(v) => updateSectionTitle('summary', v)} isPreview={isPreview} className="border-none mb-2 text-slate-400 text-sm font-bold uppercase tracking-wider" />
                        <InlineInput value={data.summary} onChange={(v) => updateRoot('summary', v)} multiline className="text-sm text-slate-700 leading-relaxed" placeholder="Professional summary..." isPreview={isPreview} />
                    </div>

                    {/* Experience */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <SectionHeader title={data.sectionTitles?.experience || "Experience"} onChange={(v) => updateSectionTitle('experience', v)} isPreview={isPreview} className="border-none mb-0 pb-0 text-slate-400 text-sm font-bold uppercase tracking-wider" />
                            {!isPreview && (
                                <button onClick={() => addItem('experience', { role: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
                            )}
                        </div>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'experience')}>
                            <SortableContext items={data.experience || []} strategy={verticalListSortingStrategy}>
                                <div>
                                    {(data.experience || []).map((item: any) => (
                                        <ApelaExperienceRow key={item.id} item={item} update={(id: string, f: any, v: any) => updateItem('experience', id, f, v)} remove={(id: string) => removeItem('experience', id)} isPreview={isPreview} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Projects */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <SectionHeader title={data.sectionTitles?.projects || "Projects"} onChange={(v) => updateSectionTitle('projects', v)} isPreview={isPreview} className="border-none mb-0 pb-0 text-slate-400 text-sm font-bold uppercase tracking-wider" />
                            {!isPreview && (
                                <button onClick={() => addItem('projects', { title: '', link: '', description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
                            )}
                        </div>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'projects')}>
                            <SortableContext items={data.projects || []} strategy={verticalListSortingStrategy}>
                                <div>
                                    {(data.projects || []).map((item: any) => (
                                        <ApelaProjectRow key={item.id} item={item} update={(id: string, f: any, v: any) => updateItem('projects', id, f, v)} remove={(id: string) => removeItem('projects', id)} isPreview={isPreview} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <aside className="col-span-1 space-y-8">

                    {/* Education */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <SectionHeader title={data.sectionTitles?.education || "Education"} onChange={(v) => updateSectionTitle('education', v)} isPreview={isPreview} className="border-none mb-0 pb-0 text-slate-400 text-sm font-bold uppercase tracking-wider" />
                            {!isPreview && (
                                <button onClick={() => addItem('education', { school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', current: false, description: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">+ Add</button>
                            )}
                        </div>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'education')}>
                            <SortableContext items={data.education || []} strategy={verticalListSortingStrategy}>
                                <div>
                                    {(data.education || []).map((item: any) => (
                                        <ApelaEducationRow key={item.id} item={item} update={(id: string, f: any, v: any) => updateItem('education', id, f, v)} remove={(id: string) => removeItem('education', id)} isPreview={isPreview} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Skills */}
                    <div>
                        <SectionHeader title={data.sectionTitles?.skills || "Skills"} onChange={(v) => updateSectionTitle('skills', v)} isPreview={isPreview} className="border-none mb-3 text-slate-400 text-sm font-bold uppercase tracking-wider" />

                        {/* Apela style skills: Freeform list tags? Or Structured?
                             Original Apela iterate strings.
                             Global data schema uses complex objects.
                             We need to adapt.
                             If data.skills is array of strings (Legacy): map them.
                             If data.skills is array of objects {id, name, skills} (New): map them.
                         */}
                        <div className="flex flex-wrap gap-2">
                            {(data.skills || []).map((cat: any, i: number) => {
                                // Handle both string (Legacy Apela) and Object (New Schema)
                                if (typeof cat === 'string') {
                                    // Legacy string
                                    return <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded font-medium">{cat}</span>
                                }
                                // New Object Schema
                                return (
                                    <div key={cat.id} className="w-full mb-2">
                                        <InlineInput value={cat.name} onChange={(v) => updateItem('skills', cat.id, 'name', v)} className="font-bold text-xs text-slate-800 mb-1" placeholder="Category" isPreview={isPreview} />
                                        <InlineInput value={cat.skills} onChange={(v) => updateItem('skills', cat.id, 'skills', v)} className="text-xs text-slate-600" placeholder="Skills..." multiline isPreview={isPreview} />
                                        {!isPreview && <button onClick={() => removeItem('skills', cat.id)} className="text-[10px] text-red-500">Remove</button>}
                                    </div>
                                );
                            })}
                        </div>
                        {!isPreview && (
                            <button onClick={() => addItem('skills', { name: '', skills: '' })} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-2">+ Category</button>
                        )}
                    </div>

                </aside>
            </section>

            <footer className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
                <div>Generated with Apela template</div>
                <div>
                    {metadata.author && metadata.authorUrl ? (
                        <a href={metadata.authorUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">
                            {metadata.author}
                        </a>
                    ) : metadata.author}
                </div>
            </footer>
        </div>
    );
}
