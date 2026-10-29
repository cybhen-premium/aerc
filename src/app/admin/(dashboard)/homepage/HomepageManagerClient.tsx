'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  Save,
  Eye,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Check,
  X,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Info,
  Sliders,
  Type,
  Layout,
  BarChart3,
  Star,
  Users,
  Briefcase,
  BookOpen,
  FileText,
  Target,
  Handshake,
  Megaphone,
} from 'lucide-react';
import {
  HomepageSettings,
  Project,
  BlogPost,
  Publication,
  FocusArea,
  TeamMember,
  MediaItem,
} from '@/db/schema';
import {
  HomepageSectionConfig,
  ImpactStatItem,
  ObjectiveItem,
  PartnerItem,
  defaultHomepageSections,
  defaultImpactStats,
  defaultAboutObjectives,
  defaultPartners,
} from '@/db/seed-data';
import {
  updateHomepageSectionsAction,
  updateHomepageImpactStatsAction,
  updateHomepageContentAction,
} from '../../actions';

interface HomepageManagerClientProps {
  initialSettings: HomepageSettings;
  projects: Project[];
  blogs: BlogPost[];
  publications: Publication[];
  focusAreas: FocusArea[];
  teamMembers: TeamMember[];
  mediaItems: MediaItem[];
}

export default function HomepageManagerClient({
  initialSettings,
  projects,
  blogs,
  publications,
  focusAreas,
  teamMembers,
  mediaItems,
}: HomepageManagerClientProps) {
  const [activeTab, setActiveTab] = useState<
    'sections' | 'hero' | 'intro_about' | 'impact' | 'featured' | 'partners_cta'
  >('sections');

  // --- 1. Sections Configuration ---
  const initialSections: HomepageSectionConfig[] = (() => {
    try {
      if (initialSettings.sectionsConfig) {
        const parsed = JSON.parse(initialSettings.sectionsConfig);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultHomepageSections;
  })();

  const [sections, setSections] = useState<HomepageSectionConfig[]>(initialSections);

  // --- 2. Hero Banner State ---
  const [heroTag, setHeroTag] = useState(initialSettings.heroTag || 'AERC GHANA');
  const [heroHeadlinePrefix, setHeroHeadlinePrefix] = useState(
    initialSettings.heroHeadlinePrefix || 'Building Resilience Through '
  );
  const [heroHighlight, setHeroHighlight] = useState(
    initialSettings.heroHighlight || 'Just Energy Transition'
  );
  const [heroIntroduction, setHeroIntroduction] = useState(
    initialSettings.heroIntroduction ||
      'Advancing a just, inclusive energy transition across rural Ghana—championing community ownership, decentralized solar mini-grids, and clean renewable power.'
  );
  const [heroBgImage, setHeroBgImage] = useState(
    initialSettings.heroBgImage || '/images/slider-1.jpg'
  );
  const [heroCtaPrimaryText, setHeroCtaPrimaryText] = useState(
    initialSettings.heroCtaPrimaryText || 'Explore Initiatives'
  );
  const [heroCtaPrimaryLink, setHeroCtaPrimaryLink] = useState(
    initialSettings.heroCtaPrimaryLink || '/projects'
  );
  const [heroCtaSecondaryText, setHeroCtaSecondaryText] = useState(
    initialSettings.heroCtaSecondaryText || 'About Our Mission'
  );
  const [heroCtaSecondaryLink, setHeroCtaSecondaryLink] = useState(
    initialSettings.heroCtaSecondaryLink || '/about'
  );

  // --- 3. Intro & About Narrative State ---
  const [introBadge, setIntroBadge] = useState(initialSettings.introBadge || 'ABOUT AERC GHANA');
  const [introHeading, setIntroHeading] = useState(
    initialSettings.introHeading ||
      'Grassroots Leadership Driving Climate Justice & Energy Sovereignty'
  );
  const [introContent, setIntroContent] = useState(
    initialSettings.introContent ||
      'Alliance for Empowering Rural Communities (AERC Ghana) is a dedicated youth-led and community-centered environmental organisation advancing grassroots solutions to climate change, rural energy poverty, and natural resource governance across Ghana and West Africa.'
  );
  const [introImage, setIntroImage] = useState(
    initialSettings.introImage || '/images/about/who-we-are.jpg'
  );

  const [aboutBadge, setAboutBadge] = useState(initialSettings.aboutBadge || 'HOW WE WORK');
  const [aboutHeading, setAboutHeading] = useState(
    initialSettings.aboutHeading || 'We Work Together For Bettering Tomorrow'
  );
  const [aboutLead, setAboutLead] = useState(
    initialSettings.aboutLead ||
      'Through policy advocacy, research, and training, we bridge grassroots realities with national and global decision-making. We amplify community voices, strengthen local leadership, and connect our partners to the knowledge, resources, and networks that drive change. Every project we undertake reflects our belief that rural communities are not just beneficiaries, they are leaders in building a just, resilient, and sustainable future for all.'
  );
  const [aboutImage, setAboutImage] = useState(
    initialSettings.aboutImage || '/images/bettering-tomorrow.jpg'
  );

  const initialObjectives: ObjectiveItem[] = (() => {
    try {
      if (initialSettings.aboutObjectivesJson) {
        const parsed = JSON.parse(initialSettings.aboutObjectivesJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultAboutObjectives;
  })();
  const [aboutObjectives, setAboutObjectives] = useState<ObjectiveItem[]>(initialObjectives);

  // --- 4. Verified Impact Metrics State ---
  const initialStats: ImpactStatItem[] = (() => {
    try {
      if (initialSettings.impactStatsJson) {
        const parsed = JSON.parse(initialSettings.impactStatsJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultImpactStats;
  })();

  const [impactStats, setImpactStats] = useState<ImpactStatItem[]>(initialStats);
  const [displayImpactStats, setDisplayImpactStats] = useState<string>(
    initialSettings.displayImpactStats || 'yes'
  );

  // --- 5. Featured Showcases State ---
  const [focusBadge, setFocusBadge] = useState(initialSettings.focusBadge || 'STRATEGIC PILLARS');
  const [focusHeading, setFocusHeading] = useState(
    initialSettings.focusHeading || 'Our Focus Areas and Strategic Pillars'
  );
  const [focusSubtitle, setFocusSubtitle] = useState(
    initialSettings.focusSubtitle ||
      'AERC focuses on Environment & Climate and Energy Transition, driving climate justice, community empowerment, and sustainable development.'
  );
  const [focusImage, setFocusImage] = useState(initialSettings.focusImage || '/images/rrrr.png');
  const [selectedFocusAreaIds, setSelectedFocusAreaIds] = useState<number[]>(() => {
    try {
      if (initialSettings.featuredFocusAreaIds) {
        return JSON.parse(initialSettings.featuredFocusAreaIds);
      }
    } catch (e) {
      console.error(e);
    }
    return focusAreas.map((f) => f.id);
  });

  const [projectsBadge, setProjectsBadge] = useState(
    initialSettings.projectsBadge || 'ACTIVE INITIATIVES'
  );
  const [projectsHeading, setProjectsHeading] = useState(
    initialSettings.projectsHeading || 'Our Featured Projects'
  );
  const [projectsSubtitle, setProjectsSubtitle] = useState(
    initialSettings.projectsSubtitle ||
      'Community-led agroecology, clean cooking transitions, and renewable solar installations.'
  );
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>(() => {
    try {
      if (initialSettings.featuredProjectIds) {
        return JSON.parse(initialSettings.featuredProjectIds);
      }
    } catch (e) {
      console.error(e);
    }
    return projects.slice(0, 4).map((p) => p.id);
  });

  const [newsBadge, setNewsBadge] = useState(initialSettings.newsBadge || 'LATEST DISPATCHES');
  const [newsHeading, setNewsHeading] = useState(
    initialSettings.newsHeading || 'Latest News & Advocacy Stories'
  );
  const [newsSubtitle, setNewsSubtitle] = useState(
    initialSettings.newsSubtitle ||
      'Updates, grassroots insights, and policy announcements from AERC Ghana teams.'
  );
  const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>(() => {
    try {
      if (initialSettings.featuredArticleIds) {
        return JSON.parse(initialSettings.featuredArticleIds);
      }
    } catch (e) {
      console.error(e);
    }
    return blogs.slice(0, 3).map((b) => b.id);
  });

  const [pubsBadge, setPubsBadge] = useState(initialSettings.pubsBadge || 'RESEARCH & POLICY');
  const [pubsHeading, setPubsHeading] = useState(
    initialSettings.pubsHeading || 'Publications & Downloadable Resources'
  );
  const [pubsSubtitle, setPubsSubtitle] = useState(
    initialSettings.pubsSubtitle ||
      'Evidence-based policy briefs, investigative reports, and community toolkits.'
  );
  const [selectedPublicationIds, setSelectedPublicationIds] = useState<number[]>(() => {
    try {
      if (initialSettings.featuredPublicationIds) {
        return JSON.parse(initialSettings.featuredPublicationIds);
      }
    } catch (e) {
      console.error(e);
    }
    return publications.slice(0, 4).map((p) => p.id);
  });

  const [teamBadge, setTeamBadge] = useState(initialSettings.teamBadge || 'OUR TEAM MEMBERS');
  const [teamHeading, setTeamHeading] = useState(
    initialSettings.teamHeading || 'Our Awesome Team'
  );
  const [teamSubtitle, setTeamSubtitle] = useState(
    initialSettings.teamSubtitle ||
      'Meet the passionate practitioners, organizers, and policy advocates leading frontline change across Ghana.'
  );
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>(() => {
    try {
      if (initialSettings.featuredTeamIds) {
        return JSON.parse(initialSettings.featuredTeamIds);
      }
    } catch (e) {
      console.error(e);
    }
    return teamMembers.slice(0, 6).map((t) => t.id);
  });

  // --- 6. Partners & CTA State ---
  const [partnersBadge, setPartnersBadge] = useState(
    initialSettings.partnersBadge || 'ALLIANCES & SUPPORTERS'
  );
  const [partnersHeading, setPartnersHeading] = useState(
    initialSettings.partnersHeading || 'Our Coalitions & Strategic Partners'
  );
  const initialPartners: PartnerItem[] = (() => {
    try {
      if (initialSettings.partnersJson) {
        const parsed = JSON.parse(initialSettings.partnersJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultPartners;
  })();
  const [partnersList, setPartnersList] = useState<PartnerItem[]>(initialPartners);

  const [ctaHeading, setCtaHeading] = useState(
    initialSettings.ctaHeading || 'Join Hands With Us For Climate Justice'
  );
  const [ctaSubtitle, setCtaSubtitle] = useState(
    initialSettings.ctaSubtitle ||
      'Whether as a partner organisation, volunteer, or supporter, your engagement empowers rural communities to lead their own sustainable future.'
  );
  const [ctaButtonText, setCtaButtonText] = useState(
    initialSettings.ctaButtonText || 'Get Involved Today'
  );
  const [ctaButtonLink, setCtaButtonLink] = useState(
    initialSettings.ctaButtonLink || '/partner'
  );

  // --- UI / Transition States ---
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<
    'hero' | 'intro' | 'about' | 'focus' | null
  >(null);
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');

  // Reorder Sections Handlers
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const updated = copy.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(updated);
  };

  const toggleSectionEnabled = (id: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, isEnabled: !sec.isEnabled } : sec))
    );
  };

  // Toggle multi-select helpers
  const toggleSelection = (id: number, currentList: number[], setList: (l: number[]) => void) => {
    if (currentList.includes(id)) {
      setList(currentList.filter((item) => item !== id));
    } else {
      setList([...currentList, id]);
    }
  };

  // Master Save Handler
  const handleSaveAll = () => {
    setFeedback(null);
    startTransition(async () => {
      try {
        // 1. Save sections order & visibility
        const secRes = await updateHomepageSectionsAction(JSON.stringify(sections));
        if (!secRes.success) {
          setFeedback({ type: 'error', message: secRes.error || 'Failed to save sections.' });
          return;
        }

        // 2. Save impact statistics
        const statRes = await updateHomepageImpactStatsAction(
          JSON.stringify(impactStats),
          displayImpactStats
        );
        if (!statRes.success) {
          setFeedback({ type: 'error', message: statRes.error || 'Failed to save impact stats.' });
          return;
        }

        // 3. Save copy, media & featured selections
        const formData = new FormData();
        formData.append('heroTag', heroTag);
        formData.append('heroHeadlinePrefix', heroHeadlinePrefix);
        formData.append('heroHighlight', heroHighlight);
        formData.append('heroIntroduction', heroIntroduction);
        formData.append('heroBgImage', heroBgImage);
        formData.append('heroCtaPrimaryText', heroCtaPrimaryText);
        formData.append('heroCtaPrimaryLink', heroCtaPrimaryLink);
        formData.append('heroCtaSecondaryText', heroCtaSecondaryText);
        formData.append('heroCtaSecondaryLink', heroCtaSecondaryLink);

        formData.append('introBadge', introBadge);
        formData.append('introHeading', introHeading);
        formData.append('introContent', introContent);
        formData.append('introImage', introImage);

        formData.append('aboutBadge', aboutBadge);
        formData.append('aboutHeading', aboutHeading);
        formData.append('aboutLead', aboutLead);
        formData.append('aboutImage', aboutImage);
        formData.append('aboutObjectivesJson', JSON.stringify(aboutObjectives));

        formData.append('focusBadge', focusBadge);
        formData.append('focusHeading', focusHeading);
        formData.append('focusSubtitle', focusSubtitle);
        formData.append('focusImage', focusImage);
        formData.append('featuredFocusAreaIds', JSON.stringify(selectedFocusAreaIds));

        formData.append('projectsBadge', projectsBadge);
        formData.append('projectsHeading', projectsHeading);
        formData.append('projectsSubtitle', projectsSubtitle);
        formData.append('featuredProjectIds', JSON.stringify(selectedProjectIds));

        formData.append('newsBadge', newsBadge);
        formData.append('newsHeading', newsHeading);
        formData.append('newsSubtitle', newsSubtitle);
        formData.append('featuredArticleIds', JSON.stringify(selectedArticleIds));

        formData.append('pubsBadge', pubsBadge);
        formData.append('pubsHeading', pubsHeading);
        formData.append('pubsSubtitle', pubsSubtitle);
        formData.append('featuredPublicationIds', JSON.stringify(selectedPublicationIds));

        formData.append('teamBadge', teamBadge);
        formData.append('teamHeading', teamHeading);
        formData.append('teamSubtitle', teamSubtitle);
        formData.append('featuredTeamIds', JSON.stringify(selectedTeamIds));

        formData.append('partnersBadge', partnersBadge);
        formData.append('partnersHeading', partnersHeading);
        formData.append('partnersJson', JSON.stringify(partnersList));

        formData.append('ctaHeading', ctaHeading);
        formData.append('ctaSubtitle', ctaSubtitle);
        formData.append('ctaButtonText', ctaButtonText);
        formData.append('ctaButtonLink', ctaButtonLink);

        const contentRes = await updateHomepageContentAction(formData);
        if (!contentRes.success) {
          setFeedback({
            type: 'error',
            message: contentRes.error || 'Failed to save homepage content.',
          });
          return;
        }

        setFeedback({
          type: 'success',
          message: 'All homepage modifications and section configurations saved successfully!',
        });
      } catch (err) {
        console.error(err);
        setFeedback({
          type: 'error',
          message: 'An unexpected error occurred while saving homepage settings.',
        });
      }
    });
  };

  // Filtered media for picker modal
  const filteredMedia = mediaItems.filter(
    (item) =>
      item.title.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(mediaSearchQuery.toLowerCase()))
  );

  const applyPickedMedia = (url: string) => {
    if (mediaPickerTarget === 'hero') setHeroBgImage(url);
    if (mediaPickerTarget === 'intro') setIntroImage(url);
    if (mediaPickerTarget === 'about') setAboutImage(url);
    if (mediaPickerTarget === 'focus') setFocusImage(url);
    setMediaPickerTarget(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Homepage Manager</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Control all homepage headlines, section sequencing, verified metrics, and showcases
                without editing source code.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Preview Changes</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>View Live Site</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isPending}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isPending ? 'Publishing...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
              : 'bg-red-950/40 border-red-800/80 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sections'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Section Order &amp; Visibility</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950/60 text-emerald-200 rounded-full border border-emerald-500/30">
            {sections.filter((s) => s.isEnabled).length}/{sections.length} Active
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'hero'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero Banner &amp; Headline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('intro_about')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'intro_about'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Intro &amp; How We Work</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('impact')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'impact'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Impact Stats</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
              displayImpactStats === 'yes'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {displayImpactStats === 'yes' ? 'Visible' : 'Hidden'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('featured')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'featured'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Featured Showcases</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('partners_cta')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'partners_cta'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
          }`}
        >
          <Handshake className="w-4 h-4" />
          <span>Partners &amp; Call To Action</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SECTION SEQUENCE & VISIBILITY */}
      {/* ========================================================================= */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Homepage Modular Section Sequence</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Reorder sections using the arrows to adjust visitor reading hierarchy. Toggle any
                  section on/off to hide draft or seasonal content instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSections(defaultHomepageSections)}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default Sequence</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    section.isEnabled
                      ? 'bg-slate-800/60 border-slate-700/80 hover:border-emerald-500/40'
                      : 'bg-slate-900/60 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Index badge */}
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-white">{section.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                          #{section.id}
                        </span>
                        {section.isEnabled ? (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Visible on Public Site
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{section.description}</p>
                    </div>
                  </div>

                  {/* Controls: Up/Down arrows and show/hide switch */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                      className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                      className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSectionEnabled(section.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        section.isEnabled
                          ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {section.isEnabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{section.isEnabled ? 'Enabled' : 'Disabled'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HERO BANNER & HEADLINES */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Hero Headline &amp; Tagline</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={heroTag}
                    onChange={(e) => setHeroTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. AERC GHANA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Headline Prefix
                  </label>
                  <input
                    type="text"
                    value={heroHeadlinePrefix}
                    onChange={(e) => setHeroHeadlinePrefix(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Building Resilience Through "
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Highlighted Phrase (Glow Effect)
                </label>
                <input
                  type="text"
                  value={heroHighlight}
                  onChange={(e) => setHeroHighlight(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-emerald-400 font-semibold focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Just Energy Transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  This phrase renders with gradient glowing highlights to catch immediate visitor
                  attention.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hero Introduction Paragraph
                </label>
                <textarea
                  rows={3}
                  value={heroIntroduction}
                  onChange={(e) => setHeroIntroduction(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Advancing a just, inclusive energy transition across rural Ghana..."
                />
              </div>

              {/* Call-to-action buttons */}
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Call to Action Buttons
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary CTA */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
                    <span className="text-xs font-bold text-emerald-400">Primary Button</span>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Button Label</label>
                      <input
                        type="text"
                        value={heroCtaPrimaryText}
                        onChange={(e) => setHeroCtaPrimaryText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Destination URL</label>
                      <input
                        type="text"
                        value={heroCtaPrimaryLink}
                        onChange={(e) => setHeroCtaPrimaryLink(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Secondary CTA */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
                    <span className="text-xs font-bold text-slate-300">Secondary Button</span>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Button Label</label>
                      <input
                        type="text"
                        value={heroCtaSecondaryText}
                        onChange={(e) => setHeroCtaSecondaryText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Destination URL</label>
                      <input
                        type="text"
                        value={heroCtaSecondaryLink}
                        onChange={(e) => setHeroCtaSecondaryLink(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Background Banner Image */}
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Hero Background Banner</span>
              </h2>

              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[16/10] relative group">
                <img
                  src={heroBgImage}
                  alt="Hero Preview"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] font-mono text-slate-300 truncate">{heroBgImage}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Background Image URL
                </label>
                <input
                  type="text"
                  value={heroBgImage}
                  onChange={(e) => setHeroBgImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  placeholder="/images/slider-1.jpg"
                />
              </div>

              <button
                type="button"
                onClick={() => setMediaPickerTarget('hero')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Select from Media Library</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTRO & HOW WE WORK */}
      {/* ========================================================================= */}
      {activeTab === 'intro_about' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Intro Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-400" />
              <span>Introduction Section (About AERC Ghana)</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Badge Pill</label>
              <input
                type="text"
                value={introBadge}
                onChange={(e) => setIntroBadge(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Section Headline
              </label>
              <input
                type="text"
                value={introHeading}
                onChange={(e) => setIntroHeading(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Introduction Narrative Content
              </label>
              <textarea
                rows={5}
                value={introContent}
                onChange={(e) => setIntroContent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Introduction Graphic / Photo
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={introImage}
                  alt="Intro"
                  className="w-16 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
                />
                <input
                  type="text"
                  value={introImage}
                  onChange={(e) => setIntroImage(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setMediaPickerTarget('intro')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl shrink-0 cursor-pointer"
                  title="Pick from Media Library"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: How We Work & 4 Objectives */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layout className="w-4 h-4 text-emerald-400" />
              <span>How We Work (Bettering Tomorrow)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Badge</label>
                <input
                  type="text"
                  value={aboutBadge}
                  onChange={(e) => setAboutBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Headline</label>
                <input
                  type="text"
                  value={aboutHeading}
                  onChange={(e) => setAboutHeading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Lead Methodology Paragraph
              </label>
              <textarea
                rows={3}
                value={aboutLead}
                onChange={(e) => setAboutLead(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Methodology Graphic Photo
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={aboutImage}
                  alt="About"
                  className="w-16 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
                />
                <input
                  type="text"
                  value={aboutImage}
                  onChange={(e) => setAboutImage(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setMediaPickerTarget('about')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl shrink-0 cursor-pointer"
                  title="Pick from Media Library"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>

            {/* 4 Core Objectives */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-300">Strategic Objectives (4)</label>
              </div>

              <div className="space-y-2">
                {aboutObjectives.map((obj, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {obj.num}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={obj.title}
                        onChange={(e) => {
                          const copy = [...aboutObjectives];
                          copy[idx].title = e.target.value;
                          setAboutObjectives(copy);
                        }}
                        className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VERIFIED IMPACT STATISTICS */}
      {/* ========================================================================= */}
      {activeTab === 'impact' && (
        <div className="space-y-5">
          {/* Mandatory Integrity Banner */}
          <div className="bg-amber-950/30 border border-amber-800/80 rounded-2xl p-5 flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300 block text-sm mb-0.5">
                Impact Statistics Policy &amp; Strict Verification Standard
              </strong>
              These figures represent public organizational credibility. Figures must only be
              displayed when verified data is available from audited project registers, field census,
              or published records. They must not be invented or hardcoded as factual achievements.
              Unverified statistics will automatically display a pending warning or can be hidden.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Public Impact Statistics Display</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Master switch to show or hide the verified impact statistics bar across the
                  homepage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDisplayImpactStats(displayImpactStats === 'yes' ? 'no' : 'yes')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors cursor-pointer ${
                    displayImpactStats === 'yes'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {displayImpactStats === 'yes' ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  <span>
                    {displayImpactStats === 'yes'
                      ? 'Impact Section Visible'
                      : 'Impact Section Hidden'}
                  </span>
                </button>
              </div>
            </div>

            {/* List of Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {impactStats.map((stat, idx) => (
                <div
                  key={stat.id || idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    stat.verified
                      ? 'bg-slate-800/60 border-slate-700/80'
                      : 'bg-slate-900/90 border-amber-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300">Metric #{idx + 1}</span>
                      {stat.verified ? (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified Data
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Verification Pending
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-slate-400 flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stat.show}
                          onChange={(e) => {
                            const copy = [...impactStats];
                            copy[idx].show = e.target.checked;
                            setImpactStats(copy);
                          }}
                          className="rounded text-emerald-500 focus:ring-0 w-3.5 h-3.5 bg-slate-900 border-slate-700"
                        />
                        <span>Show</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Metric Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const copy = [...impactStats];
                          copy[idx].label = e.target.value;
                          setImpactStats(copy);
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Achievement Value
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const copy = [...impactStats];
                          copy[idx].value = e.target.value;
                          setImpactStats(copy);
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-emerald-400 font-bold"
                        placeholder="e.g. 45+"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-[11px] text-slate-400 mb-1">Context / Description</label>
                    <input
                      type="text"
                      value={stat.description}
                      onChange={(e) => {
                        const copy = [...impactStats];
                        copy[idx].description = e.target.value;
                        setImpactStats(copy);
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-slate-400">
                        Verification Audit Source / Documentation Note
                      </label>
                      <label className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stat.verified}
                          onChange={(e) => {
                            const copy = [...impactStats];
                            copy[idx].verified = e.target.checked;
                            setImpactStats(copy);
                          }}
                          className="rounded text-emerald-500 focus:ring-0 w-3.5 h-3.5 bg-slate-900 border-slate-700"
                        />
                        <span>Verified Field Data</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={stat.sourceOrNote}
                      onChange={(e) => {
                        const copy = [...impactStats];
                        copy[idx].sourceOrNote = e.target.value;
                        setImpactStats(copy);
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-400 italic"
                      placeholder="e.g. 2024-2025 field program audit records"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FEATURED SHOWCASES */}
      {/* ========================================================================= */}
      {activeTab === 'featured' && (
        <div className="space-y-6">
          {/* A. Focus Areas & Strategic Pillars */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Focus Areas &amp; Strategic Pillars Section</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose which pillars and thematic areas appear in the homepage interactive
                  accordion.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={focusBadge}
                  onChange={(e) => setFocusBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={focusHeading}
                  onChange={(e) => setFocusHeading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Active Focus Areas ({selectedFocusAreaIds.length}/{focusAreas.length} selected)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {focusAreas.map((fa) => {
                  const isSelected = selectedFocusAreaIds.includes(fa.id);
                  return (
                    <button
                      type="button"
                      key={fa.id}
                      onClick={() =>
                        toggleSelection(fa.id, selectedFocusAreaIds, setSelectedFocusAreaIds)
                      }
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{fa.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{fa.parentPillar}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* B. Featured Projects */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Featured Projects Section</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={projectsBadge}
                  onChange={(e) => setProjectsBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={projectsHeading}
                  onChange={(e) => setProjectsHeading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Featured Projects ({selectedProjectIds.length}/{projects.length} selected)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {projects.map((proj) => {
                  const isSelected = selectedProjectIds.includes(proj.id);
                  return (
                    <button
                      type="button"
                      key={proj.id}
                      onClick={() =>
                        toggleSelection(proj.id, selectedProjectIds, setSelectedProjectIds)
                      }
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{proj.title}</div>
                        <div className="text-[10px] text-emerald-400 truncate">{proj.tag}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* C. Latest News & Articles */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Latest News &amp; Articles Section</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={newsBadge}
                  onChange={(e) => setNewsBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={newsHeading}
                  onChange={(e) => setNewsHeading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Featured Articles ({selectedArticleIds.length}/{blogs.length} selected)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {blogs.map((blog) => {
                  const isSelected = selectedArticleIds.includes(blog.id);
                  return (
                    <button
                      type="button"
                      key={blog.id}
                      onClick={() =>
                        toggleSelection(blog.id, selectedArticleIds, setSelectedArticleIds)
                      }
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{blog.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{blog.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* D. Publications & Resources */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Publications &amp; Resources Section</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={pubsBadge}
                  onChange={(e) => setPubsBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={pubsHeading}
                  onChange={(e) => setPubsHeading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Featured Publications ({selectedPublicationIds.length}/{publications.length}{' '}
                selected)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {publications.map((pub) => {
                  const isSelected = selectedPublicationIds.includes(pub.id);
                  return (
                    <button
                      type="button"
                      key={pub.id}
                      onClick={() =>
                        toggleSelection(
                          pub.id,
                          selectedPublicationIds,
                          setSelectedPublicationIds
                        )
                      }
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{pub.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{pub.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* E. Team Highlights */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Team Highlights Section</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={teamBadge}
                  onChange={(e) => setTeamBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={teamHeading}
                  onChange={(e) => setTeamHeading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Team Members to Display ({selectedTeamIds.length}/{teamMembers.length} selected)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {teamMembers.map((tm) => {
                  const isSelected = selectedTeamIds.includes(tm.id);
                  return (
                    <button
                      type="button"
                      key={tm.id}
                      onClick={() =>
                        toggleSelection(tm.id, selectedTeamIds, setSelectedTeamIds)
                      }
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <img
                        src={tm.image}
                        alt={tm.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{tm.name}</div>
                        <div className="text-[10px] text-emerald-400 truncate">{tm.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: PARTNERS & CALL TO ACTION */}
      {/* ========================================================================= */}
      {activeTab === 'partners_cta' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Partners & Supporters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Handshake className="w-4 h-4 text-emerald-400" />
              <span>Partners &amp; Supporters Section</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Badge</label>
                <input
                  type="text"
                  value={partnersBadge}
                  onChange={(e) => setPartnersBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Heading</label>
                <input
                  type="text"
                  value={partnersHeading}
                  onChange={(e) => setPartnersHeading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold"
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Affiliated Organizations ({partnersList.length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPartnersList([
                      ...partnersList,
                      {
                        id: String(Date.now()),
                        name: 'New Coalition Partner',
                        logo: '/images/partner-1.png',
                        category: 'Coalition',
                      },
                    ]);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Partner</span>
                </button>
              </div>

              <div className="space-y-2">
                {partnersList.map((partner, idx) => (
                  <div
                    key={partner.id || idx}
                    className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl flex items-center gap-3"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={partner.name}
                        onChange={(e) => {
                          const copy = [...partnersList];
                          copy[idx].name = e.target.value;
                          setPartnersList(copy);
                        }}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        placeholder="Partner Name"
                      />
                      <input
                        type="text"
                        value={partner.category}
                        onChange={(e) => {
                          const copy = [...partnersList];
                          copy[idx].category = e.target.value;
                          setPartnersList(copy);
                        }}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300"
                        placeholder="Category"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPartnersList(partnersList.filter((_, i) => i !== idx));
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-400" />
              <span>Homepage Call To Action Banner</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">CTA Heading</label>
              <input
                type="text"
                value={ctaHeading}
                onChange={(e) => setCtaHeading(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                CTA Subtitle / Paragraph
              </label>
              <textarea
                rows={4}
                value={ctaSubtitle}
                onChange={(e) => setCtaSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Button Text</label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Button Link</label>
                <input
                  type="text"
                  value={ctaButtonLink}
                  onChange={(e) => setCtaButtonLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MEDIA PICKER MODAL */}
      {/* ========================================================================= */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Select Image from Media Library</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target field:{' '}
                  <span className="text-emerald-400 font-semibold uppercase">{mediaPickerTarget}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-800 bg-slate-950/40">
              <input
                type="text"
                placeholder="Search media by title or category..."
                value={mediaSearchQuery}
                onChange={(e) => setMediaSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filteredMedia.map((media) => (
                <div
                  key={media.id}
                  onClick={() => applyPickedMedia(media.url)}
                  className="group rounded-xl border border-slate-800 bg-slate-950/60 p-2 hover:border-emerald-500/80 transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 relative mb-2">
                    <img
                      src={media.thumbnailUrl || media.url}
                      alt={media.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-[11px] font-semibold text-white truncate">{media.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{media.category}</div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredMedia.length} media items</span>
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PREVIEW MODAL */}
      {/* ========================================================================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Homepage Preview</h3>
                  <p className="text-[11px] text-slate-400">
                    Faithful mockup reflecting current configured section order &amp; draft copy.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-950 text-white">
              {/* Active Section Progression */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Active Homepage Sequence ({sections.filter((s) => s.isEnabled).length} Enabled Sections):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sections
                    .filter((s) => s.isEnabled)
                    .map((s, idx) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 rounded bg-slate-800 text-xs font-semibold text-emerald-300 border border-slate-700 flex items-center gap-1.5"
                      >
                        <span className="text-[10px] text-slate-400">{idx + 1}.</span>
                        <span>{s.name}</span>
                      </span>
                    ))}
                </div>
              </div>

              {/* Mock Hero */}
              <div
                className="rounded-2xl p-8 relative overflow-hidden border border-slate-800 min-h-[320px] flex flex-col justify-end"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(2,6,23,0.95), rgba(2,6,23,0.4)), url(${heroBgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="max-w-2xl space-y-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-600/80 text-white text-[11px] font-bold tracking-wider uppercase inline-block">
                    {heroTag}
                  </span>
                  <h1 className="text-3xl font-extrabold text-white leading-tight">
                    {heroHeadlinePrefix}
                    <span className="text-emerald-400">{heroHighlight}</span>
                  </h1>
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {heroIntroduction}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                      {heroCtaPrimaryText}
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/20">
                      {heroCtaSecondaryText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mock Verified Impact Statistics */}
              {displayImpactStats === 'yes' && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Verified Impact Metrics
                    </span>
                    <span className="text-[10px] text-slate-400">Audited Program Census</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {impactStats
                      .filter((st) => st.show)
                      .map((st) => (
                        <div
                          key={st.id}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                        >
                          <div className="text-2xl font-black text-emerald-400">{st.value}</div>
                          <div className="text-xs font-bold text-white mt-1">{st.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {st.description}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Mock Intro / About */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {introBadge}
                  </span>
                  <h3 className="text-base font-bold text-white">{introHeading}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {introContent}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {aboutBadge}
                  </span>
                  <h3 className="text-base font-bold text-white">{aboutHeading}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{aboutLead}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Changes will take effect immediately upon clicking &quot;Save All Changes&quot;.
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  handleSaveAll();
                }}
                disabled={isPending}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save and Publish Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
