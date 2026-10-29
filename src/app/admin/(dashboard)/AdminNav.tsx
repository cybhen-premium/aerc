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
} from 'lucide-react';
import { logoutAdminAction } from '../actions';

interface AdminNavProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/admin/homepage', label: 'Homepage Manager', icon: SlidersHorizontal },
    { href: '/admin/pages', label: 'Website Pages', icon: Globe },
    { href: '/admin/blogs', label: 'Articles & News', icon: BookOpen },
    { href: '/admin/projects', label: 'Projects & Initiatives', icon: Briefcase },
    { href: '/admin/focus-areas', label: 'Focus Areas & Pillars', icon: Target },
    { href: '/admin/publications', label: 'Publications & Reports', icon: FileText },
    { href: '/admin/team', label: 'Team & Leadership', icon: UserCheck },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { href: '/admin/donations', label: 'Donations & Giving', icon: Heart },
    { href: '/admin/inquiries', label: 'Contact Inquiries', icon: MessageSquare },
    { href: '/admin/applications', label: 'Partner Applications', icon: Handshake },
    { href: '/admin/volunteers', label: 'Volunteer Roster', icon: Users },
    { href: '/admin/subscribers', label: 'Newsletter Subscribers', icon: Mail },
    { href: '/admin/users', label: 'Admin Users & Roles', icon: Shield },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-wide">AERC PORTAL</div>
            <div className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
              Management Console
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Core Management
        </div>

        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          External
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
        >
          <span className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4" />
            <span>Public Website</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Live</span>
        </Link>
      </div>

      {/* Admin User Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0 uppercase">
            {user.role}
          </span>
        </div>

        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full py-2 px-3 bg-slate-800/80 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
