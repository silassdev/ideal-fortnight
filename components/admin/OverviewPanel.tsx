'use client';
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

type Totals = { totalUsers: number; totalTemplates: number; totalDownloads: number };
type CountryDatum = { country: string | null; count: number };
type DailyDatum = { day: string; count: number };

export default function OverviewPanel() {
    const [loading, setLoading] = useState(true);
    const [daily, setDaily] = useState<DailyDatum[]>([]);
    const [countries, setCountries] = useState<CountryDatum[]>([]);
    const [totals, setTotals] = useState<Totals>({ totalUsers: 0, totalTemplates: 0, totalDownloads: 0 });

    useEffect(() => {
        let mounted = true;
        fetch('/api/admin/analytics')
            .then((r) => r.json())
            .then((json) => {
                if (!mounted) return;
                if (json.error) throw new Error(json.error);
                setDaily(json.newUsersDaily || []);
                setCountries((json.usersByCountry || []).map((d: any) => ({ country: d.country || 'Unknown', count: d.count })));
                setTotals(json.totals || { totalUsers: 0, totalTemplates: 0, totalDownloads: 0 });
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.error('overview fetch', e);
            })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-slate-200 animate-pulse rounded w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded shadow animate-pulse h-40" />
                    <div className="p-4 bg-white rounded shadow animate-pulse h-40" />
                    <div className="p-4 bg-white rounded shadow animate-pulse h-40" />
                </div>
            </div>
        );
    }

    const COLORS = ['#0ea5e9', '#06b6d4', '#06d6a0', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm text-slate-500">Total users</div>
                    <div className="text-2xl font-bold mt-2">{totals.totalUsers}</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm text-slate-500">Templates</div>
                    <div className="text-2xl font-bold mt-2">{totals.totalTemplates}</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm text-slate-500">Downloads</div>
                    <div className="text-2xl font-bold mt-2">{totals.totalDownloads}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm font-medium mb-3">New users (last 14 days)</div>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <LineChart data={daily}>
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm font-medium mb-3">Users by country</div>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={countries}
                                    dataKey="count"
                                    nameKey="country"
                                    outerRadius={90}
                                    fill="#8884d8"
                                    label={(entry: any) => entry.country || entry.payload?.country}
                                >
                                    {countries.map((c, i) => <Cell key={c.country || i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
