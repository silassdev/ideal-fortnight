'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { getAllPredefinedSkills, PREDEFINED_SKILLS } from '@/types/resume';

interface SkillsEditorProps {
    skills: string[];
    onChange: (skills: string[]) => void;
    className?: string;
}

export default function SkillsEditor({ skills = [], onChange, className = '' }: SkillsEditorProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [customSkill, setCustomSkill] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const allSkills = getAllPredefinedSkills();
    const filteredSkills = allSkills.filter(
        skill =>
            skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !skills.includes(skill)
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addSkill = (skill: string) => {
        if (skill && !skills.includes(skill)) {
            onChange([...skills, skill]);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        onChange(skills.filter(s => s !== skillToRemove));
    };

    const handleAddCustomSkill = () => {
        if (customSkill.trim()) {
            addSkill(customSkill.trim());
            setCustomSkill('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCustomSkill();
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                    <div className="text-sm text-slate-400 italic">No skills added yet. Click + to add skills.</div>
                ) : (
                    skills.map((skill, index) => (
                        <div
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium"
                        >
                            <span>{skill}</span>
                            <button
                                onClick={() => removeSkill(skill)}
                                className="hover:bg-sky-200 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${skill}`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Skills */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                >
                    <Plus className="w-4 h-4" />
                    Add Skill
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                    <div className="absolute z-10 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
                        {/* Search/Custom Input */}
                        <div className="p-3 border-b border-slate-200 space-y-2">
                            <input
                                type="text"
                                placeholder="Search or type custom skill..."
                                value={customSkill || searchTerm}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomSkill(val);
                                    setSearchTerm(val);
                                }}
                                onKeyPress={handleKeyPress}
                                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                autoFocus
                            />
                            {customSkill && (
                                <button
                                    onClick={handleAddCustomSkill}
                                    className="w-full px-3 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors text-sm font-medium"
                                >
                                    Add "{customSkill}"
                                </button>
                            )}
                        </div>

                        {/* Predefined Skills Categories */}
                        <div className="max-h-64 overflow-y-auto">
                            {searchTerm === '' ? (
                                // Show categorized skills
                                Object.entries(PREDEFINED_SKILLS).map(([category, categorySkills]) => {
                                    const availableSkills = categorySkills.filter(s => !skills.includes(s));
                                    if (availableSkills.length === 0) return null;

                                    return (
                                        <div key={category} className="p-3 border-b border-slate-100 last:border-b-0">
                                            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                                {category}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {availableSkills.map(skill => (
                                                    <button
                                                        key={skill}
                                                        onClick={() => {
                                                            addSkill(skill);
                                                            setSearchTerm('');
                                                            setCustomSkill('');
                                                        }}
                                                        className="px-2 py-1 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 rounded text-xs transition-colors"
                                                    >
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                // Show filtered results
                                <div className="p-3">
                                    {filteredSkills.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {filteredSkills.map(skill => (
                                                <button
                                                    key={skill}
                                                    onClick={() => {
                                                        addSkill(skill);
                                                        setSearchTerm('');
                                                        setCustomSkill('');
                                                    }}
                                                    className="px-2 py-1 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 rounded text-xs transition-colors"
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-slate-500 text-center">
                                            No matching skills found. Press Enter to add "{searchTerm}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
