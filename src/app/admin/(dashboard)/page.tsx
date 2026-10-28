import Link from 'next/link';
import {
  getDashboardStats,
  getAllPartnerApplications,
  getAllVolunteerApplications,
  getFocusAreas,
} from '@/db';
import {
  MessageSquare,
  Handshake,
  Users,
  Mail,
  BookOpen,
  FileText,
  Briefcase,
  ArrowUpRight,
  Clock,
  Heart,
  Globe,
  UserCheck,
  Shield,
  PlusCircle,
  FileEdit,
  Upload,
  AlertCircle,
  CheckCircle2,
  Activity,
  Layers,
  ChevronRight,
  Target,
  Image as ImageIcon,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const [stats, partnerApps, volunteers, focusAreas] = await Promise.all([
    getDashboardStats(),
    getAllPartnerApplications(),
    getAllVolunteerApplications(),
    getFocusAreas(),
  ]);

  // Primary 6 Dashboard Cards requested in specification
  const primaryCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      info: 'Published articles & news',
      href: '/admin/blogs',
      icon: BookOpen,
      gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      badge: 'Live on Site',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      info: 'Initiatives & campaigns managed',
      href: '/admin/projects',
      icon: Briefcase,
      gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      badge: 'Active Campaigns',
      badgeColor: 'bg-amber-950 text-amber-400 border-amber-800',
    },
    {
      title: 'Publications',
      value: stats.totalPublications,
      info: 'Available reports & briefs',
      href: '/admin/publications',
      icon: FileText,
      gradient: 'from-indigo-500/20 via-indigo-500/10 to-transparent',
      textColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      badge: 'PDF Resources',
      badgeColor: 'bg-indigo-950 text-indigo-400 border-indigo-800',
    },
    {
      title: 'Team Members',
      value: stats.totalTeamMembers,
      info: 'Active leadership profiles',
      href: '/admin/team',
      icon: UserCheck,
      gradient: 'from-teal-500/20 via-teal-500/10 to-transparent',
      textColor: 'text-teal-400',
      borderColor: 'border-teal-500/30',
      badge: 'Roster Active',
      badgeColor: 'bg-teal-950 text-teal-400 border-teal-800',
    },
    {
      title: 'Contact Enquiries',
      value: stats.unreadInquiries,
      info: stats.unreadInquiries > 0 ? `${stats.unreadInquiries} awaiting response` : 'All enquiries answered',
      href: '/admin/inquiries',
      icon: MessageSquare,
      gradient: 'from-rose-500/20 via-rose-500/10 to-transparent',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      badge: stats.unreadInquiries > 0 ? 'Action Needed' : 'Up to Date',
      badgeColor: stats.unreadInquiries > 0 ? 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700',
    },
    {
      title: 'Pending Content',
      value: stats.pendingContent,
      info: 'Content awaiting approval',
      href: '/admin/blogs?status=draft',
      icon: AlertCircle,
      gradient: 'from-purple-500/20 via-purple-500/10 to-transparent',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      badge: stats.pendingContent > 0 ? 'In Review' : '0 Pending',
      badgeColor: 'bg-purple-950 text-purple-400 border-purple-800',
    },
  ];

  // Secondary metrics row
  const secondaryMetrics = [
    {
      label: 'Focus Areas & Pillars',
      value: focusAreas.length,
      desc: 'Thematic pillars & sub-areas',
      href: '/admin/focus-areas',
      icon: Target,
      color: 'text-amber-400',
    },
    {
      label: 'Website Pages',
      value: stats.totalPages,
      desc: 'Managed frontend pages',
      href: '/admin/pages',
      icon: Globe,
      color: 'text-cyan-400',
    },
    {
      label: 'Admin Users',
      value: stats.totalAdmins,
      desc: 'Authorized credentials',
      href: '/admin/users',
      icon: Shield,
      color: 'text-emerald-400',
    },
    {
      label: 'Media Library',
      value: stats.totalMedia,
      desc: 'Images & cloud assets',
      href: '/admin/media',
      icon: ImageIcon,
      color: 'text-teal-400',
    },
    {
      label: 'Grassroots Donations',
      value: stats.donationsCount,
      desc: 'Solidarity contributions',
      href: '/admin/donations',
      icon: Heart,
      color: 'text-rose-400',
    },
    {
      label: 'Newsletter Reach',
      value: stats.subscribersCount,
      desc: 'Verified subscribers',
      href: '/admin/subscribers',
      icon: Mail,
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Quick Actions */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live System Operational &bull; Neon PostgreSQL Connected</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              AERC Management Console
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
              Real-time oversight of AERC Ghana’s climate justice campaigns, policy research,
              grassroots solidarity gifts, and public-facing content.
            </p>
          </div>

          {/* Quick-Action Buttons requested in specification */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Article</span>
            </Link>
            <Link
              href="/admin/media"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-teal-400" />
              <span>Media Library</span>
            </Link>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Add Project</span>
            </Link>
            <Link
              href="/admin/focus-areas"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Focus Areas</span>
            </Link>
            <Link
              href="/admin/publications/new"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Upload Publication</span>
            </Link>
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Manage Pages</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Primary Dashboard Cards (Requested 6 Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Content &amp; Operational Metrics</span>
          </h2>
          <span className="text-xs text-slate-400">Synchronized with PostgreSQL</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {primaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all hover:-translate-y-1 block shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} border ${card.borderColor} flex items-center justify-center ${card.textColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>

                <div className="text-3xl font-extrabold text-white tracking-tight mt-1">
                  {card.value}
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-1">
                  {card.title}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {card.info}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <span>Manage</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Secondary Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
        {secondaryMetrics.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-800/50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {item.value}
                </div>
                <div className="text-xs font-medium text-slate-300 truncate">
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 4. Main Dual-Panel Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recently Updated Content (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Recently Updated Content</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest published articles, initiatives, publications, and website pages
                </p>
              </div>
              <Link
                href="/admin/blogs"
                className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentContent.map((item) => {
                const typeColors: Record<string, string> = {
                  Article: 'bg-emerald-950 text-emerald-400 border-emerald-800',
                  Project: 'bg-amber-950 text-amber-400 border-amber-800',
                  Publication: 'bg-indigo-950 text-indigo-400 border-indigo-800',
                  Page: 'bg-cyan-950 text-cyan-400 border-cyan-800',
                };

                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            typeColors[item.type] || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {item.type}
                        </span>
                        {item.authorOrCategory && (
                          <span className="text-[11px] text-slate-500 truncate">
                            &bull; {item.authorOrCategory}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>
                          Updated {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-emerald-500 capitalize">{item.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={item.slug}
                        target="_blank"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Overview of Applications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Partner Proposals
                </span>
                <Link
                  href="/admin/applications"
                  className="text-[11px] text-slate-400 hover:text-amber-400"
                >
                  View ({partnerApps.length})
                </Link>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {partnerApps.length} Applications
              </div>
              <p className="text-xs text-slate-400">
                Institutional &amp; NGO collaboration requests awaiting response.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Volunteer Sign-ups
                </span>
                <Link
                  href="/admin/volunteers"
                  className="text-[11px] text-slate-400 hover:text-emerald-400"
                >
                  View ({volunteers.length})
                </Link>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {volunteers.length} Volunteers
              </div>
              <p className="text-xs text-slate-400">
                Youth and community members eager to support field events.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Administrator Activity & Urgent Inquiries (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Administrator Activity Feed */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Recent Admin Activity</span>
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                Audit Trail
              </span>
            </div>

            <div className="space-y-3.5">
              {stats.recentActivities.slice(0, 5).map((log) => {
                const actionBadges: Record<string, string> = {
                  publish: 'bg-emerald-950 text-emerald-400 border-emerald-800',
                  create: 'bg-blue-950 text-blue-400 border-blue-800',
                  update: 'bg-amber-950 text-amber-400 border-amber-800',
                  login: 'bg-purple-950 text-purple-400 border-purple-800',
                  delete: 'bg-rose-950 text-rose-400 border-rose-800',
                };

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {log.adminName ? log.adminName.charAt(0) : 'A'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">
                          {log.adminName}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            actionBadges[log.action] || 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {log.action}
                        </span>
                      </div>
                      <div className="text-slate-300 font-medium mt-0.5 truncate">
                        {log.entityTitle}
                      </div>
                      {log.details && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {log.details}
                        </p>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgent / Unread Contact Inquiries */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-rose-400" />
                  <span>Citizen Contact Enquiries</span>
                </h3>
                <p className="text-xs text-slate-400">Incoming inquiries via website form</p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-rose-400 hover:underline"
              >
                View all ({stats.recentInquiries.length})
              </Link>
            </div>

            {stats.recentInquiries.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                No new contact enquiries. All messages cleared.
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentInquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{inq.name}</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-medium mt-0.5 truncate">
                      {inq.subject || 'General Enquiry'}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {inq.message}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 truncate max-w-[180px]">
                        {inq.email}
                      </span>
                      <a
                        href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject || 'AERC Enquiry')}`}
                        className="text-emerald-400 hover:underline font-semibold"
                      >
                        Reply &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
