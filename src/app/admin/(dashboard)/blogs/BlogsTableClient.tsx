'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  Tag,
  ExternalLink,
  Plus,
  FileEdit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Archive,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { BlogPost } from '@/db/schema';
import { deleteArticleAction, updateArticleStatusAction } from '../../actions';

interface BlogsTableClientProps {
  initialBlogs: BlogPost[];
}

export const ARTICLE_CATEGORIES = [
  'Climate Change',
  'Environmental Protection',
  'Energy Transition',
  'Community Development',
  'Advocacy and Campaigns',
  'Press Releases',
  'Organizational News',
  'Events and Announcements',
];

export default function BlogsTableClient({ initialBlogs }: BlogsTableClientProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Stats calculation
  const totalCount = blogs.length;
  const publishedCount = blogs.filter((b) => (b.status || 'published') === 'published').length;
  const draftCount = blogs.filter((b) => b.status === 'draft').length;
  const pendingCount = blogs.filter((b) => b.status === 'pending').length;

  // Filtered & Sorted blogs
  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        const matchesSearch =
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (blog.author && blog.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (blog.tags && blog.tags.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'ALL' ||
          (blog.category && blog.category.toLowerCase() === selectedCategory.toLowerCase());

        const blogStatus = blog.status || 'published';
        const matchesStatus =
          selectedStatus === 'ALL' || blogStatus.toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [blogs, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await updateArticleStatusAction(id, newStatus);
    if (res.success) {
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Editorial Content Management</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Articles &amp; News Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage, publish, schedule, and review climate justice news, press releases, and editorial stories.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Article</span>
        </Link>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Total Articles</div>
          <div className="text-2xl font-extrabold text-white mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">In database catalog</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-medium text-emerald-400">Published Live</div>
          <div className="text-2xl font-extrabold text-white mt-1">{publishedCount}</div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5">Visible to public visitors</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-medium text-purple-400">Drafts in Progress</div>
          <div className="text-2xl font-extrabold text-white mt-1">{draftCount}</div>
          <div className="text-[11px] text-purple-500/80 mt-0.5">Unpublished works</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-medium text-amber-400">Pending Approval</div>
          <div className="text-2xl font-extrabold text-white mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-500/80 mt-0.5">Awaiting editorial sign-off</div>
        </div>
      </div>

      {/* 3. Search, Filter, and Sort Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, author, keyword, or tags..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {ARTICLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending Approval</option>
              <option value="archived">Archived</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase mr-1">
            Category Shortcuts:
          </span>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          {ARTICLE_CATEGORIES.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Articles Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredBlogs.length}</strong> of{' '}
            {totalCount} articles
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No articles match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or create a new article.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filteredBlogs.map((blog) => {
              const status = blog.status || 'published';
              const statusStyles: Record<string, string> = {
                published: 'bg-emerald-950 text-emerald-400 border-emerald-800',
                draft: 'bg-purple-950 text-purple-400 border-purple-800',
                pending: 'bg-amber-950 text-amber-400 border-amber-800',
                archived: 'bg-slate-800 text-slate-400 border-slate-700',
              };

              return (
                <div
                  key={blog.id || blog.slug}
                  className="p-5 hover:bg-slate-850/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Featured Image Thumbnail */}
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 shrink-0 relative">
                      <img
                        src={blog.coverImage || '/images/hero-community.jpg'}
                        alt={blog.imageAlt || blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            statusStyles[status] || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {blog.category || 'Climate Change'}
                        </span>
                        {blog.tags && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                            {blog.tags}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors line-clamp-1">
                        <Link href={`/admin/blogs/${blog.id}/edit`}>{blog.title}</Link>
                      </h3>

                      {blog.excerpt && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-3xl">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-400">
                        <span>
                          Author: <strong className="text-slate-300">{blog.author || 'AERC Team'}</strong>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Published {new Date(blog.publishedAt).toLocaleDateString()}
                        </span>
                        {blog.scheduledFor && (
                          <>
                            <span>&bull;</span>
                            <span className="text-amber-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Scheduled for {new Date(blog.scheduledFor).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    {/* Status Toggle Dropdown */}
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(blog.id, e.target.value)}
                      className="py-1.5 px-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="published">Publish</option>
                      <option value="draft">Set to Draft</option>
                      <option value="pending">Pending Approval</option>
                      <option value="archived">Archive</option>
                    </select>

                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="Edit Article"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>

                    <Link
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="Preview Live Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Live</span>
                    </Link>

                    <form action={deleteArticleAction} onSubmit={(e) => {
                      if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) {
                        e.preventDefault();
                      }
                    }}>
                      <input type="hidden" name="id" value={blog.id} />
                      <button
                        type="submit"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
