'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Target,
  Search,
  Filter,
  Plus,
  FileEdit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Layers,
  Sparkles,
  ArrowUpDown,
  Leaf,
  Zap,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { FocusArea } from '@/db/schema';
import {
  deleteFocusAreaAction,
  updateFocusAreaStatusAction,
  toggleFocusAreaFeaturedAction,
} from '../../actions';

interface FocusAreasTableClientProps {
  initialFocusAreas: FocusArea[];
}

export const PARENT_PILLARS = ['Environment & Climate', 'Energy Transition'];

export default function FocusAreasTableClient({ initialFocusAreas }: FocusAreasTableClientProps) {
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(initialFocusAreas);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedFeatured, setSelectedFeatured] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'order' | 'title' | 'id'>('order');
  const [deleteModalItem, setDeleteModalItem] = useState<FocusArea | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic list of all parent pillars present in data
  const allPillars = useMemo(() => {
    const set = new Set<string>(PARENT_PILLARS);
    focusAreas.forEach((fa) => {
      if (fa.parentPillar) set.add(fa.parentPillar);
    });
    return Array.from(set);
  }, [focusAreas]);

  // Statistics
  const totalCount = focusAreas.length;
  const activeCount = focusAreas.filter((fa) => (fa.status || 'active').toLowerCase() === 'active').length;
  const envCount = focusAreas.filter((fa) => fa.parentPillar === 'Environment & Climate').length;
  const energyCount = focusAreas.filter((fa) => fa.parentPillar === 'Energy Transition').length;
  const featuredCount = focusAreas.filter((fa) => fa.isFeatured === 'yes').length;

  // Filtered & Sorted
  const filteredAreas = useMemo(() => {
    return focusAreas
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.tags && item.tags.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.parentPillar && item.parentPillar.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesPillar =
          selectedPillar === 'ALL' ||
          (item.parentPillar && item.parentPillar.toLowerCase() === selectedPillar.toLowerCase());

        const itemStatus = (item.status || 'active').toLowerCase();
        const matchesStatus =
          selectedStatus === 'ALL' ||
          itemStatus === selectedStatus.toLowerCase();

        const matchesFeatured =
          selectedFeatured === 'ALL' ||
          (selectedFeatured === 'featured' && item.isFeatured === 'yes') ||
          (selectedFeatured === 'standard' && item.isFeatured !== 'yes');

        return matchesSearch && matchesPillar && matchesStatus && matchesFeatured;
      })
      .sort((a, b) => {
        if (sortBy === 'order') {
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return (a.id || 0) - (b.id || 0);
      });
  }, [focusAreas, searchQuery, selectedPillar, selectedStatus, selectedFeatured, sortBy]);

  // Toggle Status Handler
  const handleToggleStatus = async (item: FocusArea) => {
    const newStatus = (item.status || 'active') === 'active' ? 'inactive' : 'active';
    setFocusAreas((prev) =>
      prev.map((fa) => (fa.id === item.id ? { ...fa, status: newStatus } : fa))
    );

    const res = await updateFocusAreaStatusAction(item.id, newStatus);
    if (!res.success) {
      // Revert if error
      setFocusAreas((prev) =>
        prev.map((fa) => (fa.id === item.id ? { ...fa, status: item.status } : fa))
      );
      alert('Failed to update status. Please try again.');
    }
  };

  // Toggle Featured Handler
  const handleToggleFeatured = async (item: FocusArea) => {
    const isNowFeatured = item.isFeatured !== 'yes';
    setFocusAreas((prev) =>
      prev.map((fa) => (fa.id === item.id ? { ...fa, isFeatured: isNowFeatured ? 'yes' : 'no' } : fa))
    );

    const res = await toggleFocusAreaFeaturedAction(item.id, isNowFeatured);
    if (!res.success) {
      // Revert if error
      setFocusAreas((prev) =>
        prev.map((fa) => (fa.id === item.id ? { ...fa, isFeatured: item.isFeatured } : fa))
      );
      alert('Failed to update homepage featured state.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl text-white shadow-xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Target className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              Thematic Taxonomy & Pillars
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Focus Areas & Strategic Pillars</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Manage AERC Ghana&apos;s thematic work areas, assign parent pillars, link projects and publications, and control homepage featured order without changing code.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/about#focus"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition shadow-sm"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>View on Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/admin/focus-areas/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-900/40 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Focus Area</span>
          </Link>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalCount}</div>
            <div className="text-xs font-medium text-slate-500">Total Focus Areas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-teal-800">{envCount}</div>
            <div className="text-xs font-medium text-slate-500">Environment & Climate</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-800">{energyCount}</div>
            <div className="text-xs font-medium text-slate-500">Energy Transition</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-800">{featuredCount}</div>
            <div className="text-xs font-medium text-slate-500">Homepage Featured</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5 col-span-2 md:col-span-1">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">{activeCount}</div>
            <div className="text-xs font-medium text-slate-500">Active Pillars</div>
          </div>
        </div>
      </div>

      {/* Search, Filters, and Sorting Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, pillar, summary, or associated tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Parent Pillar Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              aria-label="Filter by Strategic Pillar"
              className="text-xs sm:text-sm py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium"
            >
              <option value="ALL">All Strategic Pillars</option>
              {allPillars.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by Status"
            className="text-xs sm:text-sm py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Homepage Featured Filter */}
          <select
            value={selectedFeatured}
            onChange={(e) => setSelectedFeatured(e.target.value)}
            aria-label="Filter by Featured State"
            className="text-xs sm:text-sm py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium"
          >
            <option value="ALL">Featured: All</option>
            <option value="featured">Homepage Featured</option>
            <option value="standard">Standard Only</option>
          </select>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-1 bg-slate-50/50">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort Focus Areas"
              className="text-xs sm:text-sm py-1.5 bg-transparent border-none focus:ring-0 text-slate-700 font-medium"
            >
              <option value="order">Sort: Display Order</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="id">Sort: Date Added</option>
            </select>
          </div>
        </div>

        {/* Results counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredAreas.length}</span> of {totalCount} thematic areas
          </div>
          {(selectedPillar !== 'ALL' || selectedStatus !== 'ALL' || selectedFeatured !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedPillar('ALL');
                setSelectedStatus('ALL');
                setSelectedFeatured('ALL');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Focus Areas Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-4 px-4 w-12 text-center">#</th>
                <th className="py-4 px-4">Focus Area & Details</th>
                <th className="py-4 px-4">Parent Strategic Pillar</th>
                <th className="py-4 px-4 text-center">Featured</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Target className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
                    <p className="text-base font-semibold text-slate-700">No focus areas found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or create a new thematic focus area.</p>
                  </td>
                </tr>
              ) : (
                filteredAreas.map((item) => {
                  const isActive = (item.status || 'active').toLowerCase() === 'active';
                  const isFeatured = item.isFeatured === 'yes';
                  const isEnv = item.parentPillar === 'Environment & Climate';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                      {/* Display Order */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                          {item.displayOrder || item.id}
                        </span>
                      </td>

                      {/* Title & Icon & Summary */}
                      <td className="py-4 px-4 max-w-md">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
                            isEnv
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            <i className={`fa-solid ${item.icon || 'fa-leaf'} text-base`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/focus-areas/${item.id}/edit`}
                                className="font-bold text-slate-900 group-hover:text-emerald-700 transition"
                              >
                                {item.title}
                              </Link>
                              <Link
                                href={`/focus/${item.slug}`}
                                target="_blank"
                                title="Preview Public Page"
                                className="text-slate-400 hover:text-slate-600 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {item.summary}
                            </div>
                            {item.tags && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {item.tags.split(',').slice(0, 3).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                                {item.tags.split(',').length > 3 && (
                                  <span className="text-[10px] px-1 py-0.5 text-slate-400">
                                    +{item.tags.split(',').length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Parent Pillar Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            isEnv
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {isEnv ? <Leaf className="w-3 h-3 text-emerald-600" /> : <Zap className="w-3 h-3 text-amber-600" />}
                          {item.parentPillar}
                        </span>
                      </td>

                      {/* Featured toggle */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          title={isFeatured ? 'Featured on Homepage (Click to disable)' : 'Not featured (Click to feature)'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            isFeatured
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                          <span>{isFeatured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Status toggle */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          title={`Click to ${isActive ? 'deactivate' : 'activate'}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition border ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/focus-areas/${item.id}/edit`}
                            className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                            title="Edit Focus Area"
                          >
                            <FileEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteModalItem(item)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Focus Area"
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

      {/* Delete Confirmation Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Focus Area</h3>
            <p className="text-sm text-slate-500 mt-1.5">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-800">
                &ldquo;{deleteModalItem.title}&rdquo;
              </span>
              ? This action will remove it from the homepage, public pages, and taxonomy cross-links.
            </p>

            <form action={deleteFocusAreaAction} className="mt-6 flex items-center justify-end gap-3">
              <input type="hidden" name="id" value={deleteModalItem.id} />
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => setIsDeleting(true)}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md shadow-rose-900/20 transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
