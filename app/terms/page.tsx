import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Terms of Service — Resume Builder',
    description: 'Terms of Service for Resume Builder application.',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Home</Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Terms of Service</h1>
                    <p className="mt-2 text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <p>
                        Please read these Terms of Service ("Terms") carefully before using the Resume Builder website and service operated by us.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">
                        By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">2. Accounts</h2>
                    <p className="mb-4">
                        When you create an account with us, you must provide information that is accurate, complete, and current. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                    </p>
                    <p className="mb-4">
                        You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">3. Use of Service</h2>
                    <p className="mb-4">
                        You agree to use the Resume Builder only for lawful purposes. You are prohibited from:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Using the service to generate content that is illegal, offensive, or fraudulent.</li>
                        <li>Attempting to interfere with the proper working of the service.</li>
                        <li>Accessing or attempting to access any non-public areas of the service.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
                    <p className="mb-4">
                        The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Resume Builder and its licensors.
                    </p>
                    <p className="mb-4">
                        You retain all rights to the resume content you create using our service. By using the service, you grant us a license to host and display your content solely for the purpose of providing the service to you.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">5. Termination</h2>
                    <p className="mb-4">
                        We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
                    <p className="mb-4">
                        In no event shall Resume Builder, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">7. Changes</h2>
                    <p className="mb-4">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about these Terms, please contact us at support@resumebuilder.com.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
