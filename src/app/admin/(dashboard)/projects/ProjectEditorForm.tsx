'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  ArrowLeft,
  Save,
  Eye,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Link2,
  Plus,
  Trash2,
  History,
  CheckCircle2,
  AlertCircle,
  Star,
  ExternalLink,
  Target,
  BarChart3,
  Award,
  Users,
  Lock,
  Unlock,
} from 'lucide-react';
import { Project, ProjectRevision } from '@/db/schema';
import { createProjectAction, updateProjectAction } from '../../actions';
import { PROJECT_FOCUS_AREAS, PROJECT_STATUSES } from './ProjectsTableClient';

interface ImpactStatItem {
  id: string;
  label: string;
  value: string;
}

interface ProjectEditorFormProps {
  initialProject?: Project | null;
  revisions?: ProjectRevision[];
  isNew?: boolean;
}

export default function ProjectEditorForm({
  initialProject,
  revisions = [],
  isNew = false,
}: ProjectEditorFormProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'revisions'>('edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core fields
  const [title, setTitle] = useState(initialProject?.title || '');
  const [slug, setSlug] = useState(initialProject?.slug || '');
  const [slugLocked, setSlugLocked] = useState(!isNew);
  const [tag, setTag] = useState(initialProject?.tag || PROJECT_FOCUS_AREAS[0]);
  const [focusArea, setFocusArea] = useState(initialProject?.focusArea || initialProject?.tag || PROJECT_FOCUS_AREAS[0]);
  const [summary, setSummary] = useState(initialProject?.summary || '');
  const [description, setDescription] = useState(initialProject?.description || '');

  // Implementation & Timeline
  const [location, setLocation] = useState(initialProject?.location || 'Ghana');
  const [startDate, setStartDate] = useState(initialProject?.startDate || '2024');
  const [endDate, setEndDate] = useState(initialProject?.endDate || 'Ongoing');
  const [status, setStatus] = useState(initialProject?.status || 'Ongoing');

  // Objectives, Activities, Outcomes
  const [objectives, setObjectives] = useState(
    initialProject?.objectives ||
      '- Foster local community ownership of climate adaptation measures\n- Promote ecological agroforestry and organic farming\n- Reduce reliance on synthetic chemical inputs'
  );
  const [activities, setActivities] = useState(initialProject?.activities || '');
  const [outcomes, setOutcomes] = useState(initialProject?.outcomes || '');

  // Impact Statistics
  const parsedStats: ImpactStatItem[] = (() => {
    if (!initialProject?.impactStats) {
      return [
        { id: 'stat-1', label: 'Beneficiaries Reached', value: '2,500+' },
        { id: 'stat-2', label: 'Communities Engaged', value: '14' },
      ];
    }
    try {
      return JSON.parse(initialProject.impactStats);
    } catch {
      return [];
    }
  })();
  const [impactStats, setImpactStats] = useState<ImpactStatItem[]>(parsedStats);

  // Media
  const [coverImage, setCoverImage] = useState(initialProject?.coverImage || '/images/hero-community.jpg');
  const [bannerImage, setBannerImage] = useState(initialProject?.bannerImage || '');
  const [galleryImages, setGalleryImages] = useState(initialProject?.galleryImages || '');

  // Partners & External Links
  const [partners, setPartners] = useState(initialProject?.partners || '');
  const [funders, setFunders] = useState(initialProject?.funders || '');
  const [externalLink, setExternalLink] = useState(initialProject?.externalLink || '');
  const [relatedPublications, setRelatedPublications] = useState(initialProject?.relatedPublications || '');
  const [relatedNews, setRelatedNews] = useState(initialProject?.relatedNews || '');

  // Visibility & Featured
  const [isFeatured, setIsFeatured] = useState(initialProject?.isFeatured || 'no');
  const [isPublic, setIsPublic] = useState(initialProject?.isPublic || 'yes');
  const [changeSummary, setChangeSummary] = useState('');

  // Handle auto-slugification
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew && !slugLocked) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Impact Stats handlers
  const addImpactStat = () => {
    setImpactStats((prev) => [
      ...prev,
      { id: `stat-${Date.now()}`, label: 'Metric Label', value: '100+' },
    ]);
  };

  const updateImpactStat = (id: string, field: 'label' | 'value', text: string) => {
    setImpactStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: text } : s))
    );
  };

  const removeImpactStat = (id: string) => {
    setImpactStats((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>{isNew ? 'Initiative Creator' : 'Project Editor'}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isNew ? 'Add New Project' : `Edit: ${initialProject?.title || 'Project'}`}
            </h1>
            {!isNew && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                  /projects/{initialProject?.slug}
                </span>
                <span className="text-xs text-slate-400">
                  &bull; Status: <strong className="text-slate-300 font-semibold">{status}</strong>
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
                  ? 'bg-emerald-600 text-white shadow'
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
                  ? 'bg-emerald-600 text-white shadow'
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
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History ({revisions.length})</span>
              </button>
            )}
          </div>

          {!isNew && initialProject?.slug && (
            <Link
              href={`/projects/${initialProject.slug}`}
              target="_blank"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Open Live URL</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Form Content */}
      {activeTab === 'edit' && (
        <form
          action={async (formData) => {
            setIsSubmitting(true);
            try {
              if (isNew) {
                await createProjectAction(formData);
              } else {
                await updateProjectAction(formData);
              }
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Hidden Inputs */}
          {!isNew && initialProject && (
            <input type="hidden" name="id" value={initialProject.id} />
          )}
          <input
            type="hidden"
            name="impactStats"
            value={JSON.stringify(impactStats)}
          />

          {/* Left & Center: Main Project Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card A: Identity & Classification */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Project Identity &amp; Classification
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Required</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Kuvuna One World Garden"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
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
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
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
                  <input
                    type="text"
                    name="slug"
                    required
                    readOnly={slugLocked}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="kuvuna-project"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all ${
                      slugLocked
                        ? 'bg-slate-800/40 border-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-800/90 border-slate-700 focus:ring-1 focus:ring-emerald-500'
                    }`}
                  />
                </div>
              </div>

              {/* Focus Area & Tag */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Focus Area / Category *
                  </label>
                  <select
                    name="tag"
                    value={tag}
                    onChange={(e) => {
                      setTag(e.target.value);
                      setFocusArea(e.target.value);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-emerald-500"
                  >
                    {PROJECT_FOCUS_AREAS.map((fa) => (
                      <option key={fa} value={fa}>
                        {fa}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Secondary Sub-Tag (Optional)
                  </label>
                  <input
                    type="text"
                    name="focusArea"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    placeholder="e.g. Agroecology & Food Security"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Executive Summary / Short Teaser *
                </label>
                <textarea
                  name="summary"
                  required
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Concise overview displayed on project cards and homepage..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Card B: Implementation Locations & Timeline */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Geographic Scope &amp; Implementation Timeline
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Field Operations</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Implementation Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Greater Accra & Volta Basin"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Start Date</span>
                  </label>
                  <input
                    type="text"
                    name="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. January 2024"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>End Date / Target</span>
                  </label>
                  <input
                    type="text"
                    name="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="e.g. December 2026 or Ongoing"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Card C: Detailed Description, Objectives & Activities */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Comprehensive Narrative, Objectives &amp; Milestones
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Detailed Documentation</span>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Project Narrative &amp; Background
                </label>
                <textarea
                  name="description"
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full background, community context, implementation methodology..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-850 border border-slate-700 font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Strategic Objectives */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strategic Objectives &amp; Targets (One per line)</span>
                </label>
                <textarea
                  name="objectives"
                  rows={4}
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="- Restore local agroecological food systems&#10;- Establish 15 community nursery seedbanks&#10;- Train 500 women in organic bio-fertilizer production"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Documented Activities & Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Activities &amp; Field Actions</span>
                  </label>
                  <textarea
                    name="activities"
                    rows={4}
                    value={activities}
                    onChange={(e) => setActivities(e.target.value)}
                    placeholder="Quarterly workshops, community town halls, distributed 300 clean stoves..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-teal-400" />
                    <span>Outcomes &amp; Verified Impact</span>
                  </label>
                  <textarea
                    name="outcomes"
                    rows={4}
                    value={outcomes}
                    onChange={(e) => setOutcomes(e.target.value)}
                    placeholder="30% reduction in firewood expenditure, improved crop yields, policy adoption..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Card D: Impact Statistics Builder */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Impact Statistics &amp; Metrics ({impactStats.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addImpactStat}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold border border-amber-800/60 transition-colors flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Metric</span>
                </button>
              </div>

              {impactStats.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No impact metrics added yet. Click "+ Add Metric" to highlight measurable accomplishments.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {impactStats.map((stat) => (
                    <div
                      key={stat.id}
                      className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-center gap-3"
                    >
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => updateImpactStat(stat.id, 'value', e.target.value)}
                          placeholder="e.g. 10,000+"
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateImpactStat(stat.id, 'label', e.target.value)}
                          placeholder="e.g. Trees Planted"
                          className="w-full px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImpactStat(stat.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Card E: Partners, Funders & External Links */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Users className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Partners, Funders &amp; Connected Resources
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Implementing Partners (Comma-separated)
                  </label>
                  <input
                    type="text"
                    name="partners"
                    value={partners}
                    onChange={(e) => setPartners(e.target.value)}
                    placeholder="e.g. 350.org, Climate Action Network, EPA Ghana"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Funders &amp; Supporters (Optional)
                  </label>
                  <input
                    type="text"
                    name="funders"
                    value={funders}
                    onChange={(e) => setFunders(e.target.value)}
                    placeholder="e.g. Global Greengrants Fund, Grassroots Donors"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>External Campaign URL</span>
                  </label>
                  <input
                    type="text"
                    name="externalLink"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://fossilfreeeca.org"
                    className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Related Publications (IDs or Titles)
                  </label>
                  <input
                    type="text"
                    name="relatedPublications"
                    value={relatedPublications}
                    onChange={(e) => setRelatedPublications(e.target.value)}
                    placeholder="e.g. 1, 3 or Newsletter Vol 2"
                    className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Related News Article Slugs
                  </label>
                  <input
                    type="text"
                    name="relatedNews"
                    value={relatedNews}
                    onChange={(e) => setRelatedNews(e.target.value)}
                    placeholder="e.g. aerc-marks-world-environment-day"
                    className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Status, Featured, Media & Revisions */}
          <div className="space-y-6">
            {/* Card 1: Status & Homepage Visibility */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Status &amp; Visibility Controls
                </h2>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project Lifecycle Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors ${
                    status === 'Ongoing' || status === 'Active'
                      ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                      : status === 'Planned'
                      ? 'bg-cyan-950/90 text-cyan-400 border-cyan-800'
                      : status === 'Completed'
                      ? 'bg-blue-950/90 text-blue-400 border-blue-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <option value="Ongoing">Ongoing (Active Program)</option>
                  <option value="Planned">Planned (Upcoming Initiative)</option>
                  <option value="Completed">Completed (Archived Milestone)</option>
                  <option value="Archived">Archived (Unpublished)</option>
                </select>
              </div>

              {/* Homepage Feature Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Star className={`w-3.5 h-3.5 ${isFeatured === 'yes' ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                    <span>Feature on Homepage</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Spotlight this project in homepage impact grid
                  </div>
                </div>
                <input
                  type="hidden"
                  name="isFeatured"
                  value={isFeatured}
                />
                <button
                  type="button"
                  onClick={() => setIsFeatured(isFeatured === 'yes' ? 'no' : 'yes')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    isFeatured === 'yes' ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      isFeatured === 'yes' ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Public Visibility Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Public Visibility</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Display publicly in the projects directory
                  </div>
                </div>
                <input
                  type="hidden"
                  name="isPublic"
                  value={isPublic}
                />
                <button
                  type="button"
                  onClick={() => setIsPublic(isPublic === 'yes' ? 'no' : 'yes')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    isPublic === 'yes' ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      isPublic === 'yes' ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Change Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Audit / Revision Summary
                </label>
                <input
                  type="text"
                  name="changeSummary"
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder={isNew ? 'Initial project launch' : 'e.g. Added Q3 impact metrics and photos'}
                  className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving Project...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isNew ? 'Create & Publish Project' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card 2: Media & Imagery */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Media &amp; Imagery
                </h2>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Cover Image URL *
                </label>
                <input
                  type="text"
                  name="coverImage"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="/images/projects/garden.jpg"
                  className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                {coverImage && (
                  <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-700 h-28 bg-slate-950">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = '/images/hero-community.jpg';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full-Width Banner Image URL (Optional)
                </label>
                <input
                  type="text"
                  name="bannerImage"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="/images/hero-bg.jpg"
                  className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Additional Gallery Images (Comma-separated)
                </label>
                <textarea
                  name="galleryImages"
                  rows={2}
                  value={galleryImages}
                  onChange={(e) => setGalleryImages(e.target.value)}
                  placeholder="/images/projects/gallery1.jpg, /images/projects/gallery2.jpg"
                  className="w-full px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 3. Live Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Eye className="w-4 h-4" />
              <span>Public Project Page Simulator</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              Return to Editor
            </button>
          </div>

          {/* Rendered Public Project View */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl text-slate-900">
            {/* Header Banner */}
            <div
              className="py-20 px-6 sm:px-12 bg-emerald-950 text-white relative"
              style={
                bannerImage || coverImage
                  ? {
                      backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.9), rgba(6, 78, 59, 0.95)), url(${bannerImage || coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {tag}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                    Status: {status}
                  </span>
                  {location && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-emerald-100 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-300" />
                      <span>{location}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {title || 'Project Title'}
                </h1>

                <p className="text-lg text-emerald-100 max-w-3xl leading-relaxed font-light">
                  {summary || 'Executive summary of the initiative.'}
                </p>
              </div>
            </div>

            {/* Impact Statistics Ribbon */}
            {impactStats.length > 0 && (
              <div className="bg-emerald-900 text-white py-8 px-6 sm:px-12 border-b border-emerald-800">
                <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  {impactStats.map((stat) => (
                    <div key={stat.id}>
                      <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                        {stat.value}
                      </div>
                      <div className="text-xs text-emerald-100 uppercase tracking-wider font-semibold mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Body Content */}
            <div className="max-w-4xl mx-auto py-12 px-6 sm:px-12 space-y-10">
              {/* Cover Image Showcase */}
              {coverImage && (
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 max-h-96">
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Detailed Narrative */}
              {description && (
                <div className="prose prose-lg prose-emerald max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {description}
                </div>
              )}

              {/* Objectives Section */}
              {objectives && (
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <span>Core Strategic Objectives</span>
                  </h3>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                    {objectives}
                  </div>
                </div>
              )}

              {/* Activities & Outcomes */}
              {(activities || outcomes) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activities && (
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                      <h4 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Key Activities Conducted</span>
                      </h4>
                      <p className="text-xs text-emerald-950 leading-relaxed whitespace-pre-wrap">
                        {activities}
                      </p>
                    </div>
                  )}

                  {outcomes && (
                    <div className="p-6 rounded-2xl bg-teal-50 border border-teal-100 space-y-2">
                      <h4 className="text-base font-bold text-teal-900 flex items-center gap-2">
                        <Award className="w-4 h-4 text-teal-600" />
                        <span>Verified Outcomes &amp; Impact</span>
                      </h4>
                      <p className="text-xs text-teal-950 leading-relaxed whitespace-pre-wrap">
                        {outcomes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Partners */}
              {partners && (
                <div className="pt-6 border-t border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Implementing Coalition &amp; Partners
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {partners.split(',').map((p, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
                      >
                        {p.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Revision History Tab */}
      {activeTab === 'revisions' && !isNew && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Project Revision History ({revisions.length})
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Audit records &amp; change milestones
            </span>
          </div>

          {revisions.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No historical revisions logged yet. Revisions are created automatically whenever changes are saved.
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
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                        {rev.status || 'Ongoing'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      Summary: {rev.changeSummary || 'Project updated'}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>Editor: <strong className="text-slate-400">{rev.revisedBy}</strong></span>
                      <span>&bull;</span>
                      <span>{new Date(rev.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-500">
                    /projects/{rev.slug}
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
