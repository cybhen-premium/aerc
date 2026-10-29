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
      gradient: 'from-emerald-500/10 to-emerald-500/5',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      badge: 'Live on Site',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      info: 'Initiatives & campaigns managed',
      href: '/admin/projects',
      icon: Briefcase,
      gradient: 'from-amber-500/10 to-amber-500/5',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      badge: 'Active Campaigns',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Publications',
      value: stats.totalPublications,
      info: 'Available reports & briefs',
      href: '/admin/publications',
      icon: FileText,
      gradient: 'from-indigo-500/10 to-indigo-500/5',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-200',
      badge: 'PDF Resources',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Team Members',
      value: stats.totalTeamMembers,
      info: 'Active leadership profiles',
      href: '/admin/team',
      icon: UserCheck,
      gradient: 'from-teal-500/10 to-teal-500/5',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200',
      badge: 'Roster Active',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      title: 'Contact Enquiries',
      value: stats.unreadInquiries,
      info: stats.unreadInquiries > 0 ? `${stats.unreadInquiries} awaiting response` : 'All enquiries answered',
      href: '/admin/inquiries',
      icon: MessageSquare,
      gradient: 'from-rose-500/10 to-rose-500/5',
      textColor: 'text-rose-700',
      borderColor: 'border-rose-200',
      badge: stats.unreadInquiries > 0 ? 'Action Needed' : 'Up to Date',
      badgeColor: stats.unreadInquiries > 0 ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      title: 'Pending Content',
      value: stats.pendingContent,
      info: 'Content awaiting approval',
      href: '/admin/blogs?status=draft',
      icon: AlertCircle,
      gradient: 'from-purple-500/10 to-purple-500/5',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      badge: stats.pendingContent > 0 ? 'In Review' : '0 Pending',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
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
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      label: 'Website Pages',
      value: stats.totalPages,
      desc: 'Managed frontend pages',
      href: '/admin/pages',
      icon: Globe,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
    },
    {
      label: 'Admin Users',
      value: stats.totalAdmins,
      desc: 'Authorized credentials',
      href: '/admin/users',
      icon: Shield,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Media Library',
      value: stats.totalMedia,
      desc: 'Images & cloud assets',
      href: '/admin/media',
      icon: ImageIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      label: 'Grassroots Donations',
      value: stats.donationsCount,
      desc: 'Solidarity contributions',
      href: '/admin/donations',
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
    },
    {
      label: 'Newsletter Reach',
      value: stats.subscribersCount,
      desc: 'Verified subscribers',
      href: '/admin/subscribers',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Quick Actions */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50/70 via-white to-slate-50 border border-slate-200/80 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src="/images/logo-sidebar.png"
              alt="AERC Ghana Official Logo"
              className="w-14 h-14 object-contain rounded-full shadow-md shrink-0 hidden sm:block"
            />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live System Operational &bull; Neon PostgreSQL Connected</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                AERC Management Console
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed">
                Real-time oversight of AERC Ghana’s climate justice campaigns, policy research,
                grassroots solidarity gifts, and public-facing content.
              </p>
            </div>
          </div>

          {/* Quick-Action Buttons requested in specification */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Article</span>
            </Link>
            <Link
              href="/admin/media"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-teal-600" />
              <span>Media Library</span>
            </Link>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Add Project</span>
            </Link>
            <Link
              href="/admin/focus-areas"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Focus Areas</span>
            </Link>
            <Link
              href="/admin/publications/new"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Upload Publication</span>
            </Link>
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Globe className="w-4 h-4 text-cyan-600" />
              <span>Manage Pages</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Primary Dashboard Cards (Requested 6 Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Content &amp; Operational Metrics</span>
          </h2>
          <span className="text-xs text-slate-500">Synchronized with PostgreSQL</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {primaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all hover:-translate-y-1 block shadow-sm"
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

                <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {card.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  {card.title}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {card.info}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-emerald-600 transition-colors">
                  <span>Manage</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Secondary Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {secondaryMetrics.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className={`w-9 h-9 rounded-lg ${item.bgColor} border ${item.borderColor} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {item.value}
                </div>
                <div className="text-xs font-medium text-slate-600 truncate">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Recently Updated Content</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest published articles, initiatives, publications, and website pages
                </p>
              </div>
              <Link
                href="/admin/blogs"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentContent.map((item) => {
                const typeColors: Record<string, string> = {
                  Article: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  Project: 'bg-amber-50 text-amber-700 border-amber-200',
                  Publication: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  Page: 'bg-cyan-50 text-cyan-700 border-cyan-200',
                };

                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            typeColors[item.type] || 'bg-slate-100 text-slate-700 border-slate-200'
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
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          Updated {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-emerald-600 font-medium capitalize">{item.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={item.slug}
                        target="_blank"
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 shadow-sm transition-colors flex items-center gap-1"
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
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Partner Proposals
                </span>
                <Link
                  href="/admin/applications"
                  className="text-[11px] text-slate-500 hover:text-amber-700 font-medium"
                >
                  View ({partnerApps.length})
                </Link>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {partnerApps.length} Applications
              </div>
              <p className="text-xs text-slate-500">
                Institutional &amp; NGO collaboration requests awaiting response.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Volunteer Sign-ups
                </span>
                <Link
                  href="/admin/volunteers"
                  className="text-[11px] text-slate-500 hover:text-emerald-700 font-medium"
                >
                  View ({volunteers.length})
                </Link>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {volunteers.length} Volunteers
              </div>
              <p className="text-xs text-slate-500">
                Youth and community members eager to support field events.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Administrator Activity & Urgent Inquiries (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Administrator Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Recent Admin Activity</span>
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                Audit Trail
              </span>
            </div>

            <div className="space-y-3.5">
              {stats.recentActivities.slice(0, 5).map((log) => {
                const actionBadges: Record<string, string> = {
                  publish: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  create: 'bg-blue-50 text-blue-700 border-blue-200',
                  update: 'bg-amber-50 text-amber-700 border-amber-200',
                  login: 'bg-purple-50 text-purple-700 border-purple-200',
                  delete: 'bg-rose-50 text-rose-700 border-rose-200',
                };

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-200 border border-slate-300 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {log.adminName ? log.adminName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {log.adminName}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            actionBadges[log.action] || 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {log.action}
                        </span>
                      </div>
                      <div className="text-slate-800 font-medium mt-0.5 truncate">
                        {log.entityTitle}
                      </div>
                      {log.details && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-rose-600" />
                  <span>Citizen Contact Enquiries</span>
                </h3>
                <p className="text-xs text-slate-500">Incoming inquiries via website form</p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                View all ({stats.recentInquiries.length})
              </Link>
            </div>

            {stats.recentInquiries.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                No new contact enquiries. All messages cleared.
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentInquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{inq.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-700 font-medium mt-0.5 truncate">
                      {inq.subject || 'General Enquiry'}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {inq.message}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 truncate max-w-[180px]">
                        {inq.email}
                      </span>
                      <a
                        href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject || 'AERC Enquiry')}`}
                        className="text-emerald-700 hover:underline font-semibold"
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
