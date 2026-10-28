'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  Save,
  Eye,
  Layers,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Link2,
  Trash2,
  History,
  CheckCircle2,
  AlertCircle,
  Star,
  ExternalLink,
  BookOpen,
  Download,
  Lock,
  Unlock,
  Upload,
  User,
  Tag,
  Search,
} from 'lucide-react';
import { Publication, PublicationRevision } from '@/db/schema';
import { createPublicationAction, updatePublicationAction } from '../../actions';
import { PUBLICATION_CATEGORIES } from './PublicationsTableClient';

interface PublicationEditorFormProps {
  initialPublication?: Publication | null;
  revisions?: PublicationRevision[];
  isNew?: boolean;
}

const AUTHOR_PRESETS = [
  'AERC Research & Policy Team',
  'Desmond Sena Kofi Foe & AERC Energy Unit',
  'AERC Editorial & Communications Desk',
  'AERC Secretariat',
  'AERC Legal & Governance Desk',
  'AERC Biodiversity & Agroecology Unit',
  'AERC Strategic Policy Unit',
  'Youth4NDCs Secretariat',
  'AERC & Fossil Free ECAs Campaign',
];

const DOCUMENT_PRESETS = [
  { label: 'AERC 2025 Annual Report (13.9 MB)', url: '/documents/AERC-2025-ANNUAL-REPORT-.pdf', size: '13.9 MB', format: 'PDF' },
  { label: 'Powering Change: Policy Brief (2.8 MB)', url: '/documents/Policy-Brief-Powering-Change.pdf', size: '2.8 MB', format: 'PDF' },
  { label: 'Impact Newsletter May–Aug 2026 (16.5 MB)', url: '/documents/AERC-SECOND-EDITION-IMPACT-NEWSLETTER-MAY-AUGUST-2026.pdf', size: '16.5 MB', format: 'PDF' },
  { label: 'Q1 Newsletter (7.4 MB)', url: '/documents/Q1-NEWSLETTER-1final.pdf', size: '7.4 MB', format: 'PDF' },
  { label: 'Press Release: EPA Styrofoam Ban (0.9 MB)', url: '/documents/AERC-PRESS-RELEASE-ON-EPA-STYROFOAM-BAN.pdf', size: '0.9 MB', format: 'PDF' },
  { label: 'Press Release: Forest Reserves & Galamsey (0.1 MB)', url: '/documents/AERC-PRESS-RELEASE-FORESTS-MINING.pdf', size: '0.1 MB', format: 'PDF' },
  { label: 'Locked Out of a Just Transition (6.7 MB)', url: '/documents/Locked-Out-of-A-Just-Transition-Fossil-Fuel-Financing.pdf', size: '6.7 MB', format: 'PDF' },
  { label: 'A Just Energy Transition for Africa (1.1 MB)', url: '/documents/A-Just-Energy-Transition-for-Africa.pdf', size: '1.1 MB', format: 'PDF' },
  { label: 'From Access to Utilization: Rural Energy (9.2 MB)', url: '/documents/FROM-ACCESS-TO-UTILIZATION.pdf', size: '9.2 MB', format: 'PDF' },
];

const IMAGE_PRESETS = [
  '/images/bettering-tomorrow.jpg',
  '/images/clean-cook.jpg',
  '/images/hero-community.jpg',
  '/images/hero-bg.jpg',
  '/images/projects/garden.jpg',
  '/images/projects/sdg.jpg',
  '/images/projects/clean-cook.jpg',
  '/images/projects/solar.jpg',
  '/images/projects/ticking.jpg',
  '/images/projects/youth4ndcs.jpg',
];

export default function PublicationEditorForm({
  initialPublication,
  revisions = [],
  isNew = false,
}: PublicationEditorFormProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'revisions'>('edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core fields
  const [title, setTitle] = useState(initialPublication?.title || '');
  const [slug, setSlug] = useState(initialPublication?.slug || '');
  const [slugLocked, setSlugLocked] = useState(!isNew);
  const [category, setCategory] = useState(initialPublication?.category || PUBLICATION_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [author, setAuthor] = useState(initialPublication?.author || 'AERC Research & Policy Team');
  const [summary, setSummary] = useState(initialPublication?.summary || '');
  const [description, setDescription] = useState(initialPublication?.description || '');

  // File and Links
  const [downloadUrl, setDownloadUrl] = useState(
    initialPublication?.downloadUrl || '/documents/AERC-2025-ANNUAL-REPORT-.pdf'
  );
  const [fileType, setFileType] = useState(initialPublication?.fileType || 'PDF');
  const [fileSize, setFileSize] = useState(initialPublication?.fileSize || '2.8 MB');
  const [externalUrl, setExternalUrl] = useState(initialPublication?.externalUrl || '');
  const [coverImage, setCoverImage] = useState(
    initialPublication?.coverImage || '/images/bettering-tomorrow.jpg'
  );

  // Publishing Controls
  const [status, setStatus] = useState(initialPublication?.status || 'published');
  const [isFeatured, setIsFeatured] = useState(initialPublication?.isFeatured === 'yes');
  const [publishedAt, setPublishedAt] = useState(() => {
    if (initialPublication?.publishedAt) {
      return new Date(initialPublication.publishedAt).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });

  // SEO & Audit
  const [seoTitle, setSeoTitle] = useState(initialPublication?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialPublication?.seoDescription || '');
  const [changeSummary, setChangeSummary] = useState('');

  // Handle title changes to auto-generate slug if unlocked
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugLocked) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const effectiveCategory = category === 'CUSTOM' ? customCategory : category;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* TOP BAR / BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/admin/publications" className="hover:text-emerald-400 transition-colors">
              Publications
            </Link>
            <span>/</span>
            <span className="text-slate-200">{isNew ? 'New Publication' : 'Edit Document'}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            {isNew ? 'Upload & Register Publication' : `Edit: ${initialPublication?.title}`}
          </h1>
          <p className="text-sm text-slate-400">
            {isNew
              ? 'Publish an official AERC Ghana research report, policy brief, newsletter, or dataset.'
              : 'Update publication metadata, download links, summaries, and revision notes.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/publications"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>
          <button
            type="submit"
            form="publication-editor-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-xs shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Document...' : isNew ? 'Publish Document' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
            activeTab === 'edit'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Document Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Public Preview</span>
        </button>

        {!isNew && (
          <button
            type="button"
            onClick={() => setActiveTab('revisions')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'revisions'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit History ({revisions.length})</span>
          </button>
        )}
      </div>

      {/* TAB 1: FORM EDIT */}
      {activeTab === 'edit' && (
        <form
          id="publication-editor-form"
          action={isNew ? createPublicationAction : updatePublicationAction}
          onSubmit={() => setIsSubmitting(true)}
          className="space-y-6"
        >
          {!isNew && initialPublication && (
            <input type="hidden" name="id" value={initialPublication.id} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MAIN CONTENT (LEFT 2 COLUMNS) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Core Information Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  General Document Information
                </h3>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Publication Title <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., AERC 2025 Annual Report: Mobilizing Grassroots Climate Resilience"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  />
                </div>

                {/* Slug with Lock/Unlock */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      URL Slug
                    </label>
                    <button
                      type="button"
                      onClick={() => setSlugLocked(!slugLocked)}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                    >
                      {slugLocked ? (
                        <>
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-400">Locked</span> (click to edit)
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Unlocked</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    name="slug"
                    value={slug}
                    readOnly={slugLocked}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="aerc-2025-annual-report"
                    className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2 text-xs font-mono transition-all ${
                      slugLocked
                        ? 'text-slate-400 border-slate-800 cursor-not-allowed bg-slate-950/40'
                        : 'text-emerald-400 border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500'
                    }`}
                  />
                </div>

                {/* Category & Author Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Category Selector */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Publication Category <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                    >
                      {PUBLICATION_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="CUSTOM">Custom Write-in...</option>
                    </select>

                    {category === 'CUSTOM' && (
                      <input
                        type="text"
                        placeholder="Enter custom publication category..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="mt-2 w-full bg-slate-950/80 border border-emerald-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    )}
                    <input type="hidden" name="category" value={effectiveCategory} />
                  </div>

                  {/* Author / Research Unit */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Author / Research Unit
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. AERC Research & Policy Team"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {AUTHOR_PRESETS.slice(0, 3).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAuthor(preset)}
                          className="text-[10px] bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 px-2 py-0.5 rounded transition-colors"
                        >
                          {preset.split('&')[0].trim()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Executive Summary / Teaser
                  </label>
                  <textarea
                    name="summary"
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="A concise 1-2 sentence overview shown on resource cards and social previews..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all leading-relaxed"
                  />
                </div>

                {/* Full Description / Abstract */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Description / Abstract
                  </label>
                  <textarea
                    name="description"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a comprehensive abstract, key policy takeaways, methodology, or background context..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all leading-relaxed"
                  />
                </div>
              </div>

              {/* Document Download & External Links Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Download className="w-4 h-4 text-emerald-400" />
                  Document Link & Files
                </h3>

                {/* Download URL */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Document File Path or Download URL <span className="text-emerald-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="downloadUrl"
                      required
                      value={downloadUrl}
                      onChange={(e) => setDownloadUrl(e.target.value)}
                      placeholder="/documents/AERC-2025-ANNUAL-REPORT-.pdf"
                      className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Test</span>
                      </a>
                    )}
                  </div>

                  {/* Document Presets */}
                  <div className="mt-2 space-y-1">
                    <span className="text-[11px] text-slate-400">Available authentic PDFs in archive:</span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {DOCUMENT_PRESETS.map((doc) => (
                        <button
                          key={doc.url}
                          type="button"
                          onClick={() => {
                            setDownloadUrl(doc.url);
                            setFileSize(doc.size);
                            setFileType(doc.format);
                          }}
                          className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                            downloadUrl === doc.url
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {doc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Format and Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      File Format
                    </label>
                    <select
                      name="fileType"
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="DOCX">Word Document (.docx)</option>
                      <option value="XLSX">Spreadsheet (.xlsx)</option>
                      <option value="ZIP">Archive (.zip)</option>
                      <option value="LINK">External Web Link</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      File Size
                    </label>
                    <input
                      type="text"
                      name="fileSize"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      placeholder="e.g., 2.8 MB"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* External Resource Link */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    External Resource / Partner Repository Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="externalUrl"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://www.fao.org/3/cb9360en/cb9360en.pdf or partner repository"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Optional link to secondary repositories like FAO, Zenodo, SSRN, or academic journals.
                  </span>
                </div>
              </div>

              {/* SEO Metadata Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  SEO & Search Metadata
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title ? `${title} | AERC Ghana` : 'Custom search engine title...'}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    SEO Meta Description
                  </label>
                  <textarea
                    name="seoDescription"
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={summary || 'Search engine summary snippet (140-160 characters)...'}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Audit Trail Note (When editing) */}
              {!isNew && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <History className="w-4 h-4 text-emerald-400" />
                    Revision Log Note
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Summary of Changes Made in this Revision
                    </label>
                    <input
                      type="text"
                      name="changeSummary"
                      value={changeSummary}
                      onChange={(e) => setChangeSummary(e.target.value)}
                      placeholder="e.g. Updated download link, revised executive summary, changed author attribution"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR CONTROLS (RIGHT 1 COLUMN) */}
            <div className="space-y-6">
              {/* Publication Status & Controls */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Publication Status
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="published">Published (Visible Publicly)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="archived">Archived (Deprioritized)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    name="publishedAt"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      value="yes"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="mt-0.5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        Featured Publication
                      </span>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                        Highlight this document at the top of the Resources directory and featured widgets.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : isNew ? 'Publish Document' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

              {/* Cover Image Upload & Selection */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  Cover Image / Thumbnail
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    name="coverImage"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="/images/bettering-tomorrow.jpg"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Cover Image Live Preview */}
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[3/4] flex items-center justify-center">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-500">
                      <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">No cover image selected</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono border border-slate-800">
                    Preview
                  </div>
                </div>

                {/* Preset image suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400">Quick preset cover images:</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {IMAGE_PRESETS.map((img) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setCoverImage(img)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          coverImage === img ? 'border-emerald-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: LIVE PUBLIC PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Live preview of how this publication card renders on the public Resources directory.
            </span>
            <span className="text-emerald-400 font-medium">Status: {status}</span>
          </div>

          {/* Featured Showcase Preview */}
          {isFeatured && (
            <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                Featured Highlight
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="md:col-span-1">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 aspect-[3/4] bg-slate-950">
                    <img
                      src={coverImage || '/images/bettering-tomorrow.jpg'}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-3 space-y-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {effectiveCategory}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {title || 'Document Title Preview'}
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {summary || description || 'Detailed publication summary will appear here.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                    <span>By: <strong className="text-white">{author}</strong></span>
                    <span>•</span>
                    <span>{fileType} ({fileSize})</span>
                    <span>•</span>
                    <span>Published: {publishedAt}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-3">
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-lg shadow-emerald-500/30 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download {fileType}</span>
                    </a>
                    {externalUrl && (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>External Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Card Preview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                <img
                  src={coverImage || '/images/bettering-tomorrow.jpg'}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {effectiveCategory}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {author}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {title || 'Publication Title'}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {summary || description || 'Publication summary overview.'}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="font-semibold text-slate-700">{fileType} • {fileSize}</span>
                  <span>•</span>
                  <span>{new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto flex-shrink-0">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>External</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT REVISIONS */}
      {activeTab === 'revisions' && !isNew && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <History className="w-4 h-4 text-emerald-400" />
            Revision Audit Trail
          </h3>

          {revisions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No previous revisions recorded for this publication yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {revisions.map((rev) => (
                <div key={rev.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-white">{rev.changeSummary || 'Revision update'}</p>
                    <p className="text-slate-400 mt-0.5">
                      Title: <span className="text-slate-300">{rev.title}</span> • Category: <span className="text-emerald-400">{rev.category}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Download: {rev.downloadUrl || '—'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-slate-300 font-medium block">
                      {rev.revisedBy || 'Admin'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(rev.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
