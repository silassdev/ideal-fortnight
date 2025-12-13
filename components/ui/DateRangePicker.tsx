import React, { useMemo } from 'react';
import { MONTHS } from '@/types/resume';

interface DateRangePickerProps {
    startMonth?: string;
    startYear?: string;
    endMonth?: string;
    endYear?: string;
    current?: boolean;
    onChange: (data: { startMonth?: string; startYear?: string; endMonth?: string; endYear?: string; current?: boolean }) => void;
    className?: string;
}

export const DateRangePicker = ({
    startMonth,
    startYear,
    endMonth,
    endYear,
    current,
    onChange,
    className = ""
}: DateRangePickerProps) => {

    // Generate years (last 50 years + next 5 years)
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const y = [];
        for (let i = currentYear + 5; i >= currentYear - 50; i--) {
            y.push(i.toString());
        }
        return y;
    }, []);

    const handleChange = (field: string, value: any) => {
        onChange({
            startMonth,
            startYear,
            endMonth,
            endYear,
            current,
            [field]: value
        });
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex items-center gap-2 flex-wrap">
                {/* Start Date */}
                <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-1 bg-white hover:border-slate-300 transition-colors">
                    <select
                        value={startMonth || ''}
                        onChange={(e) => handleChange('startMonth', e.target.value)}
                        className="bg-transparent text-sm outline-none cursor-pointer text-slate-700 w-24"
                    >
                        <option value="">Month</option>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <span className="text-slate-300">/</span>
                    <select
                        value={startYear || ''}
                        onChange={(e) => handleChange('startYear', e.target.value)}
                        className="bg-transparent text-sm outline-none cursor-pointer text-slate-700 w-16"
                    >
                        <option value="">Year</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                <span className="text-slate-400 text-sm">–</span>

                {/* End Date - conditional on 'current' */}
                {current ? (
                    <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded border border-emerald-100">
                        Present
                    </div>
                ) : (
                    <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-1 bg-white hover:border-slate-300 transition-colors">
                        <select
                            value={endMonth || ''}
                            onChange={(e) => handleChange('endMonth', e.target.value)}
                            className="bg-transparent text-sm outline-none cursor-pointer text-slate-700 w-24"
                        >
                            <option value="">Month</option>
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <span className="text-slate-300">/</span>
                        <select
                            value={endYear || ''}
                            onChange={(e) => handleChange('endYear', e.target.value)}
                            className="bg-transparent text-sm outline-none cursor-pointer text-slate-700 w-16"
                        >
                            <option value="">Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                )}
            </div>

            {/* Current Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer w-fit select-none">
                <input
                    type="checkbox"
                    checked={current || false}
                    onChange={(e) => handleChange('current', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="text-xs text-slate-500 font-medium">I currently work here</span>
            </label>
        </div>
    );
};
