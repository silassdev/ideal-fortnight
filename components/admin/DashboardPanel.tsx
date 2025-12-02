// components/admin/DownloadsPanel.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

export default function DownloadsPanel() {
    const [loading, setLoading] = useState(true);
    const [perDay, setPerDay] = useState<any[]>([]);
    const [perYear, setPerYear] = useState<any[]>([]);
    const [byCountry, setByCountry] = useState<any[]>([]);

    useEffect(() => {
        let mounted = true;
        fetch('/api/admin/downloads/stats')
            .then((r) => r.json())
            .then((json) => {
                if (!mounted) return;
                if (json.error) throw new Error(json.error);
                setPerDay(json.perDay || []);
                setPerYear(json.perYear || []);
                setByCountry(json.byCountry || []);
            })
            .catch((e) => { console.error(e); })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    if (loading) return <div className="p-4 bg-white rounded shadow animate-pulse h-56" />;

    const COLORS = ['#0ea5e9', '#06b6d4', '#06d6a0', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
                <div className="text-sm font-medium mb-3">Downloads per day (recent)</div>
                <div style={{ height: 260 }}>
                    <ResponsiveContainer>
                        <BarChart data={perDay}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0ea5e9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm font-medium mb-3">Downloads by year</div>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={perYear}>
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#06b6d4" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm font-medium mb-3">Downloads by country</div>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={byCountry} dataKey="count" nameKey="country" outerRadius={80} label>
                                    {byCountry.map((d, i) => <Cell key={d.country || i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
