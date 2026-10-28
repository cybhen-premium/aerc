'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  ArrowRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';
import { Project } from '@/db/schema';

interface ProjectsDirectoryClientProps {
  initialProjects: Project[];
}

export default function ProjectsDirectoryClient({
  initialProjects,
}: ProjectsDirectoryClientProps) {
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  // Extract unique tags/focus areas from projects
  const tags = useMemo(() => {
    const list = Array.from(new Set(initialProjects.map((p) => p.tag).filter(Boolean)));
    return ['ALL', ...list];
  }, [initialProjects]);

  // Filter projects by tag and visibility
  const displayedProjects = useMemo(() => {
    return initialProjects
      .filter((p) => p.isPublic !== 'no' && p.status !== 'Archived')
      .filter((p) => (selectedTag === 'ALL' ? true : p.tag.toLowerCase() === selectedTag.toLowerCase()));
  }, [initialProjects, selectedTag]);

  return (
    <div className="space-y-12">
      {/* Focus Area Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {tags.map((t) => {
          const isSelected = selectedTag.toLowerCase() === t.toLowerCase();
          return (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-950/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Initiatives' : t}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {displayedProjects.length === 0 ? (
        <div className="p-16 text-center bg-slate-50 rounded-3xl border border-slate-100 max-w-lg mx-auto">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No initiatives found in this focus area</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try choosing a different focus area pill above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => {
            const parsedStats = (() => {
              if (!project.impactStats) return [];
              try {
                return JSON.parse(project.impactStats);
              } catch {
                return [];
              }
            })();

            const projStatus = project.status || 'Ongoing';

            return (
              <div
                key={project.id || project.slug}
                className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                {/* Image Cover */}
                <div className="h-56 relative overflow-hidden bg-slate-100">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as any).src = '/images/hero-community.jpg';
                    }}
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-800/90 backdrop-blur-sm text-white shadow">
                      {project.tag}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow ${
                        projStatus === 'Ongoing' || projStatus === 'Active'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                          : projStatus === 'Planned'
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-700/60'
                      }`}
                    >
                      {projStatus}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {project.summary}
                    </p>

                    {/* Metadata Ribbon: Location & Timeline */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-slate-100">
                      {project.location && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{project.location}</span>
                        </span>
                      )}
                      {project.startDate && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {project.startDate}
                            {project.endDate ? ` – ${project.endDate}` : ' – Ongoing'}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Quick Stats Highlights (if any) */}
                    {parsedStats.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {parsedStats.slice(0, 2).map((st: any, i: number) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center"
                          >
                            <div className="text-sm font-extrabold text-emerald-800">
                              {st.value}
                            </div>
                            <div className="text-[10px] text-slate-600 truncate uppercase font-semibold">
                              {st.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Read More Link */}
                  <div className="pt-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-600 group-hover:translate-x-1 transition-all"
                    >
                      <span>Explore Initiative</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
