'use client';

import React from 'react';
import { X, Plus } from 'lucide-react';

type Props = {
    certifications: string[];
    onChange: (certifications: string[]) => void;
};

export default function CertificationsEditor({ certifications, onChange }: Props) {
    const addCertification = () => {
        onChange([...certifications, '']);
    };

    const removeCertification = (index: number) => {
        onChange(certifications.filter((_, i) => i !== index));
    };

    const updateCertification = (index: number, value: string) => {
        const updated = [...certifications];
        updated[index] = value;
        onChange(updated);
    };

    return (
        <div className="space-y-2">
            {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={cert}
                        onChange={(e) => updateCertification(index, e.target.value)}
                        placeholder="Certification name"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <button
                        onClick={() => removeCertification(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove certification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}

            <button
                onClick={addCertification}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors w-full"
            >
                <Plus className="w-4 h-4" />
                Add Certification
            </button>

            {certifications.length === 0 && (
                <p className="text-xs text-slate-500 italic">No certifications added yet. Click "Add Certification" to start.</p>
            )}
        </div>
    );
}
