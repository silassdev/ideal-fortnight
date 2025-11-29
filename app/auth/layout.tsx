export const metadata = {
    title: "Auth – Resume Builder",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">
                {children}
            </div>
        </div>
    );
}
