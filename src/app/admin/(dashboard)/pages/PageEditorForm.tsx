'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  ArrowLeft,
  Save,
  Eye,
  Layers,
  Sparkles,
  Search,
  Calendar,
  Image as ImageIcon,
  Video,
  Link2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  History,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock,
  Unlock,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { SitePage, PageRevision } from '@/db/schema';
import { createPageAction, updatePageAction } from '../../actions';

interface PageSection {
  id: string;
  heading: string;
  subtitle?: string;
  body: string;
  mediaType: 'image' | 'video' | 'none';
  mediaUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  style: 'default' | 'emerald' | 'dark' | 'card';
}

interface PageEditorFormProps {
  initialPage?: SitePage | null;
  revisions?: PageRevision[];
  isNew?: boolean;
}

export default function PageEditorForm({
  initialPage,
  revisions = [],
  isNew = false,
}: PageEditorFormProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'revisions'>('edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core fields
  const [title, setTitle] = useState(initialPage?.title || '');
  const [slug, setSlug] = useState(initialPage?.slug || '');
  const [slugLocked, setSlugLocked] = useState(!isNew);
  const [description, setDescription] = useState(initialPage?.description || '');
  const [pageType, setPageType] = useState(initialPage?.pageType || (isNew ? 'standard' : 'standard'));

  // Hero section
  const [heroHeadline, setHeroHeadline] = useState(initialPage?.heroHeadline || '');
  const [heroSubtitle, setHeroSubtitle] = useState(initialPage?.heroSubtitle || '');
  const [heroImage, setHeroImage] = useState(initialPage?.heroImage || '');
  const [heroCtaText, setHeroCtaText] = useState(initialPage?.heroCtaText || '');
  const [heroCtaLink, setHeroCtaLink] = useState(initialPage?.heroCtaLink || '');

  // Body content
  const [content, setContent] = useState(initialPage?.content || '');

  // Dynamic Sections
  const parsedSections: PageSection[] = (() => {
    if (!initialPage?.sectionsJson) return [];
    try {
      return JSON.parse(initialPage.sectionsJson);
    } catch {
      return [];
    }
  })();
  const [sections, setSections] = useState<PageSection[]>(parsedSections);

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialPage?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialPage?.seoDescription || '');

  // Publishing & Approval Workflow
  const [status, setStatus] = useState(initialPage?.status || 'published');
  const [scheduledFor, setScheduledFor] = useState(
    initialPage?.scheduledFor
      ? new Date(initialPage.scheduledFor).toISOString().slice(0, 16)
      : ''
  );
  const [changeSummary, setChangeSummary] = useState('');

  // Auto-generate slug when creating a new page
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew && !slugLocked) {
      const generated =
        '/' +
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Section builders
  const addSection = (presetStyle: 'default' | 'emerald' | 'dark' | 'card' = 'default') => {
    const newSec: PageSection = {
      id: `sec_${Date.now()}`,
      heading: 'New Section Heading',
      subtitle: '',
      body: 'Add your descriptive section content or paragraph here.',
      mediaType: 'none',
      mediaUrl: '',
      buttonText: '',
      buttonLink: '',
      style: presetStyle,
    };
    setSections((prev) => [...prev, newSec]);
  };

  const updateSection = (id: string, updates: Partial<PageSection>) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
    );
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((sec) => sec.id !== id));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setSections(reordered);
  };

  const isStructuredPage =
    pageType === 'structured' ||
    ['/', '/projects', '/resources', '/blog', '/team'].includes(slug);

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" />
              <span>{isNew ? 'Page Creator' : 'Page Editor & Customizer'}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isNew ? 'Create New Website Page' : `Edit: ${initialPage?.title || 'Page'}`}
            </h1>
            {!isNew && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
                  {initialPage?.slug}
                </span>
                <span className="text-xs text-slate-400">
                  &bull; Last modified by {initialPage?.lastUpdatedBy || 'Admin'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Tabs & Preview Button */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-850 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'edit'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            {!isNew && (
              <button
                type="button"
                onClick={() => setActiveTab('revisions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'revisions'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History ({revisions.length})</span>
              </button>
            )}
          </div>

          {!isNew && initialPage?.slug && (
            <Link
              href={initialPage.slug}
              target="_blank"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Open Live URL</span>
            </Link>
          )}
        </div>
      </div>

      {/* Structured Page Callout */}
      {isStructuredPage && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/50 via-slate-900 to-cyan-950/40 border border-teal-800/40 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-teal-900/40 text-teal-300 border border-teal-700/50 shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-teal-300 font-semibold">Structured Module Integration:</strong> This page (<code>{slug}</code>) automatically feeds structured records from its companion database module (e.g. Projects, Publications, News, or Team Members). You can use this editor to customize its hero title, banner background image, custom interactive story sections, action buttons, and SEO metadata.
          </div>
        </div>
      )}

      {/* 2. Main Tabbed Content Area */}
      {activeTab === 'edit' && (
        <form
          action={async (formData) => {
            setIsSubmitting(true);
            try {
              if (isNew) {
                await createPageAction(formData);
              } else {
                await updatePageAction(formData);
              }
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Hidden Inputs */}
          {!isNew && initialPage && (
            <input type="hidden" name="id" value={initialPage.id} />
          )}
          <input
            type="hidden"
            name="sectionsJson"
            value={JSON.stringify(sections)}
          />

          {/* Left & Middle Columns: Main Content, Hero, Sections Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card A: Page Identity & Route */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Page Route & Navigation Identity
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Required</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Page Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Our Mission & Vision"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                  />
                </div>

                {/* Slug */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      URL Slug *
                    </label>
                    <button
                      type="button"
                      onClick={() => setSlugLocked(!slugLocked)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {slugLocked ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Unlock</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>Lock</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="slug"
                      required
                      readOnly={slugLocked}
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="/mission"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all ${
                        slugLocked
                          ? 'bg-slate-800/40 border-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-800/90 border-slate-700 focus:ring-1 focus:ring-cyan-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Page Type Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Page Type Classification
                  </label>
                  <select
                    name="pageType"
                    value={pageType}
                    onChange={(e) => setPageType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="standard">Standard Content Page</option>
                    <option value="structured">Structured Dynamic Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Short Meta Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description for internal directory & cards..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Card B: Hero Header Customizer */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Hero Section Customizer
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Top-of-Page Visual Banner</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    name="heroHeadline"
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    placeholder={title || 'Inspiring headline for the page...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hero Background Image or Video URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="heroImage"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      placeholder="/images/hero-community.jpg or https://..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hero Subtitle / Introductory Paragraph
                </label>
                <textarea
                  name="heroSubtitle"
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Empowering grassroots African communities through evidence-based ecological stewardship..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Hero Call to Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="heroCtaText"
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    placeholder="e.g. Join the Movement"
                    className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Primary CTA Button Link URL
                  </label>
                  <div className="relative">
                    <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="heroCtaLink"
                      value={heroCtaLink}
                      onChange={(e) => setHeroCtaLink(e.target.value)}
                      placeholder="/volunteer or /donate"
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card C: Main Content Body (Rich Markdown/HTML) */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Main Page Body Content
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Headings, Paragraphs & Formatted Copy</span>
              </div>

              <div>
                <textarea
                  name="content"
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter detailed page content, markdown, or HTML copy here...

## Key Strategic Pillars
- Sustainable Agribusiness
- Renewable Clean Energy
- Youth Climate Ambassadors"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-850 border border-slate-700 font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Card D: Dynamic Interactive Page Sections Builder */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Dynamic Page Sections ({sections.length})
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add custom sections with headings, paragraphs, images/videos, and action buttons.
                  </p>
                </div>

                {/* Add Section Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addSection('default')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-semibold border border-cyan-800/60 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('emerald')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-800/60 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Emerald Card</span>
                  </button>
                </div>
              </div>

              {sections.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30">
                  <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No custom sections added yet.</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click "+ Add Section" above to construct modular interactive blocks with media and action buttons.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-3 relative group"
                    >
                      {/* Section Toolbar */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-cyan-400 flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white">
                            Section {idx + 1}: {sec.heading || 'Untitled'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Style Picker */}
                          <select
                            value={sec.style}
                            onChange={(e) => updateSection(sec.id, { style: e.target.value as any })}
                            className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-medium text-slate-300 focus:outline-none"
                          >
                            <option value="default">Default Style</option>
                            <option value="emerald">Emerald Tint</option>
                            <option value="dark">Dark Slate</option>
                            <option value="card">Bordered Card</option>
                          </select>

                          {/* Reordering */}
                          <button
                            type="button"
                            onClick={() => moveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move section up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(idx, 'down')}
                            disabled={idx === sections.length - 1}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move section down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => removeSection(sec.id)}
                            className="p-1 rounded bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-800/50"
                            title="Remove section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Headings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Section Heading
                          </label>
                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) => updateSection(sec.id, { heading: e.target.value })}
                            placeholder="e.g. Community Capacity Building"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Section Subtitle / Eyebrow (Optional)
                          </label>
                          <input
                            type="text"
                            value={sec.subtitle || ''}
                            onChange={(e) => updateSection(sec.id, { subtitle: e.target.value })}
                            placeholder="e.g. Field Implementation Track"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      {/* Body Copy */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Section Body Copy
                        </label>
                        <textarea
                          rows={3}
                          value={sec.body}
                          onChange={(e) => updateSection(sec.id, { body: e.target.value })}
                          placeholder="Write the paragraph or bullet points for this section..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                        />
                      </div>

                      {/* Media & Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Media Type
                          </label>
                          <select
                            value={sec.mediaType}
                            onChange={(e) => updateSection(sec.id, { mediaType: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                          >
                            <option value="none">No Media</option>
                            <option value="image">Image Attachment</option>
                            <option value="video">Video Embed / URL</option>
                          </select>
                        </div>

                        {sec.mediaType !== 'none' && (
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              {sec.mediaType === 'image' ? 'Image URL' : 'Video URL (YouTube/Vimeo/MP4)'}
                            </label>
                            <input
                              type="text"
                              value={sec.mediaUrl || ''}
                              onChange={(e) => updateSection(sec.id, { mediaUrl: e.target.value })}
                              placeholder={
                                sec.mediaType === 'image'
                                  ? '/images/gallery-solar.jpg or https://...'
                                  : 'https://www.youtube.com/watch?v=...'
                              }
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        )}
                      </div>

                      {/* Section CTA Button */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Action Button Text (Optional)
                          </label>
                          <input
                            type="text"
                            value={sec.buttonText || ''}
                            onChange={(e) => updateSection(sec.id, { buttonText: e.target.value })}
                            placeholder="e.g. Read Field Documentation"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Action Button Link URL
                          </label>
                          <input
                            type="text"
                            value={sec.buttonLink || ''}
                            onChange={(e) => updateSection(sec.id, { buttonLink: e.target.value })}
                            placeholder="/projects or /resources"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Publishing, Approval, SEO, Revision Note */}
          <div className="space-y-6">
            {/* Card 1: Publication & Approval Workflow */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Publishing & Visibility
                </h2>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Page Visibility Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors ${
                    status === 'published'
                      ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                      : status === 'draft'
                      ? 'bg-amber-950/90 text-amber-400 border-amber-800'
                      : status === 'pending'
                      ? 'bg-blue-950/90 text-blue-400 border-blue-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <option value="published">Published (Visible Publicly)</option>
                  <option value="draft">Draft (Private to Admin)</option>
                  <option value="pending">Pending Approval Review</option>
                  <option value="archived">Archived (Unpublished)</option>
                </select>
              </div>

              {/* Schedule Publication */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Schedule Publication (Optional)</span>
                </label>
                <input
                  type="datetime-local"
                  name="scheduledFor"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Specify future date/time for automated publication.
                </p>
              </div>

              {/* Revision Change Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Revision Note / Summary of Changes
                </label>
                <input
                  type="text"
                  name="changeSummary"
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder={
                    isNew
                      ? 'Initial page setup'
                      : 'e.g. Updated strategic objectives & added photo section'
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving Page Changes...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isNew ? 'Create & Publish Page' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card 2: SEO Metadata & Google SERP Simulator */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Search className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  SEO & Search Metadata
                </h2>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    SEO Meta Title
                  </label>
                  <span className={`text-[10px] ${seoTitle.length > 60 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                    {seoTitle.length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  name="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title ? `${title} | AERC Ghana` : 'AERC Ghana - Community Ecological Action'}
                  className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    SEO Meta Description
                  </label>
                  <span className={`text-[10px] ${seoDescription.length > 160 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                    {seoDescription.length}/160 chars
                  </span>
                </div>
                <textarea
                  name="seoDescription"
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={description || 'AERC Ghana works at the grassroots level to protect natural ecosystems...'}
                  className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {/* Google SERP Simulator */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Search className="w-3 h-3 text-cyan-500" />
                  <span>Google Search Preview</span>
                </div>
                <div className="text-xs text-slate-400 truncate">
                  https://aercghana.org{slug || '/page'}
                </div>
                <div className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer truncate">
                  {seoTitle || (title ? `${title} | AERC Ghana` : 'Page Title | AERC Ghana')}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {seoDescription ||
                    description ||
                    heroSubtitle ||
                    'African Environmental Research and Consulting Group (AERC Ghana) drives sustainable development, conservation, and climate resilience.'}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 3. Live Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
              <Eye className="w-4 h-4" />
              <span>Interactive Live Preview Simulator</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
            >
              Return to Editor
            </button>
          </div>

          {/* Rendered Simulated Public Page */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Simulated Hero */}
            <div
              className="relative py-24 px-6 sm:px-12 bg-gradient-to-br from-emerald-950 via-slate-900 to-cyan-950 text-center overflow-hidden"
              style={
                heroImage
                  ? {
                      backgroundImage: `linear-gradient(rgba(10, 15, 29, 0.85), rgba(10, 15, 29, 0.95)), url(${heroImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              <div className="max-w-4xl mx-auto space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {title || 'Page Title'}
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {heroHeadline || title || 'Hero Headline'}
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  {heroSubtitle || description || 'Hero subtitle or introductory summary.'}
                </p>

                {heroCtaText && (
                  <div className="pt-4">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 cursor-pointer">
                      <span>{heroCtaText}</span>
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Body */}
            {content && (
              <div className="py-12 px-6 sm:px-12 max-w-4xl mx-auto text-slate-300 text-sm leading-relaxed whitespace-pre-wrap border-b border-slate-800/80">
                {content}
              </div>
            )}

            {/* Simulated Custom Dynamic Sections */}
            {sections.length > 0 && (
              <div className="py-12 px-6 sm:px-12 max-w-5xl mx-auto space-y-8">
                {sections.map((sec, i) => (
                  <div
                    key={sec.id}
                    className={`p-8 rounded-3xl transition-all ${
                      sec.style === 'emerald'
                        ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-800/50'
                        : sec.style === 'card'
                        ? 'bg-slate-900/90 border border-slate-800 shadow-xl'
                        : 'bg-slate-900/50 border border-slate-800/60'
                    }`}
                  >
                    <div className="max-w-3xl">
                      {sec.subtitle && (
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                          {sec.subtitle}
                        </div>
                      )}
                      <h2 className="text-2xl font-bold text-white mb-3">
                        {sec.heading}
                      </h2>
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap mb-4">
                        {sec.body}
                      </p>

                      {sec.mediaUrl && (
                        <div className="my-4 rounded-2xl overflow-hidden border border-slate-800 max-w-lg">
                          {sec.mediaType === 'image' ? (
                            <img
                              src={sec.mediaUrl}
                              alt={sec.heading}
                              className="w-full h-auto object-cover"
                            />
                          ) : (
                            <div className="p-4 bg-slate-950 text-xs text-cyan-400 flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              <span>Embedded Video Stream: {sec.mediaUrl}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {sec.buttonText && (
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold text-xs shadow-lg cursor-pointer">
                            <span>{sec.buttonText}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Revision History Tab */}
      {activeTab === 'revisions' && !isNew && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Page Revision History ({revisions.length})
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Audited modification records & change summaries
              </span>
            </div>

            {revisions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No archived revisions recorded for this page yet. Revisions are created automatically each time this page is saved.
              </p>
            ) : (
              <div className="space-y-3">
                {revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-850/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">
                          Revision #{rev.id}: {rev.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                          {rev.status || 'published'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        Change: {rev.changeSummary || 'Page content updated'}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>Editor: <strong className="text-slate-400">{rev.revisedBy}</strong></span>
                        <span>&bull;</span>
                        <span>{new Date(rev.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-slate-500">
                      {rev.slug}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
