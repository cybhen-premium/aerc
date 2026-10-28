'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  Save,
  Eye,
  FileCode,
  Image as ImageIcon,
  Calendar,
  Clock,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Tag,
  Globe,
  Share2,
  History,
  Lock,
  Unlock,
} from 'lucide-react';
import { BlogPost, ArticleRevision } from '@/db/schema';
import { createArticleAction, updateArticleAction } from '../../actions';
import { ARTICLE_CATEGORIES } from './BlogsTableClient';

interface ArticleEditorFormProps {
  initialArticle?: BlogPost | null;
  revisions?: ArticleRevision[];
  mode: 'create' | 'edit';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ArticleEditorForm({
  initialArticle,
  revisions = [],
  mode,
}: ArticleEditorFormProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [isSlugCustom, setIsSlugCustom] = useState(Boolean(initialArticle?.slug));
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [coverImage, setCoverImage] = useState(
    initialArticle?.coverImage || '/images/hero-community.jpg'
  );
  const [imageCaption, setImageCaption] = useState(initialArticle?.imageCaption || '');
  const [imageAlt, setImageAlt] = useState(initialArticle?.imageAlt || '');
  const [category, setCategory] = useState(
    initialArticle?.category || 'Climate Change'
  );
  const [tags, setTags] = useState(initialArticle?.tags || '');
  const [author, setAuthor] = useState(
    initialArticle?.author || 'AERC Editorial Team'
  );
  const [status, setStatus] = useState(initialArticle?.status || 'published');
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(
    initialArticle?.seoDescription || ''
  );
  const [changeSummary, setChangeSummary] = useState('');
  const [scheduledFor, setScheduledFor] = useState(
    initialArticle?.scheduledFor
      ? new Date(initialArticle.scheduledFor).toISOString().slice(0, 16)
      : ''
  );
  const [publishedAt, setPublishedAt] = useState(
    initialArticle?.publishedAt
      ? new Date(initialArticle.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom) {
      setSlug(slugify(val));
    }
    if (!seoTitle) {
      setSeoTitle(val);
    }
  };

  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    if (!seoDescription) {
      setSeoDescription(val.slice(0, 155));
    }
  };

  // Quick formatting toolbar insertion
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('article-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-semibold mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'create' ? 'Create New Article' : `Edit: ${initialArticle?.title}`}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Craft editorial news, attach featured media, configure SEO metadata, and manage workflows.
          </p>
        </div>

        {/* Tab Controls: Edit / Preview */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form
        action={async (formData: FormData) => {
          if (mode === 'create') {
            await createArticleAction(formData);
          } else {
            await updateArticleAction(formData);
          }
        }}
        className="space-y-8"
      >
        {mode === 'edit' && initialArticle && (
          <input type="hidden" name="id" value={initialArticle.id} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column (8 cols): Content, Excerpt, Formatting */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'edit' ? (
              <div className="space-y-6">
                {/* 1. Article Title & Slug */}
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Article Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Communities on the Frontlines: Why Local Voices Must Lead Ghana’s Climate Decisions"
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Slug Control */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        URL Slug (Permalink):
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsSlugCustom(!isSlugCustom)}
                        className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {isSlugCustom ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Unlock auto-slug</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>Customize slug</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">
                        /blog/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        required
                        value={slug}
                        onChange={(e) => {
                          setSlug(slugify(e.target.value));
                          setIsSlugCustom(true);
                        }}
                        placeholder="article-slug"
                        className="flex-1 px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Excerpt */}
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-2 shadow-xl">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Excerpt / Summary Description
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Recommended: 120–160 chars
                    </span>
                  </div>
                  <textarea
                    name="excerpt"
                    rows={3}
                    value={excerpt}
                    onChange={(e) => handleExcerptChange(e.target.value)}
                    placeholder="Provide a compelling 1–2 sentence summary of this story for cards, lists, and social shares..."
                    className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
                  />
                </div>

                {/* 3. Main Content Body with Formatting Toolbar */}
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Article Content Body <span className="text-rose-500">*</span>
                    </label>

                    {/* Quick Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => insertFormatting('## ')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold cursor-pointer"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('### ')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold cursor-pointer"
                        title="Heading 3"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('**', '**')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold cursor-pointer"
                        title="Bold Text"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('*', '*')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded italic cursor-pointer"
                        title="Italic Text"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('> ')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                        title="Blockquote"
                      >
                        &ldquo;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('- ')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                        title="Bullet List"
                      >
                        &bull; List
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('[Link Text](', ')')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                        title="Hyperlink"
                      >
                        Link
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<p>', '</p>')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer font-mono text-[10px]"
                        title="HTML Paragraph"
                      >
                        &lt;p&gt;
                      </button>
                    </div>
                  </div>

                  <textarea
                    id="article-content-area"
                    name="content"
                    required
                    rows={18}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write or paste your article content here (supports Markdown and formatted HTML)..."
                    className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
                  />
                </div>

                {/* 4. SEO Suite & SERP Snippet Preview */}
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Search Engine Optimization (SEO) &amp; Social Metadata
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        name="seoTitle"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="Custom title tag for search engines..."
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                        SEO Meta Description ({seoDescription.length}/160)
                      </label>
                      <input
                        type="text"
                        name="seoDescription"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="Search engine snippet summary..."
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Google SERP Snippet Preview */}
                  <div className="mt-3 p-4 rounded-xl bg-slate-950/90 border border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                      Google Search Result Snippet Preview:
                    </span>
                    <div className="text-xs font-medium text-blue-400 hover:underline cursor-pointer truncate">
                      {seoTitle || title || 'Article Title'} | AERC Ghana
                    </div>
                    <div className="text-[11px] text-emerald-500 font-mono truncate">
                      https://aercghana.org/blog/{slug || 'article-slug'}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {seoDescription ||
                        excerpt ||
                        'Read the latest environmental insights, climate justice campaigns, and youth policy advocacy from AERC Ghana.'}
                    </div>
                  </div>
                </div>

                {/* 5. Revision Summary (Only shown in Edit mode) */}
                {mode === 'edit' && (
                  <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-2 shadow-xl">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Revision Note / Change Summary
                    </label>
                    <input
                      type="text"
                      name="changeSummary"
                      value={changeSummary}
                      onChange={(e) => setChangeSummary(e.target.value)}
                      placeholder="e.g. Updated statistical figures on renewable energy financing and adjusted title"
                      className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-slate-500">
                      Logged in the audit history to track editorial modifications.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Live Public Preview Tab */
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
                <div className="border-b border-slate-800 pb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                    {title || 'Untitled Article'}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>By {author || 'AERC Editorial Team'}</span>
                    <span>&bull;</span>
                    <span>{new Date(publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {coverImage && (
                  <div className="rounded-2xl overflow-hidden max-h-[380px] bg-slate-950">
                    <img
                      src={coverImage}
                      alt={imageAlt || title}
                      className="w-full h-full object-cover"
                    />
                    {imageCaption && (
                      <p className="text-[11px] text-slate-400 italic mt-2 px-2">
                        {imageCaption}
                      </p>
                    )}
                  </div>
                )}

                {excerpt && (
                  <div className="p-4 rounded-xl bg-slate-950 border-l-4 border-emerald-500 text-sm font-medium text-slate-200 italic">
                    {excerpt}
                  </div>
                )}

                <div
                  className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            )}
          </div>

          {/* Sidebar Column (4 cols): Media, Organization, Workflow */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Publishing & Editorial Workflow */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Save className="w-4 h-4 text-emerald-400" />
                <span>Editorial Workflow</span>
              </h3>

              {/* Status Select */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Publication Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="published">Publish Immediately (Live)</option>
                  <option value="draft">Save as Draft (Unpublished)</option>
                  <option value="pending">Submit for Approval (Pending)</option>
                  <option value="archived">Archive Article (Private)</option>
                </select>
              </div>

              {/* Publication Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Publish Date
                </label>
                <input
                  type="date"
                  name="publishedAt"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Scheduled Publication (Optional) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Schedule Future Release (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="scheduledFor"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Save / Submit Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {mode === 'create' ? 'Create & Publish Article' : 'Save Changes'}
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Featured Image & Accessibility */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Featured Image &amp; Media</span>
              </h3>

              {/* Cover Image Preview */}
              <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img
                  src={coverImage || '/images/hero-community.jpg'}
                  alt={imageAlt || 'Cover Preview'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  name="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="/images/... or https://..."
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Alternative Text (Image Alt)
                </label>
                <input
                  type="text"
                  name="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Accessible description of the image..."
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Image Caption
                </label>
                <input
                  type="text"
                  name="imageCaption"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Caption displayed below image..."
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 3. Categories & Tags */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>Categories &amp; Taxonomy</span>
              </h3>

              {/* Category Select */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Primary Category
                </label>
                <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {ARTICLE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. #ClimateAction, #Ghana, #Renewables"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Author Byline */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Author Information
                </label>
                <input
                  type="text"
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Desmond Sena Kofi Foe"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 4. Revision History (If editing) */}
            {mode === 'edit' && revisions.length > 0 && (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                  <History className="w-4 h-4 text-amber-400" />
                  <span>Revision History ({revisions.length})</span>
                </h3>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-200">
                          {rev.revisedBy || 'Admin'}
                        </span>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-emerald-400 mt-0.5 truncate">
                        {rev.changeSummary || 'Content modified'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
