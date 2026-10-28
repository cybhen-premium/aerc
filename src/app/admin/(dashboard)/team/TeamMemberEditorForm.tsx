'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Phone,
  GraduationCap,
  Briefcase,
  History,
  CheckCircle2,
  AlertCircle,
  Star,
  ExternalLink,
  Award,
  Lock,
  Unlock,
  ShieldCheck,
} from 'lucide-react';
import { TeamMember, TeamMemberRevision } from '@/db/schema';
import { createTeamMemberAction, updateTeamMemberAction } from '../../actions';
import { TEAM_CATEGORIES } from './TeamTableClient';

interface TeamMemberEditorFormProps {
  initialMember?: TeamMember | null;
  revisions?: TeamMemberRevision[];
  isNew?: boolean;
}

const AVATAR_PRESETS = [
  { label: 'Desmond Sena Kofi Foe', url: 'https://aercghana.org/wp-content/uploads/2025/07/DESMOND.jpg' },
  { label: 'Carlisle Naa Dodua Dodoo', url: 'https://aercghana.org/wp-content/uploads/2025/07/DODOA-1.jpg' },
  { label: 'Nicholas Selady Sekpey', url: 'https://aercghana.org/wp-content/uploads/2025/07/1.jpg' },
  { label: 'Sandra Efua Attah Dickson', url: 'https://aercghana.org/wp-content/uploads/2025/07/WhatsApp-Image-2026-05-25-at-2.38.19-PM-e1779720138791.jpeg' },
  { label: 'Yvette Ahenkorah', url: 'https://aercghana.org/wp-content/uploads/2025/07/YVETTE-1.jpg' },
  { label: 'Siisi Ansah', url: 'https://aercghana.org/wp-content/uploads/2025/07/SIISI-1.jpg' },
  { label: 'Richard Matey', url: '/images/hero-forest-1.jpg' },
  { label: 'Eco-Education Coordinator', url: '/images/projects/club.jpg' },
  { label: 'Grassroots Community', url: '/images/hero-community.jpg' },
];

export default function TeamMemberEditorForm({
  initialMember,
  revisions = [],
  isNew = false,
}: TeamMemberEditorFormProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'revisions'>('edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core fields
  const [name, setName] = useState(initialMember?.name || '');
  const [slug, setSlug] = useState(initialMember?.slug || '');
  const [slugLocked, setSlugLocked] = useState(!isNew);
  const [role, setRole] = useState(initialMember?.role || '');
  const [category, setCategory] = useState(initialMember?.category || 'leadership');
  const [bio, setBio] = useState(initialMember?.bio || '');
  const [expertise, setExpertise] = useState(initialMember?.expertise || '');
  const [qualifications, setQualifications] = useState(initialMember?.qualifications || '');

  // Media and Contact
  const [image, setImage] = useState(
    initialMember?.image || 'https://aercghana.org/wp-content/uploads/2025/07/DESMOND.jpg'
  );
  const [email, setEmail] = useState(initialMember?.email || '');
  const [phone, setPhone] = useState(initialMember?.phone || '');
  const [linkedin, setLinkedin] = useState(initialMember?.linkedin || '');
  const [twitter, setTwitter] = useState(initialMember?.twitter || '');
  const [facebook, setFacebook] = useState(initialMember?.facebook || '');

  // Organization & Status
  const [displayOrder, setDisplayOrder] = useState<number>(initialMember?.displayOrder || 1);
  const [isFeatured, setIsFeatured] = useState(initialMember?.isFeatured === 'yes');
  const [status, setStatus] = useState(initialMember?.status || 'active');
  const [changeSummary, setChangeSummary] = useState('');

  // Auto-generate slug when title changes (if unlocked)
  const handleNameChange = (val: string) => {
    setName(val);
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/admin/team" className="hover:text-emerald-400 transition-colors">
              Team & Leadership
            </Link>
            <span>/</span>
            <span className="text-slate-200">{isNew ? 'New Profile' : 'Edit Profile'}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-400" />
            {isNew ? 'Add Team Member Profile' : `Edit: ${initialMember?.name}`}
          </h1>
          <p className="text-sm text-slate-400">
            {isNew
              ? 'Create a leadership, officer, board, or volunteer advocate profile for AERC Ghana.'
              : 'Update member biography, role titles, contact channels, and organizational credentials.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/team"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>
          <button
            type="submit"
            form="team-editor-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-xs shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Profile...' : isNew ? 'Publish Profile' : 'Save Changes'}</span>
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
          <Users className="w-4 h-4" />
          <span>Profile Details</span>
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
          id="team-editor-form"
          action={isNew ? createTeamMemberAction : updateTeamMemberAction}
          onSubmit={() => setIsSubmitting(true)}
          className="space-y-6"
        >
          {!isNew && initialMember && (
            <input type="hidden" name="id" value={initialMember.id} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MAIN COLUMN (LEFT 2 COLUMNS) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal & Professional Info */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Users className="w-4 h-4 text-emerald-400" />
                  General Member Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Desmond Sena Kofi Foe"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  {/* Job Title / Role */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Job Title / Organizational Role <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="role"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g., Executive Director or Renewable Energy Lead"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>

                {/* Slug with Lock/Unlock */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Profile URL Slug
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
                    placeholder="desmond-sena-kofi-foe"
                    className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2 text-xs font-mono transition-all ${
                      slugLocked
                        ? 'text-slate-400 border-slate-800 cursor-not-allowed bg-slate-950/40'
                        : 'text-emerald-400 border-emerald-500/50 focus:outline-none'
                    }`}
                  />
                </div>

                {/* Category & Display Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Personnel Category / Group <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {TEAM_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Display Order Priority
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      min="1"
                      max="99"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Lower numbers appear first within their category.
                    </span>
                  </div>
                </div>

                {/* Biography */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Professional Biography
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a comprehensive biography outlining organizational responsibilities, background, and dedication to grassroots climate action..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Areas of Expertise & Qualifications */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  Expertise & Credentials
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Areas of Expertise
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="e.g. Just Energy Transition, Decentralized Mini-Grids, Community Agroforestry, Climate Finance"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Comma-separated list of core thematic and technical specializations.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Professional Qualifications & Academic Degrees
                  </label>
                  <input
                    type="text"
                    name="qualifications"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="e.g. B.Sc. Natural Resources & Environmental Governance (KNUST)"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Contact Channels & Social Media */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  Contact & Approved Social Media
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Organizational Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. desmond@aercghana.org"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 24 123 4567"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Twitter / X Profile URL
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Facebook / Other Profile URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Revision Log Note (When editing) */}
              {!isNew && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <History className="w-4 h-4 text-emerald-400" />
                    Revision Log Note
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Summary of Profile Changes
                    </label>
                    <input
                      type="text"
                      name="changeSummary"
                      value={changeSummary}
                      onChange={(e) => setChangeSummary(e.target.value)}
                      placeholder="e.g. Updated job title, added qualifications, refreshed profile photograph"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR COLUMN (RIGHT 1 COLUMN) */}
            <div className="space-y-6">
              {/* Profile Status & Controls */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Profile Status
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Active Status
                  </label>
                  <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="active">Active (Visible Publicly)</option>
                    <option value="inactive">Inactive / Archived</option>
                  </select>
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
                        Featured Leadership Profile
                      </span>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                        Feature this person prominently on the homepage and about page showcase.
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
                    <span>{isSubmitting ? 'Saving...' : isNew ? 'Publish Profile' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

              {/* Profile Photograph Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  Profile Photograph
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... or /images/..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Photo Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square flex items-center justify-center">
                  {image ? (
                    <img
                      src={image}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-500">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">No photograph selected</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono border border-slate-800">
                    Preview
                  </div>
                </div>

                {/* Preset image suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400">Authentic team photos from archive:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        title={preset.label}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative group ${
                          image === preset.url
                            ? 'border-emerald-400 scale-105 shadow-md'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover object-top"
                        />
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
              Live preview of how this person&apos;s card renders on the public Team and About pages.
            </span>
            <span className="text-emerald-400 font-medium">Status: {status}</span>
          </div>

          {/* Public Team Member Card Preview */}
          <div className="max-w-md mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all backdrop-blur-md shadow-2xl relative overflow-hidden">
            {isFeatured && (
              <div className="absolute top-4 right-4 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" />
                Featured
              </div>
            )}

            <div>
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-5 border-2 border-emerald-500/40 relative shadow-xl">
                <img
                  src={image || '/images/hero-community.jpg'}
                  alt={name || 'Team Member'}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                {role || 'Organizational Role'}
              </div>

              <h3 className="text-xl font-bold text-white">
                {name || 'Full Name'}
              </h3>

              {qualifications && (
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{qualifications}</span>
                </div>
              )}

              <p className="text-xs text-slate-400 leading-relaxed mt-3">
                {bio || 'Biography will appear here describing programmatic responsibilities and dedication to community empowerment.'}
              </p>

              {expertise && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                    Key Expertise:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {expertise.split(',').map((exp, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[10px] font-medium"
                      >
                        {exp.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
                    title={email}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
                {twitter && (
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <span className="text-[10px] text-slate-500 font-mono">
                Order: #{displayOrder}
              </span>
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
              No previous revisions recorded for this profile yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {revisions.map((rev) => (
                <div key={rev.id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-white">{rev.changeSummary || 'Profile update'}</p>
                    <p className="text-slate-400 mt-0.5">
                      Name: <span className="text-slate-300">{rev.name}</span> • Role: <span className="text-emerald-400">{rev.role}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Group: <span className="capitalize">{rev.category}</span> • Status: {rev.status}
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
