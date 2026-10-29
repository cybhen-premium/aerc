export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export type RoleType =
  | 'superadmin'
  | 'admin'
  | 'editor'
  | 'author'
  | 'project_manager'
  | 'communications'
  | 'viewer';

export interface RoleConfig {
  key: RoleType;
  label: string;
  badgeColor: string;
  description: string;
  permissions: string[];
}

export const SYSTEM_ROLES: Record<string, RoleConfig> = {
  superadmin: {
    key: 'superadmin',
    label: 'Super Admin',
    badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-700/80',
    description: 'Full system access across all modules, administrator account governance, and system-wide settings',
    permissions: ['all'],
  },
  admin: {
    key: 'admin',
    label: 'Administrator',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80',
    description: 'Manage most website functions including campaigns, articles, projects, team, and pages',
    permissions: [
      'homepage',
      'pages',
      'blogs',
      'projects',
      'focus_areas',
      'publications',
      'team',
      'media',
      'donations',
      'inquiries',
      'applications',
      'volunteers',
      'subscribers',
      'users',
      'settings',
    ],
  },
  editor: {
    key: 'editor',
    label: 'Editor',
    badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-700/80',
    description: 'Create, edit, review, and publish articles, projects, focus areas, and media assets',
    permissions: ['pages', 'blogs', 'projects', 'focus_areas', 'publications', 'media'],
  },
  author: {
    key: 'author',
    label: 'Author',
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-700/80',
    description: 'Create and manage assigned articles and grassroots field story drafts',
    permissions: ['blogs', 'media'],
  },
  project_manager: {
    key: 'project_manager',
    label: 'Project Manager',
    badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-700/80',
    description: 'Manage community initiatives, projects, strategic focus areas, and partner proposals',
    permissions: ['projects', 'focus_areas', 'applications', 'media'],
  },
  communications: {
    key: 'communications',
    label: 'Communications Officer',
    badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-700/80',
    description: 'Manage news, publications, homepage announcements, team profiles, and media library',
    permissions: ['homepage', 'blogs', 'publications', 'media', 'team', 'subscribers', 'inquiries'],
  },
  viewer: {
    key: 'viewer',
    label: 'Viewer',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    description: 'Read-only access to permitted dashboard analytics, inquiries, and application registers',
    permissions: ['read_only'],
  },
};

export function hasPermission(userRole: string | undefined, moduleKey: string): boolean {
  if (!userRole) return false;
  const normalized = userRole.toLowerCase().trim().replace(/[\s-]+/g, '_');
  if (normalized === 'superadmin' || normalized === 'super_admin') return true;
  const def = SYSTEM_ROLES[normalized];
  if (!def) return false;
  return def.permissions.includes('all') || def.permissions.includes(moduleKey);
}

export function getRoleBadge(userRole: string | undefined): { label: string; badgeColor: string } {
  if (!userRole) return { label: 'Viewer', badgeColor: 'bg-slate-800 text-slate-400 border-slate-700' };
  const normalized = userRole.toLowerCase().trim().replace(/[\s-]+/g, '_');
  const def = SYSTEM_ROLES[normalized];
  if (def) return { label: def.label, badgeColor: def.badgeColor };
  return { label: userRole, badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' };
}
