import { Metadata } from 'next';
import Link from 'next/link';
import { getPublications, getBlogPosts, getBlogComments } from '@/db';
import CommentSection from '@/components/CommentSection';
import ResourcesDirectoryClient from './ResourcesDirectoryClient';
import { FileText, Download, Calendar, ExternalLink, ShieldCheck, Mail, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Publications & Resources – AERC Ghana',
  description: 'Download policy briefs, research reports, impact newsletters, and community frameworks published by the Alliance for Empowering Rural Communities in Ghana.',
};

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const [pubs, recentBlogs, comments] = await Promise.all([
    getPublications(),
    getBlogPosts(),
    getBlogComments('resources'),
  ]);

  const annualReport = pubs.find(
    (p) => p.category === 'Annual Reports' || p.title.toLowerCase().includes('annual report')
  );

  return (
    <>
      {/* BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Publications & Resources</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Publications</span></li>
          </ul>
        </div>
      </section>

      {/* PUBLICATIONS MAIN CONTENT */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '50px', alignItems: 'start' }}>
            {/* Left: Publications Client Directory & Comments */}
            <div>
              <ResourcesDirectoryClient initialPublications={pubs} />

              {/* Leave A Comment / Feedback Section */}
              <div className="mt-16 pt-10 border-t border-slate-200">
                <CommentSection blogSlug="resources" initialComments={comments} />
              </div>
            </div>

            {/* Right: Sidebar */}
            <aside className="space-y-8">
              {/* Flagship Annual Report Feature */}
              {annualReport && (
                <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Annual Flagship Report</span>
                  </div>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-emerald-400/30">
                    <img
                      src={annualReport.coverImage || '/images/bettering-tomorrow.jpg'}
                      alt={annualReport.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white leading-snug">
                      {annualReport.title}
                    </h4>
                    <p className="text-slate-300 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                      {annualReport.summary || 'Comprehensive review of our institutional governance, community achievements, and grassroots advocacy.'}
                    </p>
                  </div>
                  <a
                    href={annualReport.downloadUrl}
                    download
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Report ({annualReport.fileSize || 'PDF'})</span>
                  </a>
                </div>
              )}

              {/* Open Access & Attribution Note */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Access Knowledge</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  All AERC Ghana policy papers, research publications, and community resources are openly licensed under Creative Commons (CC BY-NC 4.0) to empower grassroots organizers, researchers, students, and policymakers.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  For media reproduction or citation queries, contact our editorial desk at <strong className="text-slate-700">info@aercghana.org</strong>.
                </div>
              </div>

              {/* Recent Articles */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-base font-bold text-slate-900 border-b-2 border-emerald-500 pb-2">
                  Related Stories & News
                </h4>
                <ul className="space-y-4">
                  {recentBlogs.slice(0, 4).map((post) => (
                    <li key={post.id} className="flex items-center gap-3 group">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 bg-slate-100">
                        <img
                          src={post.coverImage || '/images/hero-bg.jpg'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold leading-snug line-clamp-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-slate-800 hover:text-emerald-700 transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h5>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
