'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Building2,
  Palette,
  Phone,
  Share2,
  FileText,
  Search,
  Sliders,
  ShieldCheck,
  Save,
  RotateCcw,
  Check,
  ExternalLink,
  AlertTriangle,
  Globe,
  Mail,
  MapPin,
  Lock,
  Server,
  Clock,
  Sparkles,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  HelpCircle,
} from 'lucide-react';
import {
  updateGeneralSettingsAction,
  toggleMaintenanceModeAction,
  resetSiteSettingsAction,
} from '@/app/admin/actions';
import type { SiteSettings, MediaItem } from '@/db/schema';
import type { SessionUser } from '@/lib/permissions';

interface SettingsManagerClientProps {
  settings: SiteSettings;
  mediaItems: MediaItem[];
  currentSession: SessionUser;
  diagnostics: {
    databaseStatus: string;
    cloudinaryConfigured: boolean;
    cloudinaryCloudName: string;
    authEngine: string;
    nodeEnv: string;
    nextVersion: string;
    serverTime: string;
  };
}

type TabType =
  | 'identity'
  | 'branding'
  | 'contact'
  | 'social'
  | 'footer_legal'
  | 'seo'
  | 'preferences'
  | 'technical';

export default function SettingsManagerClient({
  settings: initialSettings,
  mediaItems,
  currentSession,
  diagnostics,
}: SettingsManagerClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form field state
  const [form, setForm] = useState<SiteSettings>(initialSettings);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'logoUrl' | 'logoDarkUrl' | 'faviconUrl' | 'defaultOgImage' | null>(null);

  const isSuperAdmin = currentSession.role === 'superadmin' || currentSession.role === 'super_admin';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    // Explicitly set checkboxes that might be unchecked
    formData.set('maintenanceMode', form.maintenanceMode ? 'true' : 'false');
    formData.set('allowPublicVolunteers', form.allowPublicVolunteers ? 'true' : 'false');
    formData.set('allowPublicPartnerProposals', form.allowPublicPartnerProposals ? 'true' : 'false');

    startTransition(async () => {
      const res = await updateGeneralSettingsAction(formData);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Website settings saved and published successfully!' });
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to save settings.' });
      }
    });
  };

  const handleToggleMaintenance = () => {
    const nextState = !form.maintenanceMode;
    startTransition(async () => {
      const res = await toggleMaintenanceModeAction(nextState);
      if (res.success) {
        setForm((prev) => ({ ...prev, maintenanceMode: nextState }));
        setFeedback({
          type: 'success',
          message: `Maintenance mode ${nextState ? 'ENABLED' : 'DISABLED'} successfully!`,
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to toggle maintenance mode.' });
      }
    });
  };

  const handleResetDefaults = () => {
    if (!confirm('Are you sure you want to restore factory default website settings? This cannot be undone.')) {
      return;
    }

    startTransition(async () => {
      const res = await resetSiteSettingsAction();
      if (res.success) {
        window.location.reload();
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to reset settings.' });
      }
    });
  };

  const tabs = [
    { id: 'identity', label: 'Organization & Identity', icon: Building2, desc: 'Name, acronym, mission tagline, and registration' },
    { id: 'branding', label: 'Branding & Visuals', icon: Palette, desc: 'Logos, favicon, and brand color palette' },
    { id: 'contact', label: 'Contact & Office', icon: Phone, desc: 'Official emails, phone numbers, and physical address' },
    { id: 'social', label: 'Social Media', icon: Share2, desc: 'Official channels (X, LinkedIn, Facebook, YouTube, WhatsApp)' },
    { id: 'footer_legal', label: 'Footer & Legal Pages', icon: FileText, desc: 'Footer bio, copyright, privacy policy, and terms' },
    { id: 'seo', label: 'Default SEO Metadata', icon: Search, desc: 'Title templates, meta descriptions, and search indexation' },
    { id: 'preferences', label: 'Preferences & Operations', icon: Sliders, desc: 'Maintenance mode, pagination, and date formats' },
    { id: 'technical', label: 'System Health & Security', icon: ShieldCheck, desc: 'Environment security separation & infrastructure status' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">General Website Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Module 12
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Configure global website settings, branding assets, contact information, social links, and privacy disclosures.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700/60 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={isPending}
              className="px-3.5 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-slate-400 rounded-xl text-xs font-medium border border-slate-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset all settings to system factory defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          )}
        </div>
      </div>

      {/* Maintenance Mode Alert Banner (if active) */}
      {form.maintenanceMode && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-300">Maintenance Mode is Currently ACTIVE</div>
              <div className="text-xs text-amber-400/80 mt-0.5">
                Public visitors see a maintenance screen. Admin dashboard remains fully accessible.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleMaintenance}
            disabled={isPending}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Turn Off Maintenance Mode
          </button>
        </div>
      )}

      {/* Notification Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
              : 'bg-red-950/60 border-red-700/60 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5 text-sm font-medium">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`p-2.5 rounded-xl text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.id === 'preferences' && form.maintenanceMode && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <div className="text-xs font-semibold leading-tight line-clamp-1">{tab.label}</div>
            </button>
          );
        })}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: Organization & Identity */}
        {activeTab === 'identity' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Organization Identity & Registration</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official institutional name, acronym, and legal registration numbers displayed on the website.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Organization Legal Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={form.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. Alliance for Empowering Rural Communities (AERC Ghana)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Organization Short Name / Acronym <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="organizationShortName"
                  value={form.organizationShortName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. AERCGH"
                />
                <p className="text-[11px] text-slate-500 mt-1">Used in header logos, mobile drawers, and badges.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Year Established / Founded
                </label>
                <input
                  type="text"
                  name="establishedYear"
                  value={form.establishedYear || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 2019"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Official Mission Slogan / Tagline
                </label>
                <textarea
                  name="tagline"
                  rows={2}
                  value={form.tagline || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. Advancing climate justice, energy transition, and grassroots resilience across Ghana"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Official NGO Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={form.registrationNumber || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. CG012342021 / DSW/8942"
                />
                <p className="text-[11px] text-slate-500 mt-1">Department of Social Welfare & Registrar General certificates.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Standard Office Working Hours
                </label>
                <input
                  type="text"
                  name="workingHours"
                  value={form.workingHours || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. Monday - Friday: 8:00 AM - 5:00 PM GMT"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Branding & Visuals */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-emerald-400" />
                  <span>Branding & Visual Assets</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Update official website logos, browser favicon icon, and the theme primary color palette.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Logo */}
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Website Header Logo <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('logoUrl')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3" /> Select from Library
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 p-2 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {form.logoUrl ? (
                        <img src={form.logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="logoUrl"
                        value={form.logoUrl}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                        placeholder="/images/logo-sidebar.png"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Primary logo used across navigation headers.</p>
                    </div>
                  </div>
                </div>

                {/* Dark / Inverse Logo */}
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Footer / Dark Mode Logo
                    </label>
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('logoDarkUrl')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3" /> Select from Library
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 p-2 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {form.logoDarkUrl ? (
                        <img src={form.logoDarkUrl} alt="Dark logo preview" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="logoDarkUrl"
                        value={form.logoDarkUrl || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                        placeholder="/images/logo-sidebar.png"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">High-contrast logo for dark footers and sidebars.</p>
                    </div>
                  </div>
                </div>

                {/* Favicon */}
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Browser Tab Favicon <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('faviconUrl')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3" /> Select from Library
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-950 p-1.5 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {form.faviconUrl ? (
                        <img src={form.faviconUrl} alt="Favicon" className="w-7 h-7 object-contain" />
                      ) : (
                        <Globe className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="faviconUrl"
                        value={form.faviconUrl}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                        placeholder="/images/logo-sidebar.png"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Displayed in browser tabs and bookmarks bar (32x32px or 64x64px).</p>
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                    Theme Color System
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 mb-1 block">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          name="primaryColor"
                          value={form.primaryColor || '#059669'}
                          onChange={handleChange}
                          className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          name="primaryColor"
                          value={form.primaryColor || '#059669'}
                          onChange={handleChange}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 mb-1 block">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          name="accentColor"
                          value={form.accentColor || '#047857'}
                          onChange={handleChange}
                          className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          name="accentColor"
                          value={form.accentColor || '#047857'}
                          onChange={handleChange}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Brand Header Simulation */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-time Brand Header Simulation</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={form.logoUrl || '/images/logo-sidebar.png'}
                      alt="Brand preview"
                      className="w-10 h-10 rounded-full object-contain border border-slate-800"
                    />
                    <div>
                      <div className="font-bold text-sm text-white">{form.organizationShortName || 'AERCGH'}</div>
                      <div className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                        {form.organizationName || 'Alliance for Empowering Rural Communities'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow"
                      style={{ backgroundColor: form.primaryColor || '#059669' }}
                    >
                      Primary Button
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Contact & Office */}
        {activeTab === 'contact' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>Contact Channels & Physical Office</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official telephone lines, email addresses, GhanaPost GPS codes, and mailing details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Emails */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Contact Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="info@aercghana.net"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Support / Inquiries Desk Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="supportEmail"
                    value={form.supportEmail || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="inquiries@aercghana.net"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Partnerships & Grants Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="partnershipsEmail"
                    value={form.partnershipsEmail || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="partnerships@aercghana.net"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Media & Press Inquiries Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="mediaEmail"
                    value={form.mediaEmail || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="press@aercghana.net"
                  />
                </div>
              </div>

              {/* Telephone Numbers */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Telephone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="phonePrimary"
                    value={form.phonePrimary}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="+233 24 698 0091"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Secondary Telephone / Hotline
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="phoneSecondary"
                    value={form.phoneSecondary || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="+233 24 512 7304"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Official WhatsApp Contact Line
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="phoneWhatsapp"
                    value={form.phoneWhatsapp || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="+233 24 698 0091"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  GhanaPost Digital GPS Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="digitalAddressGps"
                    value={form.digitalAddressGps || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 uppercase"
                    placeholder="e.g. GA-482-9012"
                  />
                </div>
              </div>

              {/* Physical Office Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Physical Office Street Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="addressStreet"
                  rows={2}
                  value={form.addressStreet}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Afienya-Mataheko, opposite Grace Bio"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  City / Region <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="addressCity"
                  value={form.addressCity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Greater Accra Region"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Country <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="addressCountry"
                  value={form.addressCountry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Ghana"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Postal Box / Mailing Address
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="P.O. Box AF 124, Afienya"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Social Media */}
        {activeTab === 'social' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <span>Official Social Media Channels</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure official accounts for AERC Ghana. Updating these links changes them immediately across the website header, top bar, and footer without code changes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* X / Twitter */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">𝕏</span>
                    <span>X (Twitter) Official Profile</span>
                  </label>
                  {form.socialTwitter && (
                    <a
                      href={form.socialTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  name="socialTwitter"
                  value={form.socialTwitter || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="https://x.com/aercgh"
                />
              </div>

              {/* LinkedIn */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">in</span>
                    <span>LinkedIn Company Page</span>
                  </label>
                  {form.socialLinkedin && (
                    <a
                      href={form.socialLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  name="socialLinkedin"
                  value={form.socialLinkedin || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="https://www.linkedin.com/company/alliance-for-empowering-rural-communities"
                />
              </div>

              {/* Facebook */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">f</span>
                    <span>Facebook Official Page</span>
                  </label>
                  {form.socialFacebook && (
                    <a
                      href={form.socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  name="socialFacebook"
                  value={form.socialFacebook || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="https://www.facebook.com/aercgh"
                />
              </div>

              {/* Instagram */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">IG</span>
                    <span>Instagram Profile</span>
                  </label>
                  {form.socialInstagram && (
                    <a
                      href={form.socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  name="socialInstagram"
                  value={form.socialInstagram || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="https://www.instagram.com/ghanaaerc/"
                />
              </div>

              {/* YouTube */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">▶</span>
                    <span>YouTube Channel</span>
                  </label>
                  {form.socialYoutube && (
                    <a
                      href={form.socialYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  name="socialYoutube"
                  value={form.socialYoutube || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="https://www.youtube.com/@aercghana3755"
                />
              </div>

              {/* WhatsApp Channel */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">WA</span>
                    <span>WhatsApp Community Channel</span>
                  </label>
                  {form.socialWhatsappChannel && (
                    <a
                      href={form.socialWhatsappChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  name="socialWhatsappChannel"
                  value={form.socialWhatsappChannel || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="https://whatsapp.com/channel/aercgh"
                />
              </div>

              {/* ResearchGate */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">RG</span>
                    <span>ResearchGate Institution Hub</span>
                  </label>
                  {form.socialResearchGate && (
                    <a
                      href={form.socialResearchGate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  name="socialResearchGate"
                  value={form.socialResearchGate || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="https://www.researchgate.net/institution/AERC-Ghana"
                />
              </div>

              {/* GitHub */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center font-bold text-xs">GH</span>
                    <span>GitHub Organization / Data Repositories</span>
                  </label>
                  {form.socialGithub && (
                    <a
                      href={form.socialGithub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  name="socialGithub"
                  value={form.socialGithub || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="https://github.com/aercgh"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Footer & Legal */}
        {activeTab === 'footer_legal' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Website Footer & Legal Pages</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage footer copyright notices, organization summary bio, and editable legal compliance policies (Ghana Data Protection Act 843).
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Footer About / Mission Summary
                </label>
                <textarea
                  name="footerBio"
                  rows={3}
                  value={form.footerBio || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Summary displayed below the logo in the 4-column footer."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Footer Copyright Statement
                  </label>
                  <input
                    type="text"
                    name="footerCopyrightText"
                    value={form.footerCopyrightText || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Alliance for Empowering Rural Communities (AERC Ghana). All rights reserved."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Bottom Bar Tagline / Badge
                  </label>
                  <input
                    type="text"
                    name="footerBadgeText"
                    value={form.footerBadgeText || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Youth-Led & Community-Driven • Accra, Ghana"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Public Disclaimer Note
                </label>
                <textarea
                  name="disclaimerText"
                  rows={2}
                  value={form.disclaimerText || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Official disclaimer for policy papers and research documentation."
                />
              </div>

              {/* Privacy Policy Editor */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Privacy Policy Content (Markdown Supported)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Renders live at <Link href="/privacy-policy" target="_blank" className="text-emerald-400 hover:underline">/privacy-policy</Link> in accordance with the Ghana Data Protection Act 2012 (Act 843).
                    </p>
                  </div>
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    View Live Page <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <textarea
                  name="privacyPolicyContent"
                  rows={8}
                  value={form.privacyPolicyContent || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 font-mono border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="# Privacy Policy&#10;&#10;Explain data protection rules, retention schedules, and contact info..."
                />
              </div>

              {/* Terms of Service Editor */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Terms of Service Content (Markdown Supported)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Renders live at <Link href="/terms" target="_blank" className="text-emerald-400 hover:underline">/terms</Link>.
                    </p>
                  </div>
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    View Live Page <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <textarea
                  name="termsOfServiceContent"
                  rows={8}
                  value={form.termsOfServiceContent || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 font-mono border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="# Terms of Service&#10;&#10;Specify terms of open-access publication, attribution, and governing laws..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SEO Metadata */}
        {activeTab === 'seo' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                <span>Default Search Engine Optimization (SEO)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure default title templates, social share images (og:image), keywords, and search crawler indexation directives.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Default Website Title Template <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">{form.defaultMetaTitle.length} characters (Optimal: 50-60)</span>
                </div>
                <input
                  type="text"
                  name="defaultMetaTitle"
                  value={form.defaultMetaTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="AERCGH – Alliance for Empowering Rural Communities | Climate & Energy Justice"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Default Meta Description <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">{(form.defaultMetaDescription || '').length} characters (Optimal: 150-160)</span>
                </div>
                <textarea
                  name="defaultMetaDescription"
                  rows={3}
                  value={form.defaultMetaDescription || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Provide a compelling summary of AERC Ghana that appears in Google search snippets..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Social Share Image */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Default Social Share Image (og:image)
                    </label>
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('defaultOgImage')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3" /> Select from Library
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg bg-slate-950 p-1 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      {form.defaultOgImage ? (
                        <img src={form.defaultOgImage} alt="OG Image" className="max-h-full max-w-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <input
                      type="text"
                      name="defaultOgImage"
                      value={form.defaultOgImage || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                      placeholder="/images/slider-1.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Robots Index Directive
                  </label>
                  <select
                    name="robotsIndex"
                    value={form.robotsIndex || 'index, follow'}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="index, follow">Index, Follow (Recommended - Standard indexing)</option>
                    <option value="noindex, follow">Noindex, Follow (Hide from search engines)</option>
                    <option value="noindex, nofollow">Noindex, Nofollow (Strict exclusion)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Meta Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  name="defaultKeywords"
                  value={form.defaultKeywords || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="AERC Ghana, climate justice, energy transition, rural communities, decentralized solar..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Google Analytics 4 Measurement ID
                  </label>
                  <input
                    type="text"
                    name="googleAnalyticsId"
                    value={form.googleAnalyticsId || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Google Site Verification Tag
                  </label>
                  <input
                    type="text"
                    name="googleSiteVerification"
                    value={form.googleSiteVerification || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="google-site-verification=..."
                  />
                </div>
              </div>

              {/* SERP Search Preview Simulation */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Search SERP Result Preview</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-2xl space-y-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span>https://aercghana.net</span>
                  </div>
                  <div className="text-base font-semibold text-blue-400 hover:underline cursor-pointer">
                    {form.defaultMetaTitle || 'AERCGH – Alliance for Empowering Rural Communities'}
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {form.defaultMetaDescription ||
                      'Alliance for Empowering Rural Communities (AERC) is a youth-led, frontline climate & energy justice organization empowering rural and marginalized African communities to shape resilient, sustainable futures.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Preferences & Operations */}
        {activeTab === 'preferences' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <span>Operational & Display Preferences</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure operational flags, maintenance mode emergency controls, pagination defaults, and email notification identity.
              </p>
            </div>

            <div className="space-y-6">
              {/* Maintenance Mode Control */}
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${form.maintenanceMode ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>Website Maintenance Mode</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      When enabled, public visitors are shown a maintenance screen while admin staff retain full dashboard access.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={!!form.maintenanceMode}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {form.maintenanceMode && (
                  <div className="pt-3 border-t border-slate-700/60">
                    <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                      Public Maintenance Notice Message
                    </label>
                    <textarea
                      name="maintenanceNotice"
                      rows={2}
                      value={form.maintenanceNotice || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-amber-500/40 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                      placeholder="We are performing scheduled maintenance to enhance our community portal. Please check back shortly."
                    />
                  </div>
                )}
              </div>

              {/* Public Application Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Allow Public Volunteer Registrations</div>
                    <div className="text-[11px] text-slate-400">Controls acceptance on /volunteer page.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowPublicVolunteers"
                      checked={!!form.allowPublicVolunteers}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Allow Partner Proposals</div>
                    <div className="text-[11px] text-slate-400">Controls acceptance on /partner page.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowPublicPartnerProposals"
                      checked={!!form.allowPublicPartnerProposals}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Display defaults */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Default Items Per Page
                  </label>
                  <select
                    name="itemsPerPage"
                    value={form.itemsPerPage || 12}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value={6}>6 items</option>
                    <option value={9}>9 items</option>
                    <option value={12}>12 items (Default)</option>
                    <option value={24}>24 items</option>
                    <option value={48}>48 items</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    System Date Format
                  </label>
                  <select
                    name="dateFormat"
                    value={form.dateFormat || 'MMMM D, YYYY'}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="MMMM D, YYYY">October 29, 2026 (Full month)</option>
                    <option value="DD/MM/YYYY">29/10/2026 (British/Ghanaian standard)</option>
                    <option value="YYYY-MM-DD">2026-10-29 (ISO 8601)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Operational Timezone
                  </label>
                  <input
                    type="text"
                    name="timezone"
                    value={form.timezone || 'GMT (UTC+0)'}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="GMT (UTC+0)"
                  />
                </div>
              </div>

              {/* Email Notification Dispatcher Defaults */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Automated Outgoing Email Dispatch Identity
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      name="emailSenderName"
                      value={form.emailSenderName || 'AERC Ghana Management'}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="AERC Ghana Management"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Sender "From" Email
                    </label>
                    <input
                      type="email"
                      name="emailSenderAddress"
                      value={form.emailSenderAddress || 'no-reply@aercghana.net'}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="no-reply@aercghana.net"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Internal Admin Alert Email
                    </label>
                    <input
                      type="email"
                      name="adminAlertEmail"
                      value={form.adminAlertEmail || 'admin@aercghana.net'}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="admin@aercghana.net"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Technical Settings & Security (Separation of Concerns) */}
        {activeTab === 'technical' && (
          <div className="space-y-6">
            {/* Architecture Separation Notice */}
            <div className="p-6 rounded-2xl bg-blue-950/40 border border-blue-800/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-300">
                    Security Architecture: Separation of Technical Configuration
                  </h3>
                  <p className="text-xs text-blue-400/80 mt-0.5">
                    Production secrets, database credentials, and cryptographic keys are strictly isolated in server-side configuration.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                As required by system compliance, sensitive infrastructure secrets (such as <code className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-[11px]">DATABASE_URL</code>, <code className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-[11px]">JWT_SECRET</code>, and <code className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-[11px]">CLOUDINARY_API_SECRET</code>) remain in secure server environment files (<code className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-[11px]">.env</code>) and are never exposed over the dashboard network or rendered to client browsers.
              </p>
            </div>

            {/* Health & Diagnostic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Database Engine</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Neon PostgreSQL</span>
                </div>
                <div className="text-xs text-emerald-400 font-medium">Status: Connected</div>
                <div className="text-[11px] text-slate-500">Serverless connection pooling via WebSocket/HTTP.</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Media CDN Storage</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${diagnostics.cloudinaryConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Cloudinary CDN</span>
                </div>
                <div className="text-xs text-emerald-400 font-medium">
                  Cloud: {diagnostics.cloudinaryCloudName}
                </div>
                <div className="text-[11px] text-slate-500">API secrets safely masked & server-side isolated.</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Authentication Service</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Stateless JWT</span>
                </div>
                <div className="text-xs text-emerald-400 font-medium">HS256 with HttpOnly Cookies</div>
                <div className="text-[11px] text-slate-500">SameSite=Lax session cookie protection active.</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Application Framework</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Next.js {diagnostics.nextVersion}</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">React 19 Server Components</div>
                <div className="text-[11px] text-slate-500">Environment: {diagnostics.nodeEnv}</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Server Clock & Region</span>
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="text-sm font-bold text-white">GMT (Africa/Accra)</div>
                <div className="text-xs text-slate-400 font-mono">{diagnostics.serverTime}</div>
                <div className="text-[11px] text-slate-500">Synchronized via Network Time Protocol.</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Data Compliance</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-sm font-bold text-white">Ghana Data Protection Act</div>
                <div className="text-xs text-emerald-400 font-medium">Act 843 (2012) Retention Guard</div>
                <div className="text-[11px] text-slate-500">Automated retention lifecycle & audit logging.</div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Persistent Action Bar */}
        {activeTab !== 'technical' && (
          <div className="sticky bottom-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Editing active website configuration. Changes will apply immediately upon saving.</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Publish Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Media Library Picker Modal */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 max-h-[80vh] flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Select Asset from Media Library</span>
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, [mediaPickerTarget]: item.url }));
                    setMediaPickerTarget(null);
                  }}
                  className="group p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500 hover:bg-slate-800 cursor-pointer transition-all flex flex-col items-center gap-2 text-center"
                >
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-300 truncate w-full">{item.title}</div>
                  <div className="text-[9px] text-slate-500 uppercase">{item.category}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
