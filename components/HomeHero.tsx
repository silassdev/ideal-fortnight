'use client';

import { useEffect, useState } from 'react';

export default function HomeHero() {
    const [mounted, setMounted] = useState(false);
    const [msgIndex, setMsgIndex] = useState(0);
    const messages = [
        '6+ modern templates included',
        'ATS-friendly formatting',
        'Export: PDF & DOCX ready',
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setMsgIndex((s) => (s + 1) % messages.length), 2800);
        return () => clearInterval(t);
    }, []);

    return (
        <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                        ✨ The Ultimate Resume Builder
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                        Craft your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                            dream career
                        </span>
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-lg leading-relaxed">
                        Create professional, ATS-friendly resumes in minutes. Choose from modern templates, customize every detail, and land your next job faster.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <div
                            aria-hidden="true"
                            className="flex-1 min-w-0 px-8 py-4 rounded-xl bg-slate-900 text-white shadow-lg flex items-center gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-slate-300">Template</div>
                                <div className="text-lg font-semibold truncate">Apela</div>
                            </div>

                            <div className="flex-none text-right">
                                <div className="text-xs text-slate-400">Status</div>
                                <div className="font-medium text-sm">Active</div>
                            </div>
                        </div>

                        <div
                            aria-live="polite"
                            className="flex-1 min-w-0 px-8 py-4 rounded-xl bg-white border border-slate-200 flex items-center"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-slate-500">Snapshot</div>
                                <div className="text-base font-medium truncate text-slate-700">
                                    {messages[msgIndex]}
                                </div>
                            </div>

                            <div className="flex-none ml-4 text-slate-400 text-xs">
                                • {new Date().getFullYear()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-400">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 10,000+ job seekers</p>
                    </div>
                </div>

                {/* Right Visual */}
                <div className={`relative perspective-1000 transition-all duration-1000 delay-300 ease-out transform ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                    <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:ml-auto transform rotate-y-12 rotate-x-6 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-500 ease-out preserve-3d group">
                        {/* Resume Card */}
                        <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 animate-pulse"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse"></div>
                                    <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="space-y-3 flex-1">
                                {[90, 75, 85, 60, 95, 70].map((width, i) => (
                                    <div key={i} className="h-2 bg-slate-50 rounded w-full" style={{ width: `${width}%` }}></div>
                                ))}
                                <div className="h-32 bg-slate-50 rounded-lg mt-4 border border-slate-100 border-dashed flex items-center justify-center text-slate-300 text-sm">
                                    Experience Section
                                </div>
                                {[1, 2, 3].map((i) => (
                                    <div key={`b-${i}`} className="h-2 bg-slate-50 rounded w-full"></div>
                                ))}
                            </div>

                            <div className="absolute -right-4 top-20 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">ATS Score</p>
                                    <p className="font-bold text-slate-900">98/100</p>
                                </div>
                            </div>

                            <div className="absolute -left-4 bottom-20 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float animation-delay-2000">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    PDF
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Export</p>
                                    <p className="font-bold text-slate-900">Ready</p>
                                </div>
                            </div>
                        </div>

                        {/* Back Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 -z-10 transform translate-y-4 translate-x-4 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform duration-500"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .rotate-y-12 { transform: rotateY(-12deg) rotateX(5deg); }
                .rotate-x-6 { transform: rotateX(6deg); }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
