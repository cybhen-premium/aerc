import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getFocusAreas,
  getFocusAreaBySlug,
  getProjects,
  getBlogPosts,
  getPublications,
} from '@/db';
import {
  Target,
  ChevronRight,
  Leaf,
  Zap,
  Globe,
  Briefcase,
  BookOpen,
  FileText,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Handshake,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = await getFocusAreaBySlug(slug);
  if (!area) return { title: 'Focus Area Not Found – AERC Ghana' };
  return {
    title: `${area.title} – Focus Areas – AERC Ghana`,
    description: area.summary,
  };
}

export default async function FocusAreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = await getFocusAreaBySlug(slug);

  if (!area) {
    notFound();
  }

  const [allAreas, allProjects, allBlogs, allPublications] = await Promise.all([
    getFocusAreas(),
    getProjects(),
    getBlogPosts(),
    getPublications(),
  ]);

  const isEnv = area.parentPillar === 'Environment & Climate';
  const tagList = area.tags
    ? area.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  // Match relevant projects:
  // 1. Matches tag or focusArea
  // 2. Matches any tag keyword from this focus area
  // 3. Fallback: match by parent pillar keywords
  const matchedProjects = allProjects.filter((p) => {
    const pTag = (p.tag || '').toLowerCase();
    const pFocus = (p.focusArea || '').toLowerCase();
    const pTitle = (p.title || '').toLowerCase();
    const areaTitleLower = area.title.toLowerCase();

    if (pFocus.includes(areaTitleLower) || pTag.includes(areaTitleLower)) return true;
    if (tagList.some((t) => pTag.includes(t) || pFocus.includes(t) || pTitle.includes(t))) return true;

    // Direct thematic affinity matches
    if (area.slug === 'renewable-energy' && (pTag.includes('clean cooking') || pTag.includes('energy') || pTitle.includes('energy'))) return true;
    if (area.slug === 'community-led-adaptation' && (pTag.includes('youth') || pTag.includes('schools') || pTitle.includes('garden'))) return true;
    if (area.slug === 'fossil-fuel-finance-accountability' && (pTag.includes('finance') || pTitle.includes('fossil'))) return true;
    if (area.slug === 'nature-based-solutions' && (pTitle.includes('garden') || pTag.includes('community') || pTag.includes('nature'))) return true;

    return false;
  });

  // Fallback if none matched: show 2 active projects
  const displayProjects = matchedProjects.length > 0 ? matchedProjects : allProjects.slice(0, 2);

  // Match relevant news/articles
  const matchedBlogs = allBlogs.filter((b) => {
    const cat = (b.category || '').toLowerCase();
    const title = (b.title || '').toLowerCase();
    const excerpt = (b.excerpt || '').toLowerCase();
    const areaTitleLower = area.title.toLowerCase();

    if (cat.includes(areaTitleLower) || title.includes(areaTitleLower)) return true;
    if (tagList.some((t) => cat.includes(t) || title.includes(t) || excerpt.includes(t))) return true;
    if (isEnv && (cat.includes('environment') || cat.includes('adaptation') || cat.includes('conservation') || cat.includes('climate'))) return true;
    if (!isEnv && (cat.includes('energy') || cat.includes('finance') || cat.includes('just transition') || cat.includes('policy'))) return true;

    return false;
  }).slice(0, 3);

  const displayBlogs = matchedBlogs.length > 0 ? matchedBlogs : allBlogs.slice(0, 3);

  // Match relevant publications
  const matchedPublications = allPublications.filter((pub) => {
    const title = (pub.title || '').toLowerCase();
    const desc = (pub.description || '').toLowerCase();
    const areaTitleLower = area.title.toLowerCase();

    if (title.includes(areaTitleLower) || desc.includes(areaTitleLower)) return true;
    if (tagList.some((t) => title.includes(t) || desc.includes(t))) return true;
    if (isEnv && (title.includes('climate') || title.includes('community') || title.includes('cop') || desc.includes('environment'))) return true;
    if (!isEnv && (title.includes('energy') || title.includes('finance') || title.includes('transition') || desc.includes('power'))) return true;

    return false;
  }).slice(0, 3);

  const displayPublications = matchedPublications.length > 0 ? matchedPublications : allPublications.slice(0, 3);

  // Related sibling focus areas under same pillar
  const siblingAreas = allAreas.filter((a) => a.id !== area.id && (a.status || 'active') === 'active');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-emerald-400 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/about#focus" className="hover:text-emerald-400 transition">
              Focus Areas & Pillars
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-semibold truncate">{area.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section
          className={`relative text-white py-16 sm:py-24 overflow-hidden ${
            isEnv
              ? 'bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950'
              : 'bg-gradient-to-br from-slate-950 via-amber-950 to-stone-950'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-5">
              {/* Strategic Pillar Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    isEnv
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {isEnv ? <Leaf className="w-3.5 h-3.5 text-emerald-400" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
                  {area.parentPillar}
                </span>

                {area.isFeatured === 'yes' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/15">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Priority Focus Area
                  </span>
                )}
              </div>

              {/* Title & Icon Header */}
              <div className="flex items-start gap-4 sm:gap-5">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border shadow-xl ${
                    isEnv
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  <i className={`fa-solid ${area.icon || 'fa-leaf'} text-2xl sm:text-3xl`} />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                    {area.title}
                  </h1>
                </div>
              </div>

              {/* Summary Narrative */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light pt-2">
                {area.summary}
              </p>

              {/* Tags / Subcategories */}
              {area.tags && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {area.tags.split(',').map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-slate-200 border border-white/10 font-medium"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Large Watermark Icon in Background */}
          <div className="absolute right-12 bottom-6 opacity-10 text-9xl hidden md:block pointer-events-none select-none">
            <i className={`fa-solid ${area.icon || 'fa-leaf'}`} />
          </div>
        </section>

        {/* Thematic Strategy & Overview Body */}
        <section className="py-14 sm:py-18 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Main Narrative Column */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Strategic Mandate
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    How AERC Works on {area.title}
                  </h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base sm:text-lg">
                  {area.description ? (
                    area.description.split('\n\n').map((para, i) => (
                      <p key={i} className="mb-4">
                        {para}
                      </p>
                    ))
                  ) : (
                    <p>{area.summary}</p>
                  )}
                </div>

                {/* Key Pillars Checklist */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 mt-6">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>AERC Strategic Principles for this Focus Area</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Grassroots community ownership & local leadership</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Evidence-based policy advocacy and legal monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Youth empowerment and climate education integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Transparent financing and institutional accountability</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Card & Quick Facts */}
              <div className="lg:col-span-4 space-y-6">
                {/* Visual Image Card */}
                {area.image && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={area.image}
                      alt={area.title}
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-4 bg-white">
                      <div className="text-xs font-semibold text-slate-500">
                        Thematic Field Focus
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {area.title}
                      </div>
                    </div>
                  </div>
                )}

                {/* Engagement Box */}
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Collaborate With Us</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Are you a grassroots organisation, researcher, or philanthropic funder passionate about {area.title}? Join our movement across Ghana.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      href="/partner"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                    >
                      <span>Become a Partner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      <span>Contact our {area.parentPillar} Desk</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Associated Field Projects & Initiatives */}
        <section className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Field Deployments
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                  <span>Associated Projects & Initiatives</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                  Explore active grassroots programs and advocacy campaigns that implement this thematic focus.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
              >
                <span>View all projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImage || '/images/clean-cook.jpg'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white">
                        {project.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {project.location && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mb-1.5">
                          <MapPin className="w-3 h-3" />
                          <span>{project.location}</span>
                        </div>
                      )}
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        Status: <span className="text-emerald-700">{project.status || 'Ongoing'}</span>
                      </span>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Relevant News, Articles & Advocacy Stories */}
        <section className="py-14 sm:py-18 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Insights & Commentary
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  <span>Related Articles & Media</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                  Recent reports, press releases, and editorial articles addressing this strategic pillar.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
              >
                <span>View all news</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition"
                >
                  <div className="relative h-44 w-full bg-slate-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.coverImage || '/images/hero-community.jpg'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-end">
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition"
                      >
                        <span>Read story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Relevant Publications & Policy Briefs */}
        <section className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Knowledge Repository
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  <span>Publications & Research Reports</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                  Policy briefs, monitoring reports, and research publications authored or endorsed by AERC.
                </p>
              </div>
              <Link
                href="/resources"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
              >
                <span>View all publications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {displayPublications.map((pub) => (
                <div
                  key={pub.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                        {pub.fileType || 'PDF Report'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {pub.fileSize || '2.4 MB'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {pub.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {pub.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      AERC Research Desk
                    </span>
                    <a
                      href={pub.downloadUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <span>Download</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Sibling Focus Areas */}
        <section className="py-14 sm:py-18 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Explore More
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Other AERC Focus Areas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {siblingAreas.map((item) => (
                <Link
                  key={item.id}
                  href={`/focus/${item.slug}`}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/60 hover:border-emerald-300 transition group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-emerald-700">
                      <i className={`fa-solid ${item.icon || 'fa-leaf'} text-xs`} />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-emerald-600 truncate">
                      {item.parentPillar}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-emerald-800 line-clamp-2">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
