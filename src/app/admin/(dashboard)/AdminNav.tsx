'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Handshake,
  Users,
  Mail,
  FileText,
  BookOpen,
  Briefcase,
  ExternalLink,
  LogOut,
  Leaf,
  Heart,
  Globe,
  UserCheck,
  Shield,
  Target,
  Image as ImageIcon,
  SlidersHorizontal,
  Settings,
} from 'lucide-react';
import { logoutAdminAction } from '../actions';
import { hasPermission, getRoleBadge } from '@/lib/permissions';

interface AdminNavProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();

  const allNavLinks = [
    { href: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/admin/homepage', label: 'Homepage Manager', icon: SlidersHorizontal, permission: 'homepage' },
    { href: '/admin/pages', label: 'Website Pages', icon: Globe, permission: 'pages' },
    { href: '/admin/blogs', label: 'Articles & News', icon: BookOpen, permission: 'blogs' },
    { href: '/admin/projects', label: 'Projects & Initiatives', icon: Briefcase, permission: 'projects' },
    { href: '/admin/focus-areas', label: 'Focus Areas & Pillars', icon: Target, permission: 'focus_areas' },
    { href: '/admin/publications', label: 'Publications & Reports', icon: FileText, permission: 'publications' },
    { href: '/admin/team', label: 'Team & Leadership', icon: UserCheck, permission: 'team' },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon, permission: 'media' },
    { href: '/admin/donations', label: 'Donations & Giving', icon: Heart, permission: 'donations' },
    { href: '/admin/inquiries', label: 'Contact Inquiries', icon: MessageSquare, permission: 'inquiries' },
    { href: '/admin/applications', label: 'Partner Applications', icon: Handshake, permission: 'applications' },
    { href: '/admin/volunteers', label: 'Volunteer Roster', icon: Users, permission: 'volunteers' },
    { href: '/admin/subscribers', label: 'Newsletter Subscribers', icon: Mail, permission: 'subscribers' },
    { href: '/admin/users', label: 'Admin Users & Roles', icon: Shield, permission: 'users' },
    { href: '/admin/settings', label: 'General Settings', icon: Settings, permission: 'settings' },
  ];

  const navLinks = allNavLinks.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(user.role, item.permission);
  });

  const roleInfo = getRoleBadge(user.role);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full z-30 shadow-sm">
      {/* Brand Header - Fixed at Top */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 tracking-wide">AERC PORTAL</div>
            <div className="text-[10px] uppercase font-semibold text-emerald-600 tracking-wider">
              Management Console
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links - Scrollable only inside this middle section */}
      <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto min-h-0">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Management
        </div>

        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          External
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
        >
          <span className="flex items-center gap-3 truncate">
            <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
            <span className="truncate">Public Website</span>
          </span>
          <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase">
            Live
          </span>
        </Link>
      </div>

      {/* Admin User Profile & Sign Out - Pinned at Bottom Always Visible */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/90 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${roleInfo.badgeColor}`}>
            {roleInfo.label}
          </span>
        </div>

        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full py-2 px-3 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
