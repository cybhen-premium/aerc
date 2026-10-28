'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  FileEdit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Archive,
  Clock,
} from 'lucide-react';
import { Project } from '@/db/schema';
import {
  deleteProjectAction,
  updateProjectStatusAction,
  toggleProjectFeaturedAction,
} from '../../actions';

interface ProjectsTableClientProps {
  initialProjects: Project[];
}

export const PROJECT_FOCUS_AREAS = [
  'Community-Led Adaptation',
  'Renewable Energy',
  'Clean Cooking',
  'Climate Finance',
  'Youth & Schools',
  'SDG Watch',
  'Youth Climate Policy',
  'Nature-Based Solutions',
  'Urban & Infrastructure Development',
  'Plastics & Waste Management',
];

export const PROJECT_STATUSES = ['Planned', 'Ongoing', 'Completed', 'Archived'];

export default function ProjectsTableClient({ initialProjects }: ProjectsTableClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedFeatured, setSelectedFeatured] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'id'>('id');
  const [deleteModalProject, setDeleteModalProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats calculation
  const totalCount = projects.length;
  const ongoingCount = projects.filter((p) => (p.status || 'Ongoing').toLowerCase() === 'ongoing' || (p.status || '').toLowerCase() === 'active').length;
  const plannedCount = projects.filter((p) => (p.status || '').toLowerCase() === 'planned').length;
  const completedCount = projects.filter((p) => (p.status || '').toLowerCase() === 'completed').length;
  const featuredCount = projects.filter((p) => p.isFeatured === 'yes').length;

  // Filtered & Sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch =
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.location && project.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.partners && project.partners.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFocus =
          selectedFocus === 'ALL' ||
          project.tag.toLowerCase() === selectedFocus.toLowerCase() ||
          (project.focusArea && project.focusArea.toLowerCase() === selectedFocus.toLowerCase());

        const projStatus = (project.status || 'Ongoing').toLowerCase();
        const matchesStatus =
          selectedStatus === 'ALL' ||
          projStatus === selectedStatus.toLowerCase() ||
          (selectedStatus.toLowerCase() === 'ongoing' && projStatus === 'active');

        const matchesFeatured =
          selectedFeatured === 'ALL' ||
          (selectedFeatured === 'featured' && project.isFeatured === 'yes') ||
          (selectedFeatured === 'standard' && project.isFeatured !== 'yes');

        return matchesSearch && matchesFocus && matchesStatus && matchesFeatured;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'status') {
          return (a.status || '').localeCompare(b.status || '');
        }
        return a.id - b.id;
      });
  }, [projects, searchQuery, selectedFocus, selectedStatus, selectedFeatured, sortBy]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await updateProjectStatusAction(id, newStatus);
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured;
    const res = await toggleProjectFeaturedAction(id, nextFeatured);
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isFeatured: nextFeatured ? 'yes' : 'no' } : p
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Impact Operations & Campaigns</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Projects Management System
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Oversee frontline field initiatives, renewable energy programs, community gardens, school climate clubs, and policy campaigns across Ghana.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Initiatives</div>
            <div className="text-2xl font-bold text-white mt-1">{totalCount}</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Across Ghana</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ongoing / Active</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{ongoingCount}</div>
            <div className="text-[11px] text-emerald-500 mt-0.5">Active field programs</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Planned Pipeline</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{plannedCount}</div>
            <div className="text-[11px] text-cyan-500 mt-0.5">Upcoming rollout</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-800/50">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{completedCount}</div>
            <div className="text-[11px] text-blue-500 mt-0.5">Archived milestones</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/50 text-blue-400 border border-blue-800/50">
            <Archive className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between col-span-2 md:col-span-1">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Featured Home</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{featuredCount}</div>
            <div className="text-[11px] text-amber-500 mt-0.5">Top spotlight</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/50 text-amber-400 border border-amber-800/50">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search and Multi-Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, summary, location, partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Focus Area Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedFocus}
              onChange={(e) => setSelectedFocus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 max-w-[180px] truncate"
            >
              <option value="ALL">All Focus Areas</option>
              {PROJECT_FOCUS_AREAS.map((focus) => (
                <option key={focus} value={focus}>
                  {focus}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            {PROJECT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Featured Filter */}
          <select
            value={selectedFeatured}
            onChange={(e) => setSelectedFeatured(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Visibility</option>
            <option value="featured">Featured on Homepage</option>
            <option value="standard">Standard Projects</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="id">Sort by ID</option>
              <option value="title">Sort by Title (A-Z)</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Projects Directory Grid / Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Active &amp; Archived Initiatives</h2>
          </div>
          <span className="text-xs text-slate-400">
            Showing {filteredProjects.length} of {totalCount} initiatives
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No projects found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No initiatives match your current search or filter criteria. Try resetting filters or add a new project.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredProjects.map((project) => {
              const isFeatured = project.isFeatured === 'yes';
              const projStatus = project.status || 'Ongoing';

              return (
                <div
                  key={project.id}
                  className="p-5 hover:bg-slate-850/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left Column: Image & Details */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0 relative group">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as any).src = '/images/hero-community.jpg';
                        }}
                      />
                      {isFeatured && (
                        <div
                          className="absolute top-1 right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow"
                          title="Featured on Homepage"
                        >
                          <Star className="w-3 h-3 fill-slate-950" />
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {project.tag}
                        </span>

                        {/* Status Dropdown */}
                        <select
                          value={projStatus}
                          onChange={(e) => handleStatusChange(project.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border focus:outline-none transition-colors cursor-pointer ${
                            projStatus === 'Ongoing' || projStatus === 'Active'
                              ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                              : projStatus === 'Planned'
                              ? 'bg-cyan-950/90 text-cyan-400 border-cyan-800'
                              : projStatus === 'Completed'
                              ? 'bg-blue-950/90 text-blue-400 border-blue-800'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="Ongoing">Ongoing</option>
                          <option value="Planned">Planned</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>

                        {/* Featured Star Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project.id, isFeatured)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1 transition-colors ${
                            isFeatured
                              ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-amber-400'
                          }`}
                          title={isFeatured ? 'Click to unfeature from homepage' : 'Click to feature on homepage'}
                        >
                          <Star className={`w-3 h-3 ${isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                          <span>{isFeatured ? 'Featured' : 'Feature'}</span>
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-2xl">
                        {project.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-500">
                        {project.location && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{project.location}</span>
                          </span>
                        )}
                        {project.startDate && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span>
                              {project.startDate}
                              {project.endDate ? ` – ${project.endDate}` : ' – Ongoing'}
                            </span>
                          </span>
                        )}
                        <span className="text-slate-500 font-mono">
                          /projects/{project.slug}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview Live</span>
                    </Link>

                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-200 text-xs font-semibold border border-emerald-800/60 transition-colors flex items-center gap-1.5"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Edit Project</span>
                    </Link>

                    <button
                      onClick={() => setDeleteModalProject(project)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 transition-colors"
                      title="Delete or archive project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Delete Confirmation Modal */}
      {deleteModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Project</h3>
                <p className="text-xs text-slate-400">Permanent removal from database</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the project{' '}
              <strong className="text-white font-semibold">"{deleteModalProject.title}"</strong>?
              If you only want to take it down from the website, consider changing its status to{' '}
              <strong className="text-slate-200">Archived</strong> instead.
            </p>

            <form
              action={async (formData) => {
                setIsDeleting(true);
                await deleteProjectAction(formData);
                setProjects((prev) => prev.filter((p) => p.id !== deleteModalProject.id));
                setDeleteModalProject(null);
                setIsDeleting(false);
              }}
              className="flex items-center justify-end gap-3 pt-2"
            >
              <input type="hidden" name="id" value={deleteModalProject.id} />
              <button
                type="button"
                onClick={() => setDeleteModalProject(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-colors flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Project</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
