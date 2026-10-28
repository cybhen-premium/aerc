'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Globe,
  Search,
  Filter,
  ExternalLink,
  Plus,
  FileEdit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Archive,
  Layers,
  Sparkles,
  Database,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { SitePage } from '@/db/schema';
import { deletePageAction, updatePageStatusAction } from '../../actions';

interface PagesTableClientProps {
  initialPages: SitePage[];
}

export const PAGE_TYPES = [
  { value: 'ALL', label: 'All Page Types' },
  { value: 'standard', label: 'Standard Content Pages' },
  { value: 'structured', label: 'Structured Data Hubs' },
];

export const CORE_PROTECTED_SLUGS = [
  '/',
  '/about',
  '/projects',
  '/resources',
  '/blog',
  '/team',
  '/contact',
  '/donate',
];

export default function PagesTableClient({ initialPages }: PagesTableClientProps) {
  const [pages, setPages] = useState<SitePage[]>(initialPages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'slug' | 'title' | 'updated' | 'id'>('slug');
  const [deleteModalPage, setDeleteModalPage] = useState<SitePage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats calculation
  const totalCount = pages.length;
  const publishedCount = pages.filter((p) => (p.status || 'published') === 'published').length;
  const draftCount = pages.filter((p) => p.status === 'draft').length;
  const structuredCount = pages.filter(
    (p) =>
      p.pageType === 'structured' ||
      CORE_PROTECTED_SLUGS.includes(p.slug) ||
      ['/projects', '/resources', '/blog', '/team', '/'].includes(p.slug)
  ).length;

  // Filtered & Sorted pages
  const filteredPages = useMemo(() => {
    return pages
      .filter((page) => {
        const matchesSearch =
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (page.description && page.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (page.heroHeadline && page.heroHeadline.toLowerCase().includes(searchQuery.toLowerCase()));

        const isStructured =
          page.pageType === 'structured' ||
          CORE_PROTECTED_SLUGS.includes(page.slug) ||
          ['/projects', '/resources', '/blog', '/team', '/'].includes(page.slug);

        let matchesType = true;
        if (selectedType === 'standard') {
          matchesType = !isStructured;
        } else if (selectedType === 'structured') {
          matchesType = isStructured;
        }

        const pageStatus = page.status || 'published';
        const matchesStatus =
          selectedStatus === 'ALL' || pageStatus.toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'updated') {
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          return bTime - aTime;
        }
        if (sortBy === 'id') {
          return a.id - b.id;
        }
        return a.slug.localeCompare(b.slug);
      });
  }, [pages, searchQuery, selectedType, selectedStatus, sortBy]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await updatePageStatusAction(id, newStatus);
    if (res.success) {
      setPages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    }
  };

  const isProtected = (slug: string) => CORE_PROTECTED_SLUGS.includes(slug);

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Frontend & Content CMS Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Pages Management System
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Manage public routes, customize hero banners, configure interactive sections, manage SEO metadata, and oversee publication workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </Link>
        </div>
      </div>

      {/* 2. Structured Data Integration Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/30 border border-cyan-800/40 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-cyan-900/40 border border-cyan-700/50 text-cyan-400 shrink-0 mt-0.5">
          <Database className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-cyan-300 font-semibold">Structured Data Integration:</strong> Core hub pages such as <code className="text-cyan-200 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800/60">/</code> (Homepage), <code className="text-cyan-200 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800/60">/projects</code>, <code className="text-cyan-200 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800/60">/resources</code>, <code className="text-cyan-200 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800/60">/blog</code>, and <code className="text-cyan-200 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800/60">/team</code> automatically synchronize structured records from their specialized management modules. This Pages module lets you customize their hero media, introductory copy, call-to-actions, custom dynamic sections, and SEO meta tags without editing code.
        </div>
      </div>

      {/* 3. KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Managed</div>
            <div className="text-2xl font-bold text-white mt-1">{totalCount}</div>
            <div className="text-[11px] text-cyan-400 mt-0.5">Active website routes</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-800/50">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live / Published</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{publishedCount}</div>
            <div className="text-[11px] text-emerald-500 mt-0.5">Publicly accessible</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Draft / In Review</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{draftCount}</div>
            <div className="text-[11px] text-amber-500 mt-0.5">Staged or pending</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/50 text-amber-400 border border-amber-800/50">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Structured Hubs</div>
            <div className="text-2xl font-bold text-teal-400 mt-1">{structuredCount}</div>
            <div className="text-[11px] text-teal-500 mt-0.5">Dynamic module feeds</div>
          </div>
          <div className="p-3 rounded-xl bg-teal-950/50 text-teal-400 border border-teal-800/50">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages by title, slug, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {PAGE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Review</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="slug">Sort by Slug (A-Z)</option>
              <option value="title">Sort by Title (A-Z)</option>
              <option value="updated">Recently Updated</option>
              <option value="id">Route ID</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Pages List Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Pages Directory</h2>
          </div>
          <span className="text-xs text-slate-400">
            Showing {filteredPages.length} of {totalCount} pages
          </span>
        </div>

        {filteredPages.length === 0 ? (
          <div className="p-12 text-center">
            <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No pages found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No website pages match your current search or filter criteria. Try resetting filters or create a new page.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredPages.map((page) => {
              const isStructured =
                page.pageType === 'structured' ||
                CORE_PROTECTED_SLUGS.includes(page.slug) ||
                ['/projects', '/resources', '/blog', '/team', '/'].includes(page.slug);

              const protectedPage = isProtected(page.slug);

              return (
                <div
                  key={page.id}
                  className="p-5 hover:bg-slate-850/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left Column: Route Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700/80">
                        {page.slug}
                      </span>

                      {/* Type Badge */}
                      {isStructured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-950/90 text-teal-300 border border-teal-800">
                          <Database className="w-3 h-3" />
                          <span>Structured Hub</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
                          <Layers className="w-3 h-3" />
                          <span>Content Page</span>
                        </span>
                      )}

                      {/* Status Selector Dropdown */}
                      <select
                        value={page.status || 'published'}
                        onChange={(e) => handleStatusChange(page.id, e.target.value)}
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border focus:outline-none transition-colors cursor-pointer ${
                          page.status === 'published'
                            ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                            : page.status === 'draft'
                            ? 'bg-amber-950/90 text-amber-400 border-amber-800'
                            : page.status === 'pending'
                            ? 'bg-blue-950/90 text-blue-400 border-blue-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {page.title}
                    </h3>

                    {page.heroHeadline && page.heroHeadline !== page.title && (
                      <p className="text-xs text-cyan-200/90 font-medium mt-0.5 line-clamp-1">
                        Hero: {page.heroHeadline}
                      </p>
                    )}

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-3xl">
                      {page.description || 'No meta description configured.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Updated {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'Recently'}
                      </span>
                      <span>&bull;</span>
                      <span>
                        Editor: <strong className="text-slate-400 font-medium">{page.lastUpdatedBy || 'Admin'}</strong>
                      </span>
                      {page.seoTitle && (
                        <>
                          <span>&bull;</span>
                          <span className="text-slate-400">SEO Configured</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                    <Link
                      href={page.slug}
                      target="_blank"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                      title="Preview page live on website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </Link>

                    <Link
                      href={`/admin/pages/${page.id}/edit`}
                      className="px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-cyan-800/60 transition-colors flex items-center gap-1.5"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </Link>

                    {!protectedPage ? (
                      <button
                        onClick={() => setDeleteModalPage(page)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 transition-colors"
                        title="Delete page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div
                        className="p-2 rounded-xl bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed"
                        title="System core page (protected from deletion)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Delete Confirmation Modal */}
      {deleteModalPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Website Page</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the page{' '}
              <strong className="text-white font-semibold">"{deleteModalPage.title}"</strong> ({deleteModalPage.slug})?
            </p>

            <form
              action={async (formData) => {
                setIsDeleting(true);
                await deletePageAction(formData);
                setPages((prev) => prev.filter((p) => p.id !== deleteModalPage.id));
                setDeleteModalPage(null);
                setIsDeleting(false);
              }}
              className="flex items-center justify-end gap-3 pt-2"
            >
              <input type="hidden" name="id" value={deleteModalPage.id} />
              <button
                type="button"
                onClick={() => setDeleteModalPage(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-colors flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Page</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
