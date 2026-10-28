'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  ArrowLeft,
  Save,
  Globe,
  Sparkles,
  Eye,
  History,
  FileText,
  Image as ImageIcon,
  Layers,
  Leaf,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { FocusArea, FocusAreaRevision } from '@/db/schema';
import { createFocusAreaAction, updateFocusAreaAction } from '../../actions';

interface FocusAreaEditorFormProps {
  initialData?: FocusArea | null;
  revisions?: FocusAreaRevision[];
}

const PRESET_ICONS = [
  { value: 'fa-leaf', label: 'Leaf (Nature / Eco)' },
  { value: 'fa-users-line', label: 'Community / People' },
  { value: 'fa-seedling', label: 'Seedling / Growth' },
  { value: 'fa-city', label: 'City / Infrastructure' },
  { value: 'fa-recycle', label: 'Recycle / Waste' },
  { value: 'fa-solar-panel', label: 'Solar Panel' },
  { value: 'fa-file-invoice-dollar', label: 'Finance / Accountability' },
  { value: 'fa-gem', label: 'Minerals / Raw Materials' },
  { value: 'fa-bolt', label: 'Energy / Electricity' },
  { value: 'fa-wind', label: 'Wind / Clean Power' },
  { value: 'fa-water', label: 'Water / River Protection' },
  { value: 'fa-tree', label: 'Forest / Conservation' },
  { value: 'fa-shield-halved', label: 'Policy / Protection' },
];

export default function FocusAreaEditorForm({ initialData, revisions = [] }: FocusAreaEditorFormProps) {
  const isEditing = Boolean(initialData && initialData.id);

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [parentPillar, setParentPillar] = useState(initialData?.parentPillar || 'Environment & Climate');
  const [customPillar, setCustomPillar] = useState('');
  const [isCustomPillar, setIsCustomPillar] = useState(
    initialData?.parentPillar
      ? initialData.parentPillar !== 'Environment & Climate' && initialData.parentPillar !== 'Energy Transition'
      : false
  );
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [icon, setIcon] = useState(initialData?.icon || 'fa-leaf');
  const [image, setImage] = useState(initialData?.image || '');
  const [tags, setTags] = useState(initialData?.tags || '');
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.displayOrder || 1);
  const [isFeatured, setIsFeatured] = useState<string>(initialData?.isFeatured || 'yes');
  const [status, setStatus] = useState<string>(initialData?.status || 'active');
  const [changeSummary, setChangeSummary] = useState('');

  // Active view tab
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('editor');
  const [isSaving, setIsSaving] = useState(false);

  // Auto-slug generation from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && (!slug || slug === slugify(title))) {
      setSlug(slugify(val));
    }
  };

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const effectivePillar = isCustomPillar ? customPillar || 'Strategic Pillar' : parentPillar;
  const isEnv = effectivePillar === 'Environment & Climate';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/focus-areas"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Back to Focus Areas"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wide">
                {isEditing ? 'Edit Thematic Area' : 'New Focus Area'}
              </span>
              {isEditing && (
                <span className="text-xs text-slate-400 font-mono">ID #{initialData?.id}</span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {title || 'Untitled Focus Area'}
            </h1>
          </div>
        </div>

        {/* Tab switcher & public link */}
        <div className="flex items-center gap-2">
          {isEditing && (
            <Link
              href={`/focus/${initialData?.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public</span>
            </Link>
          )}

          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Editor</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </span>
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'history'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Revisions ({revisions.length})</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: Editor Form */}
      {activeTab === 'editor' && (
        <form
          action={async (formData) => {
            setIsSaving(true);
            try {
              if (isEditing) {
                await updateFocusAreaAction(formData);
              } else {
                await createFocusAreaAction(formData);
              }
            } catch (err: any) {
              alert(err?.message || 'Failed to save focus area.');
              setIsSaving(false);
            }
          }}
          className="space-y-6"
        >
          {isEditing && <input type="hidden" name="id" value={initialData!.id} />}

          {/* Section 1: Core Taxonomy & Identity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>1. Core Taxonomy & Strategic Pillar</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the thematic title, url handle, and parent strategic pillar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Focus Area Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Renewable Energy, Community-Led Adaptation"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 font-medium"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-400 font-mono">
                    /focus/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    placeholder="renewable-energy"
                    className="w-full px-3 py-2.5 rounded-r-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Parent Strategic Pillar Selector */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Parent Strategic Pillar <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomPillar(false);
                      setParentPillar('Environment & Climate');
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                      !isCustomPillar && parentPillar === 'Environment & Climate'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Environment & Climate</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Adaptation, NbS, Plastics & Urban</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomPillar(false);
                      setParentPillar('Energy Transition');
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                      !isCustomPillar && parentPillar === 'Energy Transition'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Energy Transition</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Renewables, Finance & Minerals</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomPillar(true);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                      isCustomPillar
                        ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">New Custom Pillar</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Add future strategic pillars</div>
                    </div>
                  </button>
                </div>

                {isCustomPillar && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Type custom strategic pillar name (e.g. Grassroots Economic Empowerment)..."
                      value={customPillar}
                      onChange={(e) => setCustomPillar(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800 font-medium bg-indigo-50/20"
                    />
                    <input type="hidden" name="parentPillar" value={customPillar} />
                  </div>
                )}
                {!isCustomPillar && <input type="hidden" name="parentPillar" value={parentPillar} />}
              </div>
            </div>
          </div>

          {/* Section 2: Visual Representation & Iconography */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>2. Iconography & Visual Media</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an icon and banner image to identify this focus area across the site.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Icon Selector & Input */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  FontAwesome Icon Class
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center text-xl shrink-0 shadow-sm border border-slate-800">
                    <i className={`fa-solid ${icon || 'fa-leaf'}`} />
                  </div>
                  <input
                    type="text"
                    name="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="fa-leaf"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono text-slate-800"
                  />
                </div>

                <div className="text-xs text-slate-400">Quick preset icons:</div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_ICONS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setIcon(p.value)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition border ${
                        icon === p.value
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <i className={`fa-solid ${p.value} text-[11px]`} />
                      <span className="text-[11px]">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Banner Image URL */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hero / Card Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="/images/hero-community.jpg or https://..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 font-mono"
                  />
                </div>
                {image ? (
                  <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-28 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                    No image URL specified yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Narratives & Cross-Linking Tags */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>3. Narrative Descriptions & Taxonomy Tags</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Summary is displayed in cards and accordions. Description provides the comprehensive mandate.
              </p>
            </div>

            {/* Short Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Concise Summary / Teaser <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="summary"
                required
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A compelling 1-2 sentence overview of this focus area's objective and approach..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used in homepage accordions, cards, and meta descriptions.
              </p>
            </div>

            {/* Full Markdown Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Thematic Description (Supports Markdown)
              </label>
              <textarea
                name="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed explanation of this pillar, strategic priorities, target communities, and impact pathways..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 font-mono"
              />
            </div>

            {/* Cross-linking Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Associated Subcategories & Taxonomy Tags (Comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Decentralized Power, Solar Mini-Grids, Clean Energy Sovereignty, Clean Cooking"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Projects, articles, and publications with these tags will automatically appear on this focus area&apos;s public hub page!
              </p>
            </div>
          </div>

          {/* Section 4: Display Order, Featured & Publication Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>4. Display Order & Homepage Placement</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Control display sequence and whether this thematic area is highlighted on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Sequence Order
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  min={1}
                  max={99}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 font-mono font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">Lower numbers appear first.</p>
              </div>

              {/* Homepage Featured */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Homepage Featured
                </label>
                <select
                  name="isFeatured"
                  value={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 font-semibold"
                >
                  <option value="yes">⭐ Featured on Homepage</option>
                  <option value="no">Standard (Secondary)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Included in the homepage Focus section.</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Activation Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 font-semibold"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Deactivate to temporarily unpublish.</p>
              </div>
            </div>

            {/* Change Summary (for history logging) */}
            {isEditing && (
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Revision Change Note
                </label>
                <input
                  type="text"
                  name="changeSummary"
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="e.g. Updated strategic priorities and added critical minerals tags..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
                />
              </div>
            )}
          </div>

          {/* Bottom Save Action */}
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl text-white shadow-xl border border-slate-800">
            <Link
              href="/admin/focus-areas"
              className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white text-sm font-semibold transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-950 transition transform active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : isEditing ? 'Save Focus Area' : 'Publish Focus Area'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Live Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>This live preview simulates how this focus area appears on public pages and the homepage accordion.</span>
            <span className="font-semibold text-emerald-700">Display Order: #{displayOrder}</span>
          </div>

          {/* Simulated Public Hub Hero */}
          <div className={`p-8 sm:p-12 rounded-3xl text-white relative overflow-hidden shadow-2xl ${
            isEnv
              ? 'bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-900'
              : 'bg-gradient-to-br from-slate-950 via-amber-950 to-yellow-900'
          }`}>
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                isEnv
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {isEnv ? <Leaf className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                {effectivePillar}
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {title || 'Focus Area Title'}
              </h1>

              <p className="text-slate-300 text-base leading-relaxed">
                {summary || 'Focus area summary narrative will appear here.'}
              </p>

              {tags && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tags.split(',').map((t, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-slate-200 border border-white/10"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute right-8 bottom-8 opacity-15 text-8xl hidden sm:block">
              <i className={`fa-solid ${icon || 'fa-leaf'}`} />
            </div>
          </div>

          {/* Simulated Card / Teaser */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-md">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Homepage Accordion / Card Preview
            </div>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                isEnv
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <i className={`fa-solid ${icon || 'fa-leaf'} text-xl`} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{title || 'Focus Area Title'}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {summary || 'Brief summary narrative.'}
                </p>
                <div className="mt-3">
                  <span className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
                    <span>Explore Projects & Publications</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Revision History */}
      {activeTab === 'history' && isEditing && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Revision Audit Trail</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical record of changes made to this strategic focus area.
            </p>
          </div>

          {revisions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No historical revisions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {revisions.map((rev) => (
                <div key={rev.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{rev.revisedBy || 'Admin'}</span>
                      <span className="text-[11px] text-slate-400">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {rev.changeSummary || 'Updated focus area'}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <span>Pillar: {rev.parentPillar}</span>
                      <span>•</span>
                      <span>Status: {rev.status}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Rev #{rev.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
