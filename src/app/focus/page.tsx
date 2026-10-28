import { Metadata } from 'next';
import Link from 'next/link';
import { getFocusAreas } from '@/db';
import {
  Target,
  Leaf,
  Zap,
  Globe,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Focus Areas & Strategic Pillars – Alliance for Empowering Rural Communities',
  description:
    'Explore AERC Ghana’s strategic pillars across Environment & Climate and Energy Transition, empowering communities and advocating for sustainable change.',
};

export default async function FocusAreasIndexPage() {
  const allAreas = await getFocusAreas();
  const activeAreas = allAreas.filter((a) => (a.status || 'active') === 'active');

  // Group by Parent Pillar
  const pillarsMap = new Map<string, typeof activeAreas>();
  activeAreas.forEach((area) => {
    const pillar = area.parentPillar || 'Other Focus Areas';
    if (!pillarsMap.has(pillar)) {
      pillarsMap.set(pillar, []);
    }
    pillarsMap.get(pillar)!.push(area);
  });

  const pillarEntries = Array.from(pillarsMap.entries());

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-400 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-semibold">Focus Areas & Strategic Pillars</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white py-20 sm:py-28 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
              <Target className="w-4 h-4" />
              Strategic Thematic Pillars
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Our Focus Areas
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              Through targeted interventions in climate resilience, ecological restoration, equitable energy transition, and public accountability, AERC Ghana transforms community vulnerabilities into sustainable prosperity.
            </p>
          </div>
        </section>

        {/* Grouped Pillars & Thematic Areas */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {pillarEntries.map(([pillarName, areas]) => {
              const isEnv = pillarName === 'Environment & Climate';

              return (
                <div key={pillarName} className="space-y-8">
                  {/* Pillar Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`p-2 rounded-xl text-white ${
                            isEnv ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                        >
                          {isEnv ? <Leaf className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        </span>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                          Strategic Pillar
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {pillarName}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      {areas.length} Thematic Areas
                    </span>
                  </div>

                  {/* Focus Areas Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {areas.map((area) => (
                      <Link
                        key={area.id}
                        href={`/focus/${area.slug}`}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all p-6 flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs transition group-hover:scale-105 ${
                                isEnv
                                  ? 'bg-teal-50 text-teal-700 border-teal-200 group-hover:bg-teal-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-100'
                              }`}
                            >
                              <i className={`fa-solid ${area.icon || 'fa-leaf'} text-xl`} />
                            </div>
                            {area.isFeatured === 'yes' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                                Featured
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition">
                            {area.title}
                          </h3>

                          <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                            {area.summary}
                          </p>

                          {area.tags && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {area.tags.split(',').slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                          <span>Explore Focus Area</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
