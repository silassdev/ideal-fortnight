'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';

type SuggestionState = {
    role: string;
    workType: string;
    level: string;
};

const ROLES = [
    'Software Engineer', 'Product Manager', 'Product Designer', 'UX/UI Designer',
    'Data Scientist', 'Marketing Manager', 'Sales Representative', 'Project Manager',
    'Customer Success', 'Student / Intern', 'Other'
];

const WORK_TYPES = [
    'Full-time', 'Part-time', 'Contract / Freelance', 'Internship'
];

const LEVELS = [
    'Entry Level / Junior', 'Mid-Level', 'Senior', 'Lead / Staff', 'Manager / Executive'
];

export default function SuggestResumeFlow({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<SuggestionState>({ role: '', workType: '', level: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // For "Other" role
    const [customRole, setCustomRole] = useState('');

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const finalRole = data.role === 'Other' ? customRole : data.role;
            const details = {
                title: finalRole,
                summary: `${data.level} ${finalRole} looking for ${data.workType} opportunities.`,
            };

            const res = await fetch('/api/ai/suggest-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ details }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to suggest');

            if (json.suggestion) {
                setResult(json.suggestion);
                setStep(4);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to get suggestion. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptObj = () => {
        if (result?.templateKey) {
            router.push(`/dashboard/template/${result.templateKey}`);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">AI Resume Assistant</h2>
                        <p className="text-xs text-slate-500">Step {step} of 3</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">What is your target role?</label>

                            <select
                                value={data.role}
                                onChange={(e) => setData({ ...data, role: e.target.value })}
                                className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                            >
                                <option value="" disabled>Select a role...</option>
                                {ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>

                            {data.role === 'Other' && (
                                <Input
                                    value={customRole}
                                    onChange={(e) => setCustomRole(e.target.value)}
                                    placeholder="Enter your exact job title..."
                                    className="w-full"
                                />
                            )}

                            <p className="text-xs text-slate-500">Select the role you are applying for.</p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">What is your work situation?</label>
                            <select
                                value={data.workType}
                                onChange={(e) => setData({ ...data, workType: e.target.value })}
                                className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <option value="" disabled>Select work type...</option>
                                {WORK_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">What is your experience level?</label>
                            <select
                                value={data.level}
                                onChange={(e) => setData({ ...data, level: e.target.value })}
                                className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <option value="" disabled>Select experience level...</option>
                                {LEVELS.map(lvl => (
                                    <option key={lvl} value={lvl}>{lvl}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {step === 4 && result && (
                        <div className="space-y-6 text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">We recommend: {result.templateKey}</h3>
                                <p className="text-sm text-slate-600 mt-2 italic">"{result.reason}"</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleAcceptObj}
                                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                >
                                    Use {result.templateKey} Template
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-sm text-slate-500 hover:text-slate-700"
                                >
                                    Or browse all templates
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step < 4 && (
                    <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        <button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && (!data.role || (data.role === 'Other' && !customRole))) ||
                                (step === 2 && !data.workType) ||
                                (step === 3 && !data.level) ||
                                loading
                            }
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {step === 3 ? (loading ? 'Analyzing...' : 'Get Suggestion') : 'Next'}
                            {!loading && step < 3 && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
