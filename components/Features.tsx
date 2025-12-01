import { Zap, Target, Download, ShieldCheck, Palette, Lightbulb } from 'lucide-react';

export default function Features() {
    const features = [
        {
            title: 'Real-time Preview',
            description: 'See your changes instantly as you type. No more guessing how your resume will look.',
            icon: <Zap className="w-8 h-8" />,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            title: 'ATS-Friendly',
            description: 'Templates designed to pass Applicant Tracking Systems and get you noticed by recruiters.',
            icon: <Target className="w-8 h-8" />,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'PDF & Docs Export',
            description: 'Download high-quality PDFs & Docs ready for job applications with a single click.',
            icon: <Download className="w-8 h-8" />,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            title: 'Secure & Private',
            description: 'Your data is encrypted and stored securely. We respect your privacy.',
            icon: <ShieldCheck className="w-8 h-8" />,
            color: 'bg-orange-100 text-orange-600',
        },
        {
            title: 'Multiple Templates',
            description: 'Choose from a variety of professional designs to match your style and industry.',
            icon: <Palette className="w-8 h-8" />,
            color: 'bg-pink-100 text-pink-600',
        },
        {
            title: 'Smart Suggestions',
            description: 'Get tips and examples for what to write in each section of your resume.',
            icon: <Lightbulb className="w-8 h-8" />,
            color: 'bg-yellow-100 text-yellow-600',
        },
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        Everything you need to <br />
                        <span className="text-blue-600">land the interview</span>
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        Our builder is packed with powerful features to help you create a standout resume without the hassle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
