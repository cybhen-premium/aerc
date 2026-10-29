'use client';

import React, { useState, useTransition } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  UserPlus,
  Key,
  Lock,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Edit3,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  FileText,
  BookOpen,
  Briefcase,
  Target,
  Users,
  SlidersHorizontal,
  Sparkles,
  Eye,
  EyeOff,
  Activity,
  History,
  Building2,
  Phone,
  Mail,
  CheckCircle,
} from 'lucide-react';
import type { Admin, ActivityLog } from '@/db/schema';
import type { UnifiedRevisionItem } from '@/db';
import { SessionUser, SYSTEM_ROLES, getRoleBadge, hasPermission } from '@/lib/permissions';
import {
  createAdminUserAction,
  updateAdminUserAction,
  toggleAdminUserStatusAction,
  resetAdminUserPasswordAction,
  deleteAdminUserAction,
} from '../../actions';

interface UsersManagementClientProps {
  currentSession: SessionUser;
  adminUsers: Admin[];
  activityLogs: ActivityLog[];
  revisions: UnifiedRevisionItem[];
}

export default function UsersManagementClient({
  currentSession,
  adminUsers,
  activityLogs,
  revisions,
}: UsersManagementClientProps) {
  const [activeTab, setActiveTab] = useState<'accounts' | 'roles' | 'activity' | 'revisions'>('accounts');

  // Search & Filter state for Accounts
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Search & Filter state for Activity Logs
  const [activitySearch, setActivitySearch] = useState('');
  const [activityActionFilter, setActivityActionFilter] = useState('all');
  const [activityEntityFilter, setActivityEntityFilter] = useState('all');

  // Filter state for Revisions
  const [revisionEntityFilter, setRevisionEntityFilter] = useState('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Admin | null>(null);
  const [resettingUser, setResettingUser] = useState<Admin | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<Admin | null>(null);
  const [deletingUser, setDeletingUser] = useState<Admin | null>(null);

  // Form states
  const [createRole, setCreateRole] = useState('editor');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Status message & Pending state
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isSuperAdmin = currentSession.role.toLowerCase() === 'superadmin' || currentSession.role.toLowerCase() === 'super_admin';

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Password generator helper
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    let result = 'AERC-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(result);
  };

  // Filtered Accounts
  const filteredAdmins = adminUsers.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (admin.department && admin.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (admin.phone && admin.phone.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      selectedRoleFilter === 'all' || admin.role.toLowerCase() === selectedRoleFilter.toLowerCase();

    const matchesStatus =
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'active' && (admin.status === 'active' || !admin.status)) ||
      (selectedStatusFilter === 'inactive' && admin.status === 'inactive');

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filtered Activity Logs
  const filteredActivities = activityLogs.filter((log) => {
    const matchesSearch =
      log.adminName.toLowerCase().includes(activitySearch.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(activitySearch.toLowerCase()) ||
      log.entityTitle.toLowerCase().includes(activitySearch.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(activitySearch.toLowerCase()));

    const matchesAction = activityActionFilter === 'all' || log.action === activityActionFilter;
    const matchesEntity = activityEntityFilter === 'all' || log.entityType === activityEntityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  // Filtered Revisions
  const filteredRevisions = revisions.filter((rev) => {
    if (revisionEntityFilter === 'all') return true;
    return rev.entityType.toLowerCase() === revisionEntityFilter.toLowerCase();
  });

  // Counts
  const totalUsers = adminUsers.length;
  const activeUsersCount = adminUsers.filter((u) => u.status === 'active' || !u.status).length;
  const inactiveUsersCount = totalUsers - activeUsersCount;

  // Handle Create Submit
  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createAdminUserAction(formData);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Administrator account created successfully!' });
        setIsCreateModalOpen(false);
        setGeneratedPassword('');
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to create account.' });
      }
    });
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateAdminUserAction(formData);
      if (res.success) {
        setFeedback({ type: 'success', message: 'User details updated successfully!' });
        setEditingUser(null);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update user details.' });
      }
    });
  };

  // Handle Toggle Status
  const handleConfirmToggleStatus = () => {
    if (!deactivatingUser) return;
    const currentStatus = deactivatingUser.status || 'active';
    startTransition(async () => {
      const res = await toggleAdminUserStatusAction(deactivatingUser.id, currentStatus);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Account status for ${deactivatingUser.name} updated to ${
            currentStatus === 'active' ? 'Inactive' : 'Active'
          }!`,
        });
        setDeactivatingUser(null);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to change status.' });
      }
    });
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await resetAdminUserPasswordAction(formData);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Password credentials for ${resettingUser?.name} securely updated!`,
        });
        setResettingUser(null);
        setGeneratedPassword('');
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to reset password.' });
      }
    });
  };

  // Handle Delete User
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    startTransition(async () => {
      const res = await deleteAdminUserAction(deletingUser.id);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Administrator account for ${deletingUser.name} deleted successfully!`,
        });
        setDeletingUser(null);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to delete account.' });
      }
    });
  };

  // Modules for Permission Matrix
  const portalModules = [
    { key: 'homepage', name: 'Homepage Manager', description: 'Hero banner, pillars, metrics & section controls' },
    { key: 'pages', name: 'Website Pages', description: 'Custom landing pages & page editor' },
    { key: 'blogs', name: 'Articles & News', description: 'Field updates, stories, draft review & publishing' },
    { key: 'projects', name: 'Projects & Initiatives', description: 'Community programs, timelines & outcome metrics' },
    { key: 'focus_areas', name: 'Focus Areas & Pillars', description: 'Strategic thematic pillars & priorities' },
    { key: 'publications', name: 'Publications & Reports', description: 'Annual reports, research papers & downloads' },
    { key: 'team', name: 'Team & Leadership', description: 'Staff, executives, board & volunteer rosters' },
    { key: 'media', name: 'Media Library', description: 'Cloudinary storage, media tagging & asset uploads' },
    { key: 'donations', name: 'Donations & Giving', description: 'Campaign tracking and donor contributions' },
    { key: 'inquiries', name: 'Contact Inquiries', description: 'Direct contact submissions and messaging' },
    { key: 'applications', name: 'Partner Applications', description: 'Grassroots grant & project partnership proposals' },
    { key: 'volunteers', name: 'Volunteer Roster', description: 'Community volunteer registrations' },
    { key: 'subscribers', name: 'Newsletter Subscribers', description: 'Mailing list registrations' },
    { key: 'users', name: 'Users & Permissions', description: 'Security governance, staff accounts & RBAC control' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border shadow-lg transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-200'
              : 'bg-rose-950/80 border-rose-700/80 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs px-2.5 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-slate-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Shield className="w-4 h-4" />
            <span>Identity &amp; Access Governance</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Users &amp; Permissions
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Control dashboard access, assign granular roles, audit administrative activity, and review content change history for AERC Ghana.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setGeneratedPassword('');
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Administrator</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{totalUsers}</div>
            <div className="text-xs text-slate-400">Total Staff Accounts</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{activeUsersCount}</div>
            <div className="text-xs text-emerald-400 font-medium">Active &amp; Authorized</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{inactiveUsersCount}</div>
            <div className="text-xs text-slate-400">Deactivated Accounts</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{activityLogs.length}</div>
            <div className="text-xs text-slate-400">Recorded Audit Events</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'accounts'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Staff Accounts ({totalUsers})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'roles'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Role Permissions Matrix (7 Roles)</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'activity'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Activity Logs ({activityLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('revisions')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'revisions'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Content History &amp; Revisions ({revisions.length})</span>
        </button>
      </div>

      {/* TAB 1: ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, email, department, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Role:</span>
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Administrator</option>
                  <option value="editor">Editor</option>
                  <option value="author">Author</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="communications">Communications Officer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
                <span>Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {(searchQuery || selectedRoleFilter !== 'all' || selectedStatusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRoleFilter('all');
                    setSelectedStatusFilter('all');
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Accounts List */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/80">
              {filteredAdmins.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <UserX className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-sm font-medium text-slate-300">No administrator accounts match your filter criteria.</p>
                  <p className="text-xs text-slate-500 mt-1">Try resetting search filters or add a new account.</p>
                </div>
              ) : (
                filteredAdmins.map((admin) => {
                  const roleBadge = getRoleBadge(admin.role);
                  const isActive = admin.status !== 'inactive';
                  const isCurrentSessionUser = currentSession.id === admin.id;

                  return (
                    <div
                      key={admin.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
                    >
                      {/* Left: User Details */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-extrabold text-base flex items-center justify-center shadow-md shrink-0">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              {admin.name}
                              {isCurrentSessionUser && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  You
                                </span>
                              )}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide ${roleBadge.badgeColor}`}>
                              {roleBadge.label}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                isActive
                                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                                  : 'bg-rose-950/80 text-rose-400 border-rose-800'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                                }`}
                              />
                              {isActive ? 'Active' : 'Deactivated'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1 font-mono">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {admin.email}
                            </span>
                            {admin.department && (
                              <span className="flex items-center gap-1 text-slate-400">
                                <Building2 className="w-3 h-3 text-slate-500" />
                                {admin.department}
                              </span>
                            )}
                            {admin.phone && (
                              <span className="flex items-center gap-1 text-slate-400">
                                <Phone className="w-3 h-3 text-slate-500" />
                                {admin.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status, Sign-in & Actions */}
                      <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-xs text-slate-400 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-semibold">Last Login</span>
                          <span className="text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : 'Never'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          {/* Edit Details */}
                          <button
                            onClick={() => setEditingUser(admin)}
                            title="Edit User Details"
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setGeneratedPassword('');
                              setResettingUser(admin);
                            }}
                            title="Reset Password"
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-amber-900/30 hover:border-amber-700/80 hover:text-amber-300 text-slate-300 border border-slate-700/80 transition-colors cursor-pointer"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Active / Deactivate (Super Admin only, cannot deactivate self) */}
                          {isSuperAdmin && !isCurrentSessionUser && (
                            <button
                              onClick={() => setDeactivatingUser(admin)}
                              title={isActive ? 'Deactivate Account' : 'Activate Account'}
                              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                isActive
                                  ? 'bg-slate-800/80 hover:bg-rose-900/30 hover:border-rose-700/80 hover:text-rose-300 text-slate-300 border-slate-700/80'
                                  : 'bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border-emerald-800'
                              }`}
                            >
                              {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {/* Delete Account (Super Admin only, cannot delete self) */}
                          {isSuperAdmin && !isCurrentSessionUser && (
                            <button
                              onClick={() => setDeletingUser(admin)}
                              title="Delete Account"
                              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950 hover:border-rose-800 hover:text-rose-400 text-slate-400 border border-slate-700/80 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Roles Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.values(SYSTEM_ROLES).map((role) => (
              <div
                key={role.key}
                className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${role.badgeColor}`}>
                      {role.label}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{role.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Scope:</span>
                  <span className="font-semibold text-slate-200">
                    {role.permissions.includes('all') ? 'Full System' : `${role.permissions.length} Modules`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Permission Matrix Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Module Access Matrix</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison of module authorization across all 7 operational roles at AERC Ghana.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 font-semibold">Portal Module</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Super Admin</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Admin</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Editor</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Author</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Project Mgr</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Comms Officer</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {portalModules.map((mod) => (
                    <tr key={mod.key} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{mod.name}</div>
                        <div className="text-[11px] text-slate-500 font-sans">{mod.description}</div>
                      </td>

                      {/* Super Admin */}
                      <td className="py-3.5 px-3 text-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      </td>

                      {/* Administrator */}
                      <td className="py-3.5 px-3 text-center">
                        {hasPermission('admin', mod.key) ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 font-bold">—</span>
                        )}
                      </td>

                      {/* Editor */}
                      <td className="py-3.5 px-3 text-center">
                        {hasPermission('editor', mod.key) ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 font-bold">—</span>
                        )}
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-3 text-center">
                        {hasPermission('author', mod.key) ? (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 font-bold">—</span>
                        )}
                      </td>

                      {/* Project Manager */}
                      <td className="py-3.5 px-3 text-center">
                        {hasPermission('project_manager', mod.key) ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 font-bold">—</span>
                        )}
                      </td>

                      {/* Communications */}
                      <td className="py-3.5 px-3 text-center">
                        {hasPermission('communications', mod.key) ? (
                          <CheckCircle2 className="w-4 h-4 text-rose-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 font-bold">—</span>
                        )}
                      </td>

                      {/* Viewer */}
                      <td className="py-3.5 px-3 text-center">
                        {hasPermission('viewer', mod.key) ? (
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            Read
                          </span>
                        ) : (
                          <span className="text-slate-600 font-bold">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM ACTIVITY LOGS */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {/* Activity Filters */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search logs by staff name, target title, or event description..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
                <span>Action:</span>
                <select
                  value={activityActionFilter}
                  onChange={(e) => setActivityActionFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Actions</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="publish">Publish</option>
                  <option value="login">Login</option>
                  <option value="reset_password">Password Reset</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
                <span>Entity:</span>
                <select
                  value={activityEntityFilter}
                  onChange={(e) => setActivityEntityFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Entities</option>
                  <option value="article">Article</option>
                  <option value="project">Project</option>
                  <option value="page">Page</option>
                  <option value="publication">Publication</option>
                  <option value="focus_area">Focus Area</option>
                  <option value="team_member">Team Member</option>
                  <option value="homepage_settings">Homepage Settings</option>
                  <option value="user">User / Auth</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Log Feed */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/80">
              {filteredActivities.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Activity className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-sm font-medium text-slate-300">No activity logs recorded for this criteria.</p>
                </div>
              ) : (
                filteredActivities.map((log) => {
                  let actionColor = 'bg-blue-950/80 text-blue-400 border-blue-800';
                  if (log.action === 'create' || log.action === 'publish') {
                    actionColor = 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
                  } else if (log.action === 'delete') {
                    actionColor = 'bg-rose-950/80 text-rose-400 border-rose-800';
                  } else if (log.action === 'reset_password') {
                    actionColor = 'bg-purple-950/80 text-purple-400 border-purple-800';
                  } else if (log.action === 'update') {
                    actionColor = 'bg-amber-950/80 text-amber-400 border-amber-800';
                  }

                  return (
                    <div
                      key={log.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/40 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {log.adminName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-white text-xs sm:text-sm">{log.adminName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">({log.adminEmail})</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${actionColor}`}>
                              {log.action}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                              {log.entityType}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1 font-medium">{log.details || log.entityTitle}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">Target: {log.entityTitle}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 text-xs text-slate-400 font-mono sm:pl-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTENT HISTORY & REVISIONS */}
      {activeTab === 'revisions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Consolidated Content Revisions</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit historical modifications and changelog notes authored by administrators across all website modules.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Filter by Entity:</span>
              <select
                value={revisionEntityFilter}
                onChange={(e) => setRevisionEntityFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Content Types</option>
                <option value="article">Articles</option>
                <option value="project">Projects</option>
                <option value="page">Website Pages</option>
                <option value="publication">Publications</option>
                <option value="focus area">Focus Areas</option>
                <option value="team member">Team Members</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/80">
              {filteredRevisions.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <History className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-sm font-medium text-slate-300">No revisions found for this content type.</p>
                </div>
              ) : (
                filteredRevisions.map((rev) => (
                  <div
                    key={`${rev.entityType}-${rev.id}`}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        {rev.entityType === 'Article' && <BookOpen className="w-4 h-4" />}
                        {rev.entityType === 'Project' && <Briefcase className="w-4 h-4" />}
                        {rev.entityType === 'Page' && <FileText className="w-4 h-4" />}
                        {rev.entityType === 'Publication' && <FileText className="w-4 h-4" />}
                        {rev.entityType === 'Focus Area' && <Target className="w-4 h-4" />}
                        {rev.entityType === 'Team Member' && <Users className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {rev.entityType}
                          </span>
                          <h4 className="text-sm font-bold text-white">{rev.title}</h4>
                          {rev.status && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                              Status: {rev.status}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 mt-1 font-sans">
                          {rev.changeSummary || 'No change description provided for this revision.'}
                        </p>

                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                          <span>Revised by: <strong className="text-slate-200">{rev.revisedBy}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(rev.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 1: CREATE ADMINISTRATOR ---------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Administrator Account</h3>
                  <p className="text-xs text-slate-400">Register a new portal user and assign access permissions.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Siisi Ansah"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. author@aercghana.org"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department / Unit</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. Research & Climate Policy"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="e.g. +233 24 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Role *</label>
                <select
                  name="role"
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {isSuperAdmin && <option value="superadmin">Super Admin (Full System Access)</option>}
                  <option value="admin">Administrator (Manage website functions)</option>
                  <option value="editor">Editor (Create, edit, review &amp; publish)</option>
                  <option value="author">Author (Create and manage articles)</option>
                  <option value="project_manager">Project Manager (Projects &amp; Focus Areas)</option>
                  <option value="communications">Communications Officer (News, publications, media)</option>
                  <option value="viewer">Viewer (Read-only access)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  {SYSTEM_ROLES[createRole]?.description}
                </p>
              </div>

              {/* Password & Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Initial Password * (min 8 chars)</label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Generate Strong Password
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    minLength={8}
                    value={generatedPassword}
                    onChange={(e) => setGeneratedPassword(e.target.value)}
                    placeholder="Enter password or click Generate above"
                    className="w-full pl-3.5 pr-20 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {generatedPassword && (
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedPassword, 'new-pwd')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors"
                        title="Copy Password"
                      >
                        {copiedKey === 'new-pwd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all shadow-md shadow-emerald-950 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: EDIT USER DETAILS ---------------- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit User Details</h3>
                  <p className="text-xs text-slate-400">Update account profile, department, and role permissions.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
              <input type="hidden" name="id" value={editingUser.id} />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUser.name}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser.email}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department / Unit</label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={editingUser.department || ''}
                    placeholder="e.g. Research & Climate Policy"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingUser.phone || ''}
                    placeholder="e.g. +233 24 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
                  <select
                    name="role"
                    defaultValue={editingUser.role}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {isSuperAdmin && <option value="superadmin">Super Admin</option>}
                    <option value="admin">Administrator</option>
                    <option value="editor">Editor</option>
                    <option value="author">Author</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="communications">Communications Officer</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account Status *</label>
                  <select
                    name="status"
                    defaultValue={editingUser.status || 'active'}
                    disabled={currentSession.id === editingUser.id}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  >
                    <option value="active">Active (Access Granted)</option>
                    <option value="inactive">Inactive / Suspended</option>
                  </select>
                  {currentSession.id === editingUser.id && (
                    <p className="text-[10px] text-amber-400 mt-1">You cannot deactivate your own current session.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-md shadow-blue-950 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: RESET PASSWORD ---------------- */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Reset User Password</h3>
                  <p className="text-xs text-slate-400">Generate secure credentials for {resettingUser.name}.</p>
                </div>
              </div>
              <button
                onClick={() => setResettingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="mt-5 space-y-4">
              <input type="hidden" name="id" value={resettingUser.id} />

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div>Account: <strong className="text-white">{resettingUser.name}</strong></div>
                <div>Email: <span className="font-mono text-emerald-400">{resettingUser.email}</span></div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">New Password * (min 8 chars)</label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    required
                    minLength={8}
                    value={generatedPassword}
                    onChange={(e) => setGeneratedPassword(e.target.value)}
                    placeholder="Enter or generate new password"
                    className="w-full pl-3.5 pr-20 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {generatedPassword && (
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedPassword, 'reset-pwd')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition-colors"
                        title="Copy Password"
                      >
                        {copiedKey === 'reset-pwd' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-md shadow-amber-950 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save New Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 4: TOGGLE STATUS (CONFIRMATION) ---------------- */}
      {deactivatingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">
              {deactivatingUser.status === 'inactive' ? 'Activate Account?' : 'Deactivate Account?'}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {deactivatingUser.status === 'inactive' ? (
                <>
                  Are you sure you want to re-activate <strong>{deactivatingUser.name}</strong>? They will regain access to the portal based on their assigned role.
                </>
              ) : (
                <>
                  Deactivating <strong>{deactivatingUser.name}</strong> ({deactivatingUser.email}) will immediately revoke their access and terminate any active sessions.
                </>
              )}
            </p>

            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeactivatingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleStatus}
                disabled={isPending}
                className={`px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                  deactivatingUser.status === 'inactive'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950'
                }`}
              >
                {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{deactivatingUser.status === 'inactive' ? 'Confirm Activation' : 'Confirm Deactivation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 5: DELETE ACCOUNT (CONFIRMATION) ---------------- */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">Permanently Delete Administrator?</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              This action cannot be undone. Are you sure you want to permanently remove <strong>{deletingUser.name}</strong> ({deletingUser.email})?
            </p>

            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-all shadow-rose-950 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
