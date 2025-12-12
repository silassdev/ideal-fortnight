'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Upload, ArrowRight, Wand2, FileText } from 'lucide-react';

export default function HomeInteractive() {
    return (
        <section className="py-16 px-6 bg-slate-50">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* AI Generation Section */}
                <div className="relative group overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="p-8 sm:p-12 relative z-10 flex flex-col h-full">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                            <Wand2 className="w-7 h-7" />
                        </div>

                        <h3 className="text-3xl font-bold text-slate-900 mb-4">
                            AI Resume Writer
                        </h3>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Writer's block? No problem. Answer 3 simple questions—Role, Work Type, and Level—and let our AI instantly generate a professional resume structure for you.
                        </p>

                        <div className="mt-auto">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all group-hover:text-indigo-700"
                            >
                                Generate with AI <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Visual Decoration */}
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                            <Sparkles className="w-48 h-48 text-indigo-600" />
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="relative group overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="p-8 sm:p-12 relative z-10 flex flex-col h-full">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-7 h-7" />
                        </div>

                        <h3 className="text-3xl font-bold mb-4">
                            Import Existing Resume
                        </h3>

                        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                            Already have a resume? Don't start from scratch. Upload your existing JSON or TXT file and we'll reformat it into our modern, ATS-friendly templates instantly.
                        </p>

                        <div className="mt-auto">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all hover:text-blue-200"
                            >
                                Upload to Enhance <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Visual Decoration */}
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                            <FileText className="w-48 h-48 text-white" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
