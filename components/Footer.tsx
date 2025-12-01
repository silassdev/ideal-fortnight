import { Github, ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-slate-50">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>© {new Date().getFullYear()} Resume Builder by</span>
                    <a href="https://github.com/silassdev" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 hover:underline font-medium">
                        silassdev
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
                <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <a href="/privacy" className="text-sm text-slate-500 hover:underline">Privacy</a>
                    <a href="/terms" className="text-sm text-slate-500 hover:underline">Terms</a>
                </div>
            </div>
        </footer>
    );
}
