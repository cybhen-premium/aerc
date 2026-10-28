import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/db';
import {
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  Award,
  Target,
  ExternalLink,
  Users,
  Image as ImageIcon,
  ArrowRight,
  Handshake,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found – AERC Ghana' };
  return {
    title: `${project.title} – Alliance for Empowering Rural Communities`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Parse impact statistics
  const impactStats = (() => {
    if (!project.impactStats) return [];
    try {
      return JSON.parse(project.impactStats);
    } catch {
      return [];
    }
  })();

  // Parse gallery images
  const gallery = project.galleryImages
    ? project.galleryImages
        .split(',')
        .map((img) => img.trim())
        .filter(Boolean)
    : [];

  const projStatus = project.status || 'Ongoing';

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO BREADCRUMB BANNER */}
      <section
        className="relative py-20 lg:py-28 bg-emerald-950 text-white overflow-hidden"
        style={
          project.bannerImage || project.coverImage
            ? {
                backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.9), rgba(6, 78, 59, 0.96)), url(${
                  project.bannerImage || project.coverImage
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/projects" className="hover:text-white transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white truncate max-w-xs">{project.title}</span>
          </nav>

          {/* Badges Ribbon */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {project.tag}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                projStatus === 'Ongoing' || projStatus === 'Active'
                  ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                  : projStatus === 'Planned'
                  ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700'
                  : 'bg-blue-900/80 text-blue-300 border border-blue-700'
              }`}
            >
              Status: {projStatus}
            </span>

            {project.location && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-emerald-100 border border-white/10 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                <span>{project.location}</span>
              </span>
            )}

            {project.startDate && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-emerald-100 border border-white/10 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {project.startDate}
                  {project.endDate ? ` – ${project.endDate}` : ' – Ongoing'}
                </span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            {project.title}
          </h1>

          <p className="text-base sm:text-xl text-emerald-100 max-w-3xl leading-relaxed font-light">
            {project.summary}
          </p>

          {project.externalLink && (
            <div className="pt-6">
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
              >
                <span>Visit Official Campaign Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 2. IMPACT STATISTICS COUNTERS RIBBON */}
      {impactStats.length > 0 && (
        <section className="bg-emerald-900 text-white py-10 border-b border-emerald-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {impactStats.map((stat: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. MAIN PROJECT BODY */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-14">
          {/* Cover Media Card */}
          {project.coverImage && (
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 max-h-[500px]">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Narrative Content */}
          {project.description && (
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Program Background &amp; Grassroots Context
              </h2>
              <div className="prose prose-lg prose-emerald max-w-none text-slate-700 leading-relaxed font-serif whitespace-pre-wrap">
                {project.description}
              </div>
            </div>
          )}

          {/* Strategic Objectives */}
          {project.objectives && (
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Target className="w-6 h-6 text-emerald-700" />
                <span>Strategic Objectives &amp; Focus</span>
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {project.objectives}
              </div>
            </div>
          )}

          {/* Activities & Documented Outcomes */}
          {(project.activities || project.outcomes) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.activities && (
                <div className="p-8 rounded-3xl bg-emerald-50/70 border border-emerald-100 space-y-3">
                  <h4 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-700" />
                    <span>Implementation Activities</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed whitespace-pre-wrap">
                    {project.activities}
                  </p>
                </div>
              )}

              {project.outcomes && (
                <div className="p-8 rounded-3xl bg-teal-50/70 border border-teal-100 space-y-3">
                  <h4 className="text-lg font-bold text-teal-950 flex items-center gap-2">
                    <Award className="w-5 h-5 text-teal-700" />
                    <span>Documented Outcomes</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-teal-950 leading-relaxed whitespace-pre-wrap">
                    {project.outcomes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Partners & Funders */}
          {project.partners && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Users className="w-5 h-5 text-emerald-700" />
                <span>Implementing Coalition &amp; Partners</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.partners.split(',').map((p, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    {p.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Showcase */}
          {gallery.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-700" />
                <span>Field Documentation Gallery</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((img, i) => (
                  <div
                    key={i}
                    className="h-48 rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                  >
                    <img
                      src={img}
                      alt={`Documentation ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support / Partner Callout Box */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center sm:text-left">
              <h4 className="text-xl font-bold text-white">
                Interested in scaling this program?
              </h4>
              <p className="text-sm text-emerald-100 max-w-md font-light leading-relaxed">
                Partner with us, sponsor frontline training equipment, or support rural youth champions.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/partner"
                className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
              >
                Partner With Us
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider border border-emerald-700 transition-all"
              >
                Inquire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
