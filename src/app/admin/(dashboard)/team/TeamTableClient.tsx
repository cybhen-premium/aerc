'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Plus,
  FileEdit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Mail,
  Linkedin,
  Twitter,
  Award,
  Sparkles,
  ArrowUpDown,
  GraduationCap,
  Briefcase,
  Phone,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { TeamMember } from '@/db/schema';
import {
  deleteTeamMemberAction,
  updateTeamMemberStatusAction,
  toggleTeamMemberFeaturedAction,
  updateTeamMemberOrderAction,
} from '../../actions';

export const TEAM_CATEGORIES = [
  { value: 'leadership', label: 'Executive Leadership & Governance' },
  { value: 'officers', label: 'Officers & Program Leads' },
  { value: 'board', label: 'Advisory Board & Trustees' },
  { value: 'volunteers', label: 'Volunteers & Youth Advocates' },
] as const;

interface TeamTableClientProps {
  initialMembers: TeamMember[];
}

export default function TeamTableClient({ initialMembers }: TeamTableClientProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedFeatured, setSelectedFeatured] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'category'>('order');
  const [deleteModalItem, setDeleteModalItem] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Statistics
  const totalCount = members.length;
  const leadershipCount = members.filter((m) => m.category === 'leadership').length;
  const officersCount = members.filter((m) => m.category === 'officers').length;
  const volunteersCount = members.filter((m) => m.category === 'volunteers').length;
  const featuredCount = members.filter((m) => m.isFeatured === 'yes').length;

  // Filtered and sorted
  const filteredMembers = useMemo(() => {
    return members
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query) ||
          (item.bio && item.bio.toLowerCase().includes(query)) ||
          (item.expertise && item.expertise.toLowerCase().includes(query)) ||
          (item.qualifications && item.qualifications.toLowerCase().includes(query)) ||
          (item.email && item.email.toLowerCase().includes(query));

        const matchesCategory =
          selectedCategory === 'ALL' ||
          (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

        const itemStatus = (item.status || 'active').toLowerCase();
        const matchesStatus =
          selectedStatus === 'ALL' || itemStatus === selectedStatus.toLowerCase();

        const matchesFeatured =
          selectedFeatured === 'ALL' ||
          (selectedFeatured === 'featured' && item.isFeatured === 'yes') ||
          (selectedFeatured === 'standard' && item.isFeatured !== 'yes');

        return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
      })
      .sort((a, b) => {
        if (sortBy === 'order') {
          return (a.displayOrder || 1) - (b.displayOrder || 1);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return (a.category || '').localeCompare(b.category || '');
      });
  }, [members, searchQuery, selectedCategory, selectedStatus, selectedFeatured, sortBy]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    try {
      await updateTeamMemberStatusAction(id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: string | null | undefined) => {
    const nextFeatured = currentFeatured === 'yes' ? 'no' : 'yes';
    setMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFeatured: nextFeatured } : item))
    );
    try {
      await toggleTeamMemberFeaturedAction(id, nextFeatured === 'yes');
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    }
  };

  const handleOrderChange = async (id: number, order: number) => {
    setMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, displayOrder: order } : item))
    );
    try {
      await updateTeamMemberOrderAction(id, order);
    } catch (error) {
      console.error('Failed to update display order:', error);
    }
  };

  const getCategoryBadgeClass = (category?: string | null) => {
    switch (category) {
      case 'leadership':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'officers':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'board':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'volunteers':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      default:
        return 'bg-slate-700/20 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Team & Leadership</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-400" />
            Team Members & Leadership Management
          </h1>
          <p className="text-sm text-slate-400">
            Manage executive leadership profiles, program officers, advisory board, and community volunteer advocates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/team"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Team Page</span>
          </Link>
          <Link
            href="/admin/team/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium text-sm shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Profiles</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{totalCount}</p>
          <span className="text-[11px] text-emerald-400 font-medium">All personnel & volunteers</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Leadership</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{leadershipCount}</p>
          <span className="text-[11px] text-amber-400 font-medium">Executive & Governance</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Program Officers</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{officersCount}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Thematic area leads</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Volunteers</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{volunteersCount}</p>
          <span className="text-[11px] text-blue-400 font-medium">Grassroots advocates</span>
        </div>

        <div className="col-span-2 md:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Featured</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 tracking-tight">{featuredCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">Highlighted on homepage</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search name, job title, expertise, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter team by category"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="ALL">All Categories ({totalCount})</option>
              {TEAM_CATEGORIES.map((cat) => {
                const count = members.filter((m) => m.category === cat.value).length;
                return (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter team by status"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div className="md:col-span-1">
            <select
              value={selectedFeatured}
              onChange={(e) => setSelectedFeatured(e.target.value)}
              aria-label="Filter team by featured status"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="ALL">All</option>
              <option value="featured">★</option>
              <option value="standard">Standard</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort team members"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="order">Display Order (#)</option>
              <option value="name">Name (A-Z)</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedFeatured !== 'ALL') && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400">
              Showing {filteredMembers.length} of {totalCount} profiles
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSelectedFeatured('ALL');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-medium ml-2 underline text-[11px]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* TEAM MEMBERS TABLE */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-3 font-semibold w-10 text-center">★</th>
                <th className="py-3.5 px-3 font-semibold w-16 text-center">Order</th>
                <th className="py-3.5 px-4 font-semibold">Team Member & Role</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Expertise & Credentials</th>
                <th className="py-3.5 px-4 font-semibold">Contact & Social</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium text-slate-300">No team profiles matched your search.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try searching with different terms or clearing active filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const isMemberFeatured = member.isFeatured === 'yes';
                  const memberStatus = (member.status || 'active').toLowerCase();

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Featured Star Toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(member.id, member.isFeatured)}
                          title={isMemberFeatured ? 'Featured on home/about (click to unfeature)' : 'Mark as Featured'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isMemberFeatured
                              ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10'
                              : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isMemberFeatured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Display Order */}
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="number"
                          min="1"
                          max="99"
                          defaultValue={member.displayOrder || 1}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val !== member.displayOrder) {
                              handleOrderChange(member.id, val);
                            }
                          }}
                          className="w-12 bg-slate-950/80 border border-slate-800 rounded-lg text-center py-1 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                          title="Edit display order priority"
                        />
                      </td>

                      {/* Profile Photo & Name */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0">
                            <img
                              src={member.image || '/images/hero-community.jpg'}
                              alt={member.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/team/${member.id}/edit`}
                              className="font-semibold text-white text-sm hover:text-emerald-400 transition-colors truncate block"
                            >
                              {member.name}
                            </Link>
                            <span className="text-emerald-400 text-xs font-medium block truncate">
                              {member.role}
                            </span>
                            {member.slug && (
                              <span className="text-[10px] text-slate-500 font-mono block">
                                slug: {member.slug}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${getCategoryBadgeClass(
                            member.category
                          )}`}
                        >
                          {member.category === 'leadership'
                            ? 'Executive'
                            : member.category === 'officers'
                            ? 'Officer / Lead'
                            : member.category === 'board'
                            ? 'Advisory Board'
                            : 'Volunteer'}
                        </span>
                      </td>

                      {/* Expertise & Qualifications */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {member.expertise && (
                          <p className="text-slate-300 text-xs truncate" title={member.expertise}>
                            <span className="text-slate-400 font-medium">Expertise:</span> {member.expertise}
                          </p>
                        )}
                        {member.qualifications && (
                          <p className="text-slate-400 text-[11px] truncate mt-0.5" title={member.qualifications}>
                            <span className="text-slate-400 font-medium">Cred:</span> {member.qualifications}
                          </p>
                        )}
                        {!member.expertise && !member.qualifications && (
                          <span className="text-slate-500 text-xs italic">No specific credentials listed</span>
                        )}
                      </td>

                      {/* Contact & Social Links */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              title={member.email}
                              className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="LinkedIn Profile"
                              className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                            >
                              <Linkedin className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {member.twitter && (
                            <a
                              href={member.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Twitter / X Profile"
                              className="p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                            >
                              <Twitter className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {member.phone && (
                            <span title={member.phone} className="p-1 text-slate-400">
                              <Phone className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={memberStatus}
                          onChange={(e) => handleStatusChange(member.id, e.target.value)}
                          aria-label={`Change status for ${member.name}`}
                          className={`text-[11px] font-medium rounded-lg px-2 py-1 border focus:outline-none transition-colors cursor-pointer ${
                            memberStatus === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-700/20 text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="active" className="bg-slate-900 text-emerald-400">
                            Active
                          </option>
                          <option value="inactive" className="bg-slate-900 text-slate-400">
                            Inactive
                          </option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/team/${member.id}/edit`}
                            title="Edit Team Profile"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <FileEdit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteModalItem(member)}
                            title="Delete Team Profile"
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
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

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Remove Team Member</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5 flex items-center gap-3">
              <img
                src={deleteModalItem.image || '/images/hero-community.jpg'}
                alt={deleteModalItem.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-white font-semibold text-sm">{deleteModalItem.name}</p>
                <p className="text-emerald-400 font-medium">{deleteModalItem.role}</p>
                <p className="text-slate-400 capitalize">Group: {deleteModalItem.category}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to remove this person from the team roster? The profile will no longer be visible on the public Team page.
            </p>

            <form action={deleteTeamMemberAction} onSubmit={() => setIsDeleting(true)}>
              <input type="hidden" name="id" value={deleteModalItem.id} />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 transition-all flex items-center gap-2"
                >
                  {isDeleting ? 'Deleting...' : 'Remove Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
