import Link from 'next/link';
import { getAllAdmins } from '@/db';
import {
  Shield,
  Key,
  Clock,
  UserCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default async function AdminUsersPage() {
  const adminUsers = await getAllAdmins();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Security &amp; Permissions</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Users &amp; Roles
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Authorized portal administrators with full permissions to manage campaigns, articles, and settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold">
            {adminUsers.length} Registered User{adminUsers.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Active Administrator Accounts</h2>
          </div>
          <span className="text-xs text-slate-400">
            Protected via bcrypt + signed JWT sessions
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {adminUsers.map((admin) => (
            <div
              key={admin.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white font-bold text-base flex items-center justify-center shadow-md">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {admin.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {admin.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {admin.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-400">
                <div>
                  <span className="text-[11px] text-slate-500 block">Created On</span>
                  <span className="text-slate-300 font-medium">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Last Sign In</span>
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {admin.lastLoginAt
                      ? new Date(admin.lastLoginAt).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
