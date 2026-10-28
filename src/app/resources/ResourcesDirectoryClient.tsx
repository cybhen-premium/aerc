'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Calendar,
  ExternalLink,
  Search,
  Filter,
  Star,
  User,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Eye,
  X,
  TrendingUp,
} from 'lucide-react';
import { Publication } from '@/db/schema';
import { trackPublicationDownloadAction } from '@/app/admin/actions';

interface ResourcesDirectoryClientProps {
  initialPublications: Publication[];
}

export default function ResourcesDirectoryClient({ initialPublications }: ResourcesDirectoryClientProps) {
  const [publications, setPublications] = useState<Publication[]>(initialPublications);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'downloads-desc' | 'title-asc'>('date-desc');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Extract all categories present in published documents
  const allCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    publications.forEach((p) => {
      const cat = p.category || 'Research Reports';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [publications]);

  // Featured publications
  const featuredPublications = useMemo(() => {
    return publications.filter(
      (p) => p.isFeatured === 'yes' && (p.status || 'published').toLowerCase() === 'published'
    );
  }, [publications]);

  // Filtered and sorted publications
  const filteredPublications = useMemo(() => {
    return publications
      .filter((p) => {
        // Only show published documents on the public directory
        const status = (p.status || 'published').toLowerCase();
        if (status === 'draft') return false;

        const matchesCategory =
          selectedCategory === 'ALL' ||
          (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          p.title.toLowerCase().includes(query) ||
          (p.summary && p.summary.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.author && p.author.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        }
        if (sortBy === 'downloads-desc') {
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        }
        return a.title.localeCompare(b.title);
      });
  }, [publications, selectedCategory, searchQuery, sortBy]);

  // Track download handler
  const handleDownload = async (pub: Publication) => {
    setDownloadingId(pub.id);

    // Optimistically increment download count in local state
    setPublications((prev) =>
      prev.map((item) =>
        item.id === pub.id ? { ...item, downloadCount: (item.downloadCount || 0) + 1 } : item
      )
    );

    try {
      await trackPublicationDownloadAction(pub.id);
    } catch (err) {
      console.warn('Could not record download tracking:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  return (
    <div className="space-y-10">
      {/* SECTION HEADER & KNOWLEDGE SUMMARY */}
      <div className="space-y-3">
        <span className="sub-title flex items-center gap-2 text-emerald-700 font-bold tracking-wider uppercase text-xs">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          AERC Knowledge Bank & Publications
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Official Reports, Newsletters & Policy Briefs
        </h2>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
          Access high-impact research papers, frontline community monitoring reports, quarterly impact newsletters, and actionable policy memos produced by the Alliance for Empowering Rural Communities in Ghana.
        </p>
      </div>

      {/* FEATURED PUBLICATIONS SPOTLIGHT */}
      {featuredPublications.length > 0 && selectedCategory === 'ALL' && !searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Featured Research & Flagship Reports
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPublications.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="group relative bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-start gap-5">
                  {/* Thumbnail */}
                  <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden shadow-2xl border border-emerald-400/30 flex-shrink-0 bg-slate-950 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={item.coverImage || '/images/bettering-tomorrow.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Meta & Title */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.category || 'Flagship Report'}
                      </span>
                      <span className="text-[11px] text-emerald-400/80 font-mono">
                        {item.fileType || 'PDF'} • {item.fileSize || '—'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {item.summary && (
                      <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium truncate max-w-[150px]">
                      {item.author || 'AERC Ghana'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      {(item.downloadCount || 0).toLocaleString()} reads
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="External Repository"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={item.downloadUrl}
                      download
                      onClick={() => handleDownload(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Top bar: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search reports, policy briefs, keywords, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-9 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500 shadow-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="downloads-desc">Most Downloaded</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Categories ({publications.filter((p) => (p.status || 'published').toLowerCase() !== 'draft').length})
          </button>

          {allCategories.map(([cat, count]) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
          <span>
            Showing <strong className="text-slate-800">{filteredPublications.length}</strong> publication{filteredPublications.length !== 1 ? 's' : ''}
            {selectedCategory !== 'ALL' && (
              <> in <strong className="text-emerald-700">{selectedCategory}</strong></>
            )}
            {searchQuery && (
              <> matching &ldquo;<span className="text-slate-800 font-medium">{searchQuery}</span>&rdquo;</>
            )}
          </span>

          {(selectedCategory !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-emerald-600 hover:text-emerald-800 font-medium underline text-xs"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* PUBLICATIONS DIRECTORY LIST */}
      <div className="space-y-4">
        {filteredPublications.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto opacity-60" />
            <h4 className="text-lg font-bold text-slate-800">No publications matched your selection</h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We couldn&apos;t find any documents matching your search keywords or active category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-md hover:bg-emerald-700 transition-colors"
            >
              <span>View All Publications</span>
            </button>
          </div>
        ) : (
          filteredPublications.map((item) => {
            const isFeatured = item.isFeatured === 'yes';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/50 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                {/* Left side: Thumbnail + Content */}
                <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                  {/* Document Cover Thumbnail */}
                  <div className="w-16 h-22 sm:w-20 sm:h-26 rounded-xl overflow-hidden shadow border border-slate-200 bg-slate-100 flex-shrink-0 group-hover:scale-102 transition-transform">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                        <FileText className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Document Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Badges line */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {item.category || 'Report'}
                      </span>

                      {isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          Featured
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.author || 'AERC Research Desk'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {item.title}
                    </h4>

                    {/* Summary / Description */}
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {item.summary || item.description}
                    </p>

                    {/* Metadata indicators */}
                    <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-500 pt-1 flex-wrap font-medium">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.fileType || 'PDF'} • {item.fileSize || '—'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-slate-600">
                        <Download className="w-3 h-3 text-emerald-600" />
                        {(item.downloadCount || 0).toLocaleString()} downloads
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex sm:flex-row md:flex-col items-center gap-2 w-full md:w-auto flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <a
                    href={item.downloadUrl}
                    download
                    onClick={() => handleDownload(item)}
                    className="flex-1 md:flex-initial w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:shadow-emerald-600/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingId === item.id ? 'Starting...' : 'Download PDF'}</span>
                  </a>

                  <div className="flex items-center gap-2 w-full">
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                      title="View in Browser"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View</span>
                    </a>

                    {item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                        title="External Source / DOI"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
