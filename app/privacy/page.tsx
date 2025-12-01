import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy — Resume Builder',
    description: 'Privacy Policy for Resume Builder application.',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Home</Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Privacy Policy</h1>
                    <p className="mt-2 text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <p>
                        At Resume Builder, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our resume building service.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                    <p className="mb-4">
                        <strong>Account Information:</strong> When you sign up, we collect your email address and password (hashed) to create and secure your account.
                    </p>
                    <p className="mb-4">
                        <strong>Resume Data:</strong> We collect the information you voluntarily input into your resumes, including your name, contact details, work experience, education, and skills. This data is stored securely to allow you to edit and download your resumes.
                    </p>
                    <p className="mb-4">
                        <strong>Usage Data:</strong> We may collect anonymous usage statistics to improve our service, such as which templates are most popular.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>To provide and maintain the Resume Builder service.</li>
                        <li>To allow you to create, save, and export your resumes.</li>
                        <li>To communicate with you about your account or service updates.</li>
                        <li>To improve the performance and user experience of our application.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Sharing and Disclosure</h2>
                    <p className="mb-4">
                        We do not sell your personal data to third parties. We may share your information only in the following circumstances:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Service Providers:</strong> We may use third-party services (e.g., hosting, email delivery) to operate our application. These providers have access to your data only to perform specific tasks on our behalf and are obligated to protect it.</li>
                        <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
                    <p className="mb-4">
                        We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
                    <p className="mb-4">
                        You have the right to access, update, or delete your personal information. You can manage your account settings and resume data directly within the application. If you wish to delete your account permanently, please contact us.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">6. Changes to This Policy</h2>
                    <p className="mb-4">
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about this Privacy Policy, please contact us at support@resumebuilder.com.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
