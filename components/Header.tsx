'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthForm from '@/components/auth/AuthForm';

export default function Header() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    // Close modal when session exists (user logged in)
    useEffect(() => {
        if (session) {
            setShowAuthModal(false);
        }
    }, [session]);

    const handleAuth = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setShowAuthModal(true);
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', authRequired: true },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname?.startsWith(href) ?? false;
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            ResumeBuilder
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => {
                            // Skip auth-required links if not logged in
                            if (link.authRequired && !session) return null;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors ${isActive(link.href)
                                        ? 'text-indigo-600'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">
                                            {session.user?.email?.[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm text-slate-700 max-w-[150px] truncate">
                                        {session.user?.email}
                                    </span>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 border rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleAuth('login')}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={() => handleAuth('register')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm hover:shadow"
                                >
                                    Get started
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link) => {
                                if (link.authRequired && !session) return null;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}

                            <div className="border-t pt-3 mt-2">
                                {session ? (
                                    <>
                                        <div className="px-3 py-2 text-sm text-slate-600">
                                            {session.user?.email}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                signOut({ callbackUrl: '/' });
                                            }}
                                            className="w-full px-3 py-2 text-sm font-medium text-left text-slate-700 hover:bg-slate-50 rounded-lg"
                                        >
                                            Sign out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleAuth('login')}
                                            className="w-full px-3 py-2 text-sm font-medium text-left text-slate-700 hover:bg-slate-50 rounded-lg mb-2"
                                        >
                                            Sign in
                                        </button>
                                        <button
                                            onClick={() => handleAuth('register')}
                                            className="w-full px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"
                                        >
                                            Get started
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Auth Modal */}
            {
                showAuthModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div
                            className="absolute inset-0"
                            onClick={() => setShowAuthModal(false)}
                        />
                        <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white transition-colors"
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <AuthForm defaultMode={authMode} />
                        </div>
                    </div>
                )
            }
        </header >
    );
}
