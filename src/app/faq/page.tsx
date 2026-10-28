import FaqClient from './FaqClient';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions (FAQ) | AERC Ghana',
  description: 'Find answers about AERC’s mission, Green-Life school clubs, renewable energy, volunteering, and grassroots donations.',
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-4 shadow-lg">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Community Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            Everything you need to know about our community initiatives, environmental campaigns, grassroots partnerships, and how to get involved.
          </p>
        </div>

        <FaqClient />
      </div>
    </div>
  );
}
