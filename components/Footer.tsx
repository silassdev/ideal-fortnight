export default function Footer() {
    return (
        <footer className="border-t bg-slate-50">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-slate-600">© {new Date().getFullYear()}Resume Builder</div>
                <div className="flex gap-4 mt-3 sm:mt-0">
                    <a href="/privacy" className="text-sm text-slate-500 hover:underline">Privacy</a>
                    <a href="/terms" className="text-sm text-slate-500 hover:underline">Terms</a>
                </div>
            </div>
        </footer>
    );
}
