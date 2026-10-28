import { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/db';
import ProjectsDirectoryClient from './ProjectsDirectoryClient';
import { ChevronRight, ArrowRight, Handshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frontline Projects & Programs – Alliance for Empowering Rural Communities (AERC)',
  description:
    'Explore our grassroots initiatives across Ghana driving agroecological resilience, just energy transitions, clean cooking, fossil finance divestment, and youth climate clubs.',
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const allProjects = await getProjects();

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* 1. HERO BREADCRUMB BANNER */}
      <section className="relative py-20 lg:py-24 bg-emerald-950 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl text-center">
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Projects</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
            Grassroots Action &amp; Advocacy
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Frontline Impact Initiatives
          </h1>

          <p className="text-base sm:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed font-light">
            AERC works at the frontline of community climate adaptation, decentralized renewable energy, clean cooking access, youth mobilization, and ecological accountability across Ghana.
          </p>
        </div>
      </section>

      {/* 2. DIRECTORY SECTION */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ProjectsDirectoryClient initialProjects={allProjects} />
        </div>
      </section>

      {/* 3. PARTNERSHIP CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-br from-emerald-900 to-slate-900 text-white border-t border-emerald-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-800/60 text-emerald-300 border border-emerald-700/60">
            <Handshake className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Want to Support or Partner on an Initiative?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 leading-relaxed font-light max-w-2xl mx-auto">
            Join forces with AERC Ghana to scale community-owned renewable power, restore degraded agroecological land, and empower young climate champions.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/partner"
              className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-950/40 hover:scale-105 transition-all duration-300"
            >
              Become a Partner
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide border border-emerald-700 hover:scale-105 transition-all duration-300"
            >
              Contact Project Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
