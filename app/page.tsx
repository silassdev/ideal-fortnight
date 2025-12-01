import HomeHero from '@/components/HomeHero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Resume Builder — Create modern resumes',
  description: 'Ultra-modern resume generator — templates, PDF export, shareable links.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <HomeHero />
      </div>
      <Features />
      <Footer />
    </main>
  );
}
