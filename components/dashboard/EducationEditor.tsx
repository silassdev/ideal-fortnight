'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Education, MONTHS } from '@/types/resume';
import Input from '@/components/ui/Input';

interface EducationEditorProps {
    education: Education[];
    onChange: (education: Education[]) => void;
    className?: string;
}

export default function EducationEditor({ education = [], onChange, className = '' }: EducationEditorProps) {
    const addEducation = () => {
        const newEd: Education = {
            id: Date.now().toString(),
            school: '',
            degree: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            current: false,
            notes: ''
        };
        onChange([...education, newEd]);
    };

    const updateEducation = (index: number, field: keyof Education, value: any) => {
        const updated = [...education];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeEducation = (index: number) => {
        onChange(education.filter((_, i) => i !== index));
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

    return (
        <div className={`space-y-4 ${className}`}>
            {education.length === 0 ? (
                <div className="text-sm text-slate-400 italic">No education added yet. Click + to add.</div>
            ) : (
                education.map((ed, index) => (
                    <div key={ed.id} className="p-4 border border-slate-200 rounded-lg space-y-3 bg-white">
                        <div className="flex items-start justify-between">
                            <h4 className="font-medium text-slate-900">Education #{index + 1}</h4>
                            <button
                                onClick={() => removeEducation(index)}
                                className="p-1.5 hover:bg-red-100 rounded transition-colors"
                                aria-label="Remove education"
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                                label="School/University"
                                value={ed.school || ''}
                                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                placeholder="e.g., Stanford University"
                            />
                            <Input
                                label="Degree"
                                value={ed.degree || ''}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                placeholder="e.g., B.S. Computer Science"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Duration</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <select
                                    value={ed.startMonth || ''}
                                    onChange={(e) => updateEducation(index, 'startMonth', e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                >
                                    <option value="">Month</option>
                                    {MONTHS.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={ed.startYear || ''}
                                    onChange={(e) => updateEducation(index, 'startYear', e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                >
                                    <option value="">Year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <select
                                    value={ed.endMonth || ''}
                                    onChange={(e) => updateEducation(index, 'endMonth', e.target.value)}
                                    disabled={ed.current}
                                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm disabled:bg-slate-100"
                                >
                                    <option value="">Month</option>
                                    {MONTHS.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={ed.endYear || ''}
                                    onChange={(e) => updateEducation(index, 'endYear', e.target.value)}
                                    disabled={ed.current}
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
                                    checked={ed.current || false}
                                    onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span className="text-slate-700">Currently enrolled</span>
                            </label>
                        </div>
                    </div>
                ))
            )}

            <button
                onClick={addEducation}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium"
            >
                <Plus className="w-4 h-4" />
                Add Education
            </button>
        </div>
    );
}
