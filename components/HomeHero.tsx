'use client';

import { useState } from 'react';
import ResumeDrawing from '@/components/ResumeDrawing';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function HomeHero() {
    const { data: session } = useSession();
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [template, setTemplate] = useState<'modern' | 'classic'>('modern');
    const [accent, setAccent] = useState<'indigo' | 'emerald' | 'rose'>('indigo');
    const [compact, setCompact] = useState(false);
    const [showSections, setShowSections] = useState({
        summary: true,
        experience: true,
        education: true,
        skills: true,
    });

    // Demo: fake public id generator (in prod generate server-side)
    const demoPublicLink = (id = 'abc123') =>
        `${typeof window !== 'undefined' ? window.location.origin : ''}/resume/${id}`;

    async function handleDownloadDemo() {
        // placeholder: integrate html2canvas + jsPDF in real app
        alert('Demo download triggered — integrate html2canvas/jsPDF in DownloadPDFButton component.');
    }

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Headline + Auth */}
            <div className="lg:col-span-5">
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                    Build a modern resume in minutes
                </h1>
                <p className="mt-4 text-slate-600">
                    Choose templates, reorder sections, download PDF or share publicly — all free and fast.
                </p>

                {/* Auth / Register box */}
                <div className="mt-8 bg-white shadow-sm rounded-lg p-5 border">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Account</h3>
                        <div className="text-sm text-slate-500">
                            {session ? `Signed in as ${session.user?.email}` : 'Not signed in'}
                        </div>
                    </div>

                    {/* Toggle */}
                    <div className="mt-4 flex gap-2">
                        <button
                            className={`px-3 py-1 rounded-md text-sm ${authMode === 'login' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
                            onClick={() => setAuthMode('login')}
                        >
                            Login
                        </button>
                        <button
                            className={`px-3 py-1 rounded-md text-sm ${authMode === 'register' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
                            onClick={() => setAuthMode('register')}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form (demo only) */}
                    <div className="mt-4">
                        {!session ? (
                            <>
                                {authMode === 'login' ? (
                                    <div className="space-y-3">
                                        <input className="w-full px-3 py-2 border rounded" placeholder="email@example.com" />
                                        <input className="w-full px-3 py-2 border rounded" placeholder="password" type="password" />
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => signIn('google')}>
                                                Sign in with Google
                                            </button>
                                            <button
                                                className="px-4 py-2 border rounded"
                                                onClick={() => alert('Local login not implemented in demo')}
                                            >
                                                Login (demo)
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <input className="w-full px-3 py-2 border rounded" placeholder="Full name" />
                                        <input className="w-full px-3 py-2 border rounded" placeholder="email@example.com" />
                                        <input className="w-full px-3 py-2 border rounded" placeholder="password" type="password" />
                                        <div className="flex gap-2">
                                            <button
                                                className="px-4 py-2 bg-emerald-600 text-white rounded"
                                                onClick={() => alert('Register flow not implemented in demo')}
                                            >
                                                Create account
                                            </button>
                                            <button className="px-4 py-2 border rounded" onClick={() => signIn('google')}>
                                                Register with Google
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="mt-3 flex gap-2">
                                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => signOut()}>
                                    Sign out
                                </button>
                                <button
                                    className="px-4 py-2 border rounded"
                                    onClick={() => alert('Go to dashboard (implement route /dashboard)')}
                                >
                                    Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tools / Logic visual controls */}
                <div className="mt-6 bg-white rounded-lg p-4 border shadow-sm">
                    <h4 className="font-medium">Editor tools (demo)</h4>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="col-span-2 flex items-center gap-2">
                            <label className="text-sm w-24">Template</label>
                            <button
                                className={`px-3 py-1 rounded ${template === 'modern' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
                                onClick={() => setTemplate('modern')}
                            >
                                Modern
                            </button>
                            <button
                                className={`px-3 py-1 rounded ${template === 'classic' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
                                onClick={() => setTemplate('classic')}
                            >
                                Classic
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm w-24">Accent</label>
                            <select
                                value={accent}
                                onChange={(e) => setAccent(e.target.value as any)}
                                className="px-2 py-1 border rounded"
                            >
                                <option value="indigo">Indigo</option>
                                <option value="emerald">Emerald</option>
                                <option value="rose">Rose</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm w-24">Compact</label>
                            <input
                                type="checkbox"
                                checked={compact}
                                onChange={() => setCompact((s) => !s)}
                                className="h-4 w-4"
                            />
                        </div>

                        <div className="col-span-2 mt-2 grid grid-cols-2 gap-2">
                            <button
                                className="px-3 py-2 border rounded"
                                onClick={() => setShowSections((s) => ({ ...s, summary: !s.summary }))}
                            >
                                Toggle Summary
                            </button>
                            <button
                                className="px-3 py-2 border rounded"
                                onClick={() => setShowSections((s) => ({ ...s, experience: !s.experience }))}
                            >
                                Toggle Experience
                            </button>
                            <button
                                className="px-3 py-2 border rounded"
                                onClick={() => setShowSections((s) => ({ ...s, education: !s.education }))}
                            >
                                Toggle Education
                            </button>
                            <button
                                className="px-3 py-2 border rounded"
                                onClick={() => setShowSections((s) => ({ ...s, skills: !s.skills }))}
                            >
                                Toggle Skills
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button className="px-4 py-2 bg-sky-600 text-white rounded" onClick={handleDownloadDemo}>
                            Download PDF (demo)
                        </button>
                        <button
                            className="px-4 py-2 border rounded"
                            onClick={() => alert(`Shareable link: ${demoPublicLink()}`)}
                        >
                            Copy share link
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Resume drawing & live preview */}
            <div className="lg:col-span-7">
                <div className="relative bg-white rounded-xl p-6 shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Live Preview</h3>
                            <p className="text-sm text-slate-500">This is a drawn mockup of how the resume will render.</p>
                        </div>

                        {/* small status pills */}
                        <div className="flex gap-2">
                            <div className="px-2 py-1 rounded-full bg-slate-100 text-xs">Template: {template}</div>
                            <div className="px-2 py-1 rounded-full bg-slate-100 text-xs">Accent: {accent}</div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <ResumeDrawing
                            template={template}
                            accent={accent}
                            compact={compact}
                            showSections={showSections}
                        />
                    </div>

                    {/* floating quick tools overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                            className="p-2 rounded-md bg-white border shadow-sm text-xs"
                            title="Edit resume (go to editor)"
                            onClick={() => alert('Open editor (implement route /resume/new or /resume/[id]/edit)')}
                        >
                            Edit
                        </button>
                        <button
                            className="p-2 rounded-md bg-white border shadow-sm text-xs"
                            title="Switch template"
                            onClick={() => setTemplate((t) => (t === 'modern' ? 'classic' : 'modern'))}
                        >
                            Switch
                        </button>
                        <button
                            className="p-2 rounded-md bg-white border shadow-sm text-xs"
                            title="Export"
                            onClick={handleDownloadDemo}
                        >
                            Export
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
