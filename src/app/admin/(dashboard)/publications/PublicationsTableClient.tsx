'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  Plus,
  FileEdit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  Eye,
  FileSpreadsheet,
  Newspaper,
  ScrollText,
} from 'lucide-react';
import { Publication } from '@/db/schema';
import {
  deletePublicationAction,
  updatePublicationStatusAction,
  togglePublicationFeaturedAction,
} from '../../actions';

export const PUBLICATION_CATEGORIES = [
  'Annual Reports',
  'Research Reports',
  'Policy Briefs',
  'Newsletters',
  'Press Releases',
  'Research Papers',
  'Energy Transition Reports',
  'Climate and Environmental Resources',
  'Community Development Publications',
] as const;

export const PUBLICATION_STATUSES = ['published', 'draft', 'archived'] as const;

interface PublicationsTableClientProps {
  initialPublications: Publication[];
}

export default function PublicationsTableClient({ initialPublications }: PublicationsTableClientProps) {
  const [publications, setPublications] = useState<Publication[]>(initialPublications);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedFeatured, setSelectedFeatured] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'downloads-desc' | 'title-asc'>('date-desc');
  const [deleteModalItem, setDeleteModalItem] = useState<Publication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic set of categories found in data
  const availableCategories = useMemo(() => {
    const set = new Set<string>(PUBLICATION_CATEGORIES);
    publications.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [publications]);

  // Statistics
  const totalCount = publications.length;
  const reportsCount = publications.filter(
    (p) => p.category === 'Annual Reports' || p.category === 'Research Reports'
  ).length;
  const briefsCount = publications.filter(
    (p) => p.category === 'Policy Briefs' || p.category === 'Research Papers'
  ).length;
  const newsMediaCount = publications.filter(
    (p) => p.category === 'Newsletters' || p.category === 'Press Releases'
  ).length;
  const totalDownloads = publications.reduce((acc, p) => acc + (p.downloadCount || 0), 0);

  // Filtered & Sorted
  const filteredPublications = useMemo(() => {
    return publications
      .filter((item) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          (item.slug && item.slug.toLowerCase().includes(query)) ||
          (item.author && item.author.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.summary && item.summary.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query));

        const matchesCategory =
          selectedCategory === 'ALL' ||
          (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

        const itemStatus = (item.status || 'published').toLowerCase();
        const matchesStatus =
          selectedStatus === 'ALL' || itemStatus === selectedStatus.toLowerCase();

        const matchesFeatured =
          selectedFeatured === 'ALL' ||
          (selectedFeatured === 'featured' && item.isFeatured === 'yes') ||
          (selectedFeatured === 'standard' && item.isFeatured !== 'yes');

        return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
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
  }, [publications, searchQuery, selectedCategory, selectedStatus, selectedFeatured, sortBy]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setPublications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    try {
      await updatePublicationStatusAction(id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: string | null | undefined) => {
    const nextFeatured = currentFeatured === 'yes' ? 'no' : 'yes';
    setPublications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFeatured: nextFeatured } : item))
    );
    try {
      await togglePublicationFeaturedAction(id, nextFeatured === 'yes');
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Publications & Resources</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            Publications & Reports Management
          </h1>
          <p className="text-sm text-slate-400">
            Publish, edit, and categorize AERC Ghana research documents, policy briefs, newsletters, and reports.
          </p>
        </div>

        <Link
          href="/admin/publications/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-sm shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Publication</span>
        </Link>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Documents</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{totalCount}</p>
          <span className="text-[11px] text-emerald-400 font-medium">All active & archived</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Annual & Research</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{reportsCount}</p>
          <span className="text-[11px] text-blue-400 font-medium">Flagship reports</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Policy Briefs</span>
            <ScrollText className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{briefsCount}</p>
          <span className="text-[11px] text-purple-400 font-medium">Briefs & papers</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Newsletters & Press</span>
            <Newspaper className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{newsMediaCount}</p>
          <span className="text-[11px] text-amber-400 font-medium">Quarterly & releases</span>
        </div>

        <div className="col-span-2 md:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Downloads</span>
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 tracking-tight">
            {totalDownloads.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Tracked document reads</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search title, author, summary, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter publications by category"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="ALL">All Categories ({totalCount})</option>
              {availableCategories.map((cat) => {
                const count = publications.filter((p) => p.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter publications by status"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div className="md:col-span-1">
            <select
              value={selectedFeatured}
              onChange={(e) => setSelectedFeatured(e.target.value)}
              aria-label="Filter publications by featured status"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="ALL">All Priority</option>
              <option value="featured">Featured ★</option>
              <option value="standard">Standard</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort publications"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="downloads-desc">Most Downloads</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedFeatured !== 'ALL') && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400">Showing {filteredPublications.length} of {totalCount} records</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSelectedFeatured('ALL');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-medium ml-2 underline text-[11px]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* PUBLICATIONS TABLE */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold w-12 text-center">★</th>
                <th className="py-3.5 px-4 font-semibold">Document Title & Details</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Author / Unit</th>
                <th className="py-3.5 px-4 font-semibold">Format & Size</th>
                <th className="py-3.5 px-4 font-semibold">Published</th>
                <th className="py-3.5 px-4 font-semibold">Downloads</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPublications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium text-slate-300">No publications matched your query.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try searching with different keywords or clearing active filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPublications.map((pub) => {
                  const isPubFeatured = pub.isFeatured === 'yes';
                  const pubStatus = (pub.status || 'published').toLowerCase();

                  return (
                    <tr
                      key={pub.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Featured Star Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(pub.id, pub.isFeatured)}
                          title={isPubFeatured ? 'Featured on Resources page (click to unfeature)' : 'Mark as Featured'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isPubFeatured
                              ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10'
                              : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isPubFeatured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Title & Cover & Summary */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-start gap-3">
                          {pub.coverImage ? (
                            <img
                              src={pub.coverImage}
                              alt={pub.title}
                              className="w-10 h-12 rounded object-cover border border-slate-700/60 flex-shrink-0 mt-0.5"
                            />
                          ) : (
                            <div className="w-10 h-12 rounded bg-slate-800 border border-slate-700/60 flex items-center justify-center flex-shrink-0 text-slate-500 mt-0.5">
                              <FileText className="w-5 h-5 text-emerald-400/60" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              href={`/admin/publications/${pub.id}/edit`}
                              className="font-semibold text-white text-sm hover:text-emerald-400 transition-colors line-clamp-2"
                            >
                              {pub.title}
                            </Link>
                            {pub.summary && (
                              <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                                {pub.summary}
                              </p>
                            )}
                            {pub.slug && (
                              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                                slug: {pub.slug}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {pub.category || 'General'}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                        <span className="text-xs truncate block max-w-[160px]" title={pub.author || 'AERC Team'}>
                          {pub.author || 'AERC Team'}
                        </span>
                      </td>

                      {/* Format & Size */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                            {pub.fileType || 'PDF'}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {pub.fileSize || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Published Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(pub.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </td>

                      {/* Download Count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Download className="w-3 h-3" />
                          {(pub.downloadCount || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={pubStatus}
                          onChange={(e) => handleStatusChange(pub.id, e.target.value)}
                          aria-label={`Change publication status for ${pub.title}`}
                          className={`text-[11px] font-medium rounded-lg px-2 py-1 border focus:outline-none transition-colors cursor-pointer ${
                            pubStatus === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : pubStatus === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-slate-700/20 text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="published" className="bg-slate-900 text-emerald-400">
                            Published
                          </option>
                          <option value="draft" className="bg-slate-900 text-amber-400">
                            Draft
                          </option>
                          <option value="archived" className="bg-slate-900 text-slate-400">
                            Archived
                          </option>
                        </select>
                      </td>

                      {/* Action Links */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {pub.downloadUrl && (
                            <a
                              href={pub.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Document"
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          <Link
                            href={`/admin/publications/${pub.id}/edit`}
                            title="Edit Publication"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <FileEdit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteModalItem(pub)}
                            title="Delete Publication"
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Publication</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5">
              <p className="text-white font-semibold">{deleteModalItem.title}</p>
              <p className="text-slate-400">Category: {deleteModalItem.category}</p>
              <p className="text-slate-400">Format: {deleteModalItem.fileType} ({deleteModalItem.fileSize})</p>
              <p className="text-slate-400">Downloads: {(deleteModalItem.downloadCount || 0).toLocaleString()}</p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete this publication record? It will be removed from the public website and admin dashboard.
            </p>

            <form action={deletePublicationAction} onSubmit={() => setIsDeleting(true)}>
              <input type="hidden" name="id" value={deleteModalItem.id} />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 transition-all flex items-center gap-2"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
