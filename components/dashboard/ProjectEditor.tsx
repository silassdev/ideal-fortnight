'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Project, MONTHS } from '@/types/resume';
import Input from '@/components/ui/Input';

interface ProjectEditorProps {
    projects: Project[];
    onChange: (projects: Project[]) => void;
    className?: string;
}

export default function ProjectEditor({ projects = [], onChange, className = '' }: ProjectEditorProps) {
    const addProject = () => {
        const newProj: Project = {
            id: Date.now().toString(),
            title: '',
            description: '',
            link: '',
            tech: [],
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: ''
        };
        onChange([...projects, newProj]);
    };

    const updateProject = (index: number, field: keyof Project, value: any) => {
        const updated = [...projects];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeProject = (index: number) => {
        onChange(projects.filter((_, i) => i !== index));
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

    return (
        <div className={`space-y-4 ${className}`}>
            {projects.length === 0 ? (
                <div className="text-sm text-slate-400 italic">No projects added yet. Click + to add.</div>
            ) : (
                projects.map((proj, index) => (
                    <div key={proj.id} className="p-4 border border-slate-200 rounded-lg space-y-3 bg-white">
                        <div className="flex items-start justify-between">
                            <h4 className="font-medium text-slate-900">Project #{index + 1}</h4>
                            <button
                                onClick={() => removeProject(index)}
                                className="p-1.5 hover:bg-red-100 rounded transition-colors"
                                aria-label="Remove project"
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        </div>

                        <Input
                            label="Project Title"
                            value={proj.title || ''}
                            onChange={(e) => updateProject(index, 'title', e.target.value)}
                            placeholder="e.g., E-Commerce Platform"
                        />

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                value={proj.description || ''}
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                placeholder="Briefly describe the project..."
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
                            />
                        </div>

                        <Input
                            label="Link (optional)"
                            value={proj.link || ''}
                            onChange={(e) => updateProject(index, 'link', e.target.value)}
                            placeholder="https://github.com/username/project"
                        />

                        {/* Date Range (Optional) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Duration (optional)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <select
                                    value={proj.startMonth || ''}
                                    onChange={(e) => updateProject(index, 'startMonth', e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                >
                                    <option value="">Month</option>
                                    {MONTHS.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={proj.startYear || ''}
                                    onChange={(e) => updateProject(index, 'startYear', e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                >
                                    <option value="">Year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <select
                                    value={proj.endMonth || ''}
                                    onChange={(e) => updateProject(index, 'endMonth', e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                >
                                    <option value="">Month</option>
                                    {MONTHS.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={proj.endYear || ''}
                                    onChange={(e) => updateProject(index, 'endYear', e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                >
                                    <option value="">Year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))
            )}

            <button
                onClick={addProject}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium"
            >
                <Plus className="w-4 h-4" />
                Add Project
            </button>
        </div>
    );
}
