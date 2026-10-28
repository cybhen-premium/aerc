import Link from 'next/link';
import {
  Globe,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { SitePage } from '@/db/schema';

interface DynamicPageRendererProps {
  page: SitePage;
}

interface PageSection {
  id: string;
  heading: string;
  subtitle?: string;
  body: string;
  mediaType: 'image' | 'video' | 'none';
  mediaUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  style?: 'default' | 'emerald' | 'dark' | 'card';
}

export default function DynamicPageRenderer({ page }: DynamicPageRendererProps) {
  const sections: PageSection[] = (() => {
    if (!page.sectionsJson) return [];
    try {
      return JSON.parse(page.sectionsJson);
    } catch {
      return [];
    }
  })();

  const isDraft = page.status === 'draft' || page.status === 'pending';

  return (
    <main className="min-h-screen bg-white">
      {/* Draft Warning Banner if previewed */}
      {isDraft && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <span>Staged / Draft Preview: This page is currently set to "{page.status}".</span>
        </div>
      )}

      {/* 1. Hero / Header Banner */}
      <section
        className="relative py-20 lg:py-28 bg-emerald-950 text-white overflow-hidden"
        style={
          page.heroImage
            ? {
                backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.88), rgba(6, 78, 59, 0.94)), url(${page.heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{page.title}</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            {page.heroHeadline || page.title}
          </h1>

          {(page.heroSubtitle || page.description) && (
            <p className="text-base sm:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              {page.heroSubtitle || page.description}
            </p>
          )}

          {page.heroCtaText && (
            <div className="pt-2">
              <Link
                href={page.heroCtaLink || '/contact'}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-950/30 hover:scale-105 transition-all duration-300"
              >
                <span>{page.heroCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Decorative Wave / Pattern overlay */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-20" />
      </section>

      {/* 2. Main Body Content (if provided) */}
      {page.content && (
        <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="prose prose-lg prose-emerald max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
              {page.content}
            </div>
          </div>
        </section>
      )}

      {/* 3. Dynamic Custom Sections */}
      {sections.length > 0 && (
        <section className="py-16 lg:py-24 space-y-16 lg:space-y-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
            {sections.map((sec, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={sec.id}
                  className={`rounded-3xl p-8 sm:p-12 transition-all ${
                    sec.style === 'emerald'
                      ? 'bg-emerald-900 text-white shadow-xl'
                      : sec.style === 'dark'
                      ? 'bg-slate-900 text-white shadow-xl'
                      : sec.style === 'card'
                      ? 'bg-white border border-slate-200 shadow-xl'
                      : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div
                    className={`grid grid-cols-1 ${
                      sec.mediaUrl ? 'lg:grid-cols-2' : ''
                    } gap-8 lg:gap-12 items-center`}
                  >
                    {/* Text Column */}
                    <div className="space-y-4">
                      {sec.subtitle && (
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            sec.style === 'emerald' || sec.style === 'dark'
                              ? 'text-emerald-400'
                              : 'text-emerald-700'
                          }`}
                        >
                          {sec.subtitle}
                        </span>
                      )}

                      <h2
                        className={`text-2xl sm:text-3xl font-bold tracking-tight leading-snug ${
                          sec.style === 'emerald' || sec.style === 'dark'
                            ? 'text-white'
                            : 'text-slate-900'
                        }`}
                      >
                        {sec.heading}
                      </h2>

                      <p
                        className={`text-base leading-relaxed whitespace-pre-wrap ${
                          sec.style === 'emerald' || sec.style === 'dark'
                            ? 'text-slate-200'
                            : 'text-slate-600'
                        }`}
                      >
                        {sec.body}
                      </p>

                      {sec.buttonText && (
                        <div className="pt-2">
                          <Link
                            href={sec.buttonLink || '/contact'}
                            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                              sec.style === 'emerald' || sec.style === 'dark'
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
                                : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-md'
                            }`}
                          >
                            <span>{sec.buttonText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Media Column (if mediaUrl exists) */}
                    {sec.mediaUrl && (
                      <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200/20 max-h-96">
                        {sec.mediaType === 'video' ? (
                          <div className="aspect-video bg-black flex items-center justify-center">
                            <iframe
                              src={sec.mediaUrl}
                              title={sec.heading}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <img
                            src={sec.mediaUrl}
                            alt={sec.heading}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Cross-Navigation Ribbon */}
      <section className="py-12 bg-emerald-950 text-white border-t border-emerald-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-1">
                Explore AERC Ghana
              </div>
              <h3 className="text-xl font-bold text-white">
                Partner with us in grassroots empowerment
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/about"
                className="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white text-xs font-semibold border border-emerald-800 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/projects"
                className="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white text-xs font-semibold border border-emerald-800 transition-colors"
              >
                Our Projects
              </Link>
              <Link
                href="/resources"
                className="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white text-xs font-semibold border border-emerald-800 transition-colors"
              >
                Publications
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
