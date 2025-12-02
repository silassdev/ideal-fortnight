'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Experience, MONTHS } from '@/types/resume';
import BulletListEditor from './BulletListEditor';
import Input from '@/components/ui/Input';

interface ExperienceEditorProps {
    experiences: Experience[];
    onChange: (experiences: Experience[]) => void;
    className?: string;
}

export default function ExperienceEditor({ experiences = [], onChange, className = '' }: ExperienceEditorProps) {
    const addExperience = () => {
        const newExp: Experience = {
            id: Date.now().toString(),
            company: '',
            role: '',
            location: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            current: false,
            bullets: []
        };
        onChange([...experiences, newExp]);
    };

    const updateExperience = (index: number, field: keyof Experience, value: any) => {
        const updated = [...experiences];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeExperience = (index: number) => {
        onChange(experiences.filter((_, i) => i !== index));
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

    return (
        <div className={`space-y-6 ${className}`}>
            {experiences.length === 0 ? (
                <div className="text-sm text-slate-400 italic">No experience added yet. Click + to add.</div>
            ) : (
                experiences.map((exp, index) => (
                    <div key={exp.id} className="p-4 border border-slate-200 rounded-lg space-y-3 bg-white">
                        <div className="flex items-start justify-between">
                            <h4 className="font-medium text-slate-900">Experience #{index + 1}</h4>
                            <button
                                onClick={() => removeExperience(index)}
                                className="p-1.5 hover:bg-red-100 rounded transition-colors"
                                aria-label="Remove experience"
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                                label="Role/Title"
                                value={exp.role || ''}
                                onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                placeholder="e.g., Senior Software Engineer"
                            />
                            <Input
                                label="Company"
                                value={exp.company || ''}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                placeholder="e.g., Google"
                            />
                        </div>

                        <Input
                            label="Location"
                            value={exp.location || ''}
                            onChange={(e) => updateExperience(index, 'location', e.target.value)}
                            placeholder="e.g., San Francisco, CA"
                        />

                        {/* Date Range */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Duration</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <select
                                    value={exp.startMonth || ''}
                                    onChange={(e) => updateExperience(index, 'startMonth', e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                >
                                    <option value="">Month</option>
                                    {MONTHS.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={exp.startYear || ''}
                                    onChange={(e) => updateExperience(index, 'startYear', e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                >
                                    <option value="">Year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <select
                                    value={exp.endMonth || ''}
                                    onChange={(e) => updateExperience(index, 'endMonth', e.target.value)}
                                    disabled={exp.current}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm disabled:bg-slate-100"
                                >
                                    <option value="">Month</option>
                                    {MONTHS.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={exp.endYear || ''}
                                    onChange={(e) => updateExperience(index, 'endYear', e.target.value)}
                                    disabled={exp.current}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm disabled:bg-slate-100"
                                >
                                    <option value="">Year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={exp.current || false}
                                    onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span className="text-slate-700">I currently work here</span>
                            </label>
                        </div>

                        {/* Responsibilities */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Responsibilities & Achievements
                            </label>
                            <BulletListEditor
                                bullets={exp.bullets || []}
                                onChange={(bullets) => updateExperience(index, 'bullets', bullets)}
                                placeholder="Describe your responsibilities and achievements..."
                            />
                        </div>
                    </div>
                ))
            )}

            <button
                onClick={addExperience}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium"
            >
                <Plus className="w-4 h-4" />
                Add Experience
            </button>
        </div>
    );
}
