'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Mail,
  MailOpen,
  MessageSquare,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Send,
  Trash2,
  Archive,
  RefreshCw,
  Eye,
  UserCheck,
  User,
  Shield,
  Building2,
  Phone,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Bell,
  Lock,
  Calendar,
  Sparkles,
  Inbox,
  UserPlus,
  HelpCircle,
  Tag,
  ArrowUpRight,
} from 'lucide-react';
import type { ContactInquiry, Admin, EnquiryNotificationSettings } from '@/db/schema';
import type { SessionUser } from '@/lib/permissions';
import {
  markInquiryReadAction,
  updateInquiryStatusAction,
  assignInquiryAction,
  updateInquiryPriorityAction,
  updateInquiryCategoryAction,
  saveInquiryInternalNotesAction,
  recordInquiryResponseAction,
  toggleArchiveInquiryAction,
  deleteInquiryAction,
  updateNotificationSettingsAction,
  cleanupRetentionAction,
} from '../../actions';

interface InquiriesManagerClientProps {
  inquiries: ContactInquiry[];
  staffUsers: Admin[];
  notificationSettings: EnquiryNotificationSettings | null;
  currentSession: SessionUser;
}

export default function InquiriesManagerClient({
  inquiries,
  staffUsers,
  notificationSettings,
  currentSession,
}: InquiriesManagerClientProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'followup' | 'settings'>('inbox');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');

  // Selected Inquiry for Inspector Drawer
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Modal States
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseSummary, setResponseSummary] = useState('');
  const [internalNotesText, setInternalNotesText] = useState('');
  const [isDeletingInquiry, setIsDeletingInquiry] = useState<ContactInquiry | null>(null);
  const [isPurgingRetention, setIsPurgingRetention] = useState(false);

  // Copy helper state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Transition & Feedback
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isSuperAdmin = currentSession.role.toLowerCase() === 'superadmin' || currentSession.role.toLowerCase() === 'super_admin';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Metrics
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => (i.status === 'New' || !i.status) && !i.isRead).length;
  const inProgressCount = inquiries.filter((i) => i.status === 'In Progress').length;
  const respondedCount = inquiries.filter((i) => i.status === 'Responded').length;
  const closedCount = inquiries.filter((i) => i.status === 'Closed').length;
  const archivedCount = inquiries.filter((i) => i.isArchived === 'yes' || i.status === 'Archived').length;

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.phone && inq.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.subject && inq.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? inq.isArchived !== 'yes' && inq.status !== 'Archived'
        : statusFilter === 'Archived'
        ? inq.isArchived === 'yes' || inq.status === 'Archived'
        : inq.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === 'all' || inq.category?.toLowerCase() === categoryFilter.toLowerCase();

    const matchesAssignee =
      assigneeFilter === 'all'
        ? true
        : assigneeFilter === 'unassigned'
        ? !inq.assignedTo
        : inq.assignedTo === assigneeFilter;

    const matchesRead =
      readFilter === 'all'
        ? true
        : readFilter === 'unread'
        ? !inq.isRead
        : Boolean(inq.isRead);

    return matchesSearch && matchesStatus && matchesCategory && matchesAssignee && matchesRead;
  });

  // Action Handlers
  const handleToggleRead = (inq: ContactInquiry) => {
    const nextRead = !inq.isRead;
    startTransition(async () => {
      const res = await markInquiryReadAction(inq.id, nextRead);
      if (res.success) {
        if (selectedInquiry?.id === inq.id) {
          setSelectedInquiry({ ...selectedInquiry, isRead: nextRead });
        }
        setFeedback({
          type: 'success',
          message: `Inquiry marked as ${nextRead ? 'read' : 'unread'}.`,
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update read state.' });
      }
    });
  };

  const handleStatusChange = (id: number, status: string) => {
    startTransition(async () => {
      const res = await updateInquiryStatusAction(id, status);
      if (res.success) {
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status });
        }
        setFeedback({ type: 'success', message: `Status updated to [${status}].` });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update status.' });
      }
    });
  };

  const handleAssignStaff = (id: number, staffName: string) => {
    const matched = staffUsers.find((s) => s.name === staffName);
    startTransition(async () => {
      const res = await assignInquiryAction(id, staffName, matched?.email);
      if (res.success) {
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({
            ...selectedInquiry,
            assignedTo: staffName,
            assignedStaffEmail: matched?.email || null,
            status: 'In Progress',
            isRead: true,
          });
        }
        setFeedback({
          type: 'success',
          message: staffName ? `Inquiry assigned to ${staffName}.` : 'Inquiry assignment cleared.',
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to assign staff.' });
      }
    });
  };

  const handlePriorityChange = (id: number, priority: string) => {
    startTransition(async () => {
      const res = await updateInquiryPriorityAction(id, priority);
      if (res.success) {
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, priority });
        }
        setFeedback({ type: 'success', message: `Priority updated to [${priority}].` });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update priority.' });
      }
    });
  };

  const handleCategoryChange = (id: number, category: string) => {
    startTransition(async () => {
      const res = await updateInquiryCategoryAction(id, category);
      if (res.success) {
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, category });
        }
        setFeedback({ type: 'success', message: `Category updated to [${category}].` });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update category.' });
      }
    });
  };

  const handleSaveInternalNotes = (id: number) => {
    startTransition(async () => {
      const res = await saveInquiryInternalNotesAction(id, internalNotesText);
      if (res.success) {
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, internalNotes: internalNotesText });
        }
        setFeedback({ type: 'success', message: 'Staff follow-up notes saved.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to save notes.' });
      }
    });
  };

  const handleRecordResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !responseSummary.trim()) return;

    startTransition(async () => {
      const res = await recordInquiryResponseAction(selectedInquiry.id, responseSummary);
      if (res.success) {
        setSelectedInquiry({
          ...selectedInquiry,
          status: 'Responded',
          responseSummary,
          respondedBy: currentSession.name,
          respondedAt: new Date(),
          isRead: true,
        });
        setIsResponseModalOpen(false);
        setResponseSummary('');
        setFeedback({ type: 'success', message: 'Official response recorded successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to record response.' });
      }
    });
  };

  const handleToggleArchive = (inq: ContactInquiry) => {
    const nextArchive = inq.isArchived !== 'yes';
    startTransition(async () => {
      const res = await toggleArchiveInquiryAction(inq.id, nextArchive);
      if (res.success) {
        if (selectedInquiry?.id === inq.id) {
          setSelectedInquiry({
            ...selectedInquiry,
            isArchived: nextArchive ? 'yes' : 'no',
            status: nextArchive ? 'Archived' : 'New',
          });
        }
        setFeedback({
          type: 'success',
          message: nextArchive ? 'Inquiry archived.' : 'Inquiry restored from archive.',
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to toggle archive.' });
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!isDeletingInquiry) return;
    startTransition(async () => {
      const res = await deleteInquiryAction(isDeletingInquiry.id);
      if (res.success) {
        if (selectedInquiry?.id === isDeletingInquiry.id) {
          setSelectedInquiry(null);
        }
        setFeedback({ type: 'success', message: 'Contact inquiry permanently deleted.' });
        setIsDeletingInquiry(null);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to delete inquiry.' });
      }
    });
  };

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateNotificationSettingsAction(formData);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Notification & Privacy settings saved!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to save settings.' });
      }
    });
  };

  const handleConfirmRetentionPurge = () => {
    startTransition(async () => {
      const res = await cleanupRetentionAction();
      setIsPurgingRetention(false);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Privacy retention purge completed successfully.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to run retention purge.' });
      }
    });
  };

  // Helper badge renderers
  const getStatusBadge = (status: string | null | undefined) => {
    const s = status || 'New';
    switch (s) {
      case 'New':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800">New</span>;
      case 'In Progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800">In Progress</span>;
      case 'Responded':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">Responded</span>;
      case 'Closed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">Closed</span>;
      case 'Archived':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800">Archived</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">{s}</span>;
    }
  };

  const getPriorityBadge = (priority: string | null | undefined) => {
    const p = priority || 'normal';
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-950 text-rose-300 border border-rose-800">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">High</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">Low</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700">Normal</span>;
    }
  };

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
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
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
            <MessageSquare className="w-4 h-4" />
            <span>Community &amp; Stakeholder Communications</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Contact Enquiries
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Review incoming public messages, manage staff assignments, record responses, and configure automated notification and data retention policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Contact Form</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{totalCount}</div>
            <div className="text-xs text-slate-400">Total Enquiries</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              {newCount}
              {newCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </div>
            <div className="text-xs text-blue-400 font-medium">New / Unread</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{inProgressCount}</div>
            <div className="text-xs text-slate-400">In Progress / Assigned</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{respondedCount + closedCount}</div>
            <div className="text-xs text-slate-400">Responded &amp; Closed</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'inbox'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Enquiry Inbox ({filteredInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('followup')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'followup'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Staff Follow-Up &amp; Assignments</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Notification &amp; Privacy Retention Settings</span>
        </button>
      </div>

      {/* TAB 1: INBOX */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by sender name, email, phone, subject, or message content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">Active Enquiries</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Responded">Responded</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
                <span>Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Partnership & Grants">Partnership &amp; Grants</option>
                  <option value="Media & Press">Media &amp; Press</option>
                  <option value="Research & Climate Data">Research &amp; Climate Data</option>
                  <option value="Community Initiatives">Community Initiatives</option>
                  <option value="Donations & Giving">Donations &amp; Giving</option>
                  <option value="Careers & Volunteering">Careers &amp; Volunteering</option>
                </select>
              </div>

              {/* Assignee Filter */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
                <span>Assignee:</span>
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Staff</option>
                  <option value="unassigned">Unassigned</option>
                  {staffUsers.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Read/Unread Filter */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
                <span>Read:</span>
                <select
                  value={readFilter}
                  onChange={(e) => setReadFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread Only</option>
                  <option value="read">Read Only</option>
                </select>
              </div>

              {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || assigneeFilter !== 'all' || readFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setAssigneeFilter('all');
                    setReadFilter('all');
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Enquiries Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/80">
              {filteredInquiries.length === 0 ? (
                <div className="p-16 text-center text-slate-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-sm font-medium text-slate-300">No contact enquiries match your filters.</p>
                  <p className="text-xs text-slate-500 mt-1">Try resetting search filters or view archived messages.</p>
                </div>
              ) : (
                filteredInquiries.map((inq) => {
                  const isUnread = !inq.isRead;

                  return (
                    <div
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setInternalNotesText(inq.internalNotes || '');
                      }}
                      className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-850/60 transition-colors cursor-pointer ${
                        isUnread ? 'bg-slate-850/30 font-medium' : ''
                      }`}
                    >
                      {/* Left: Indicator, Sender, Subject & Excerpt */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* Read/Unread bullet */}
                        <div className="pt-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRead(inq);
                            }}
                            title={isUnread ? 'Mark as read' : 'Mark as unread'}
                            className="p-1 rounded hover:bg-slate-800 transition-colors"
                          >
                            {isUnread ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block ring-4 ring-emerald-400/20" />
                            ) : (
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 block" />
                            )}
                          </button>
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-white truncate">{inq.name}</span>
                            <span className="text-xs text-slate-400 font-mono">({inq.email})</span>
                            {inq.phone && (
                              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                                &bull; {inq.phone}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {inq.category || 'General Inquiry'}
                            </span>
                            {getPriorityBadge(inq.priority)}
                            {getStatusBadge(inq.status)}
                          </div>

                          <h4 className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                            {inq.subject || 'No Subject Provided'}
                          </h4>

                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-sans">
                            {inq.message}
                          </p>

                          {inq.assignedTo && (
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1.5 font-medium">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Assigned to: <strong>{inq.assignedTo}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Timestamp & Action Buttons */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 text-xs text-slate-400 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                        <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(inq.createdAt).toLocaleDateString()} &middot; {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleArchive(inq);
                            }}
                            title={inq.isArchived === 'yes' ? 'Restore from Archive' : 'Archive Enquiry'}
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>

                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDeletingInquiry(inq);
                              }}
                              title="Delete Personal Data (GDPR / Privacy)"
                              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950 hover:border-rose-800 hover:text-rose-400 text-slate-400 border border-slate-700/80 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <ChevronRight className="w-4 h-4 text-slate-600" />
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

      {/* TAB 2: STAFF FOLLOW-UP & ASSIGNMENTS */}
      {activeTab === 'followup' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white">Staff Workflow &amp; Follow-Up Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review enquiries assigned across AERC departments to ensure timely follow-up and prompt stakeholder engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column 1: New */}
            <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  New Enquiries
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-800">
                  {inquiries.filter((i) => i.status === 'New' || !i.status).length}
                </span>
              </div>
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {inquiries
                  .filter((i) => i.status === 'New' || !i.status)
                  .map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setInternalNotesText(inq.internalNotes || '');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{inq.name}</span>
                        {getPriorityBadge(inq.priority)}
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">{inq.subject}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{inq.message}</p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  In Progress
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-800">
                  {inquiries.filter((i) => i.status === 'In Progress').length}
                </span>
              </div>
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {inquiries
                  .filter((i) => i.status === 'In Progress')
                  .map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setInternalNotesText(inq.internalNotes || '');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{inq.name}</span>
                        {getPriorityBadge(inq.priority)}
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">{inq.subject}</p>
                      {inq.assignedTo && (
                        <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>{inq.assignedTo}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: Responded */}
            <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Responded
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  {inquiries.filter((i) => i.status === 'Responded').length}
                </span>
              </div>
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {inquiries
                  .filter((i) => i.status === 'Responded')
                  .map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setInternalNotesText(inq.internalNotes || '');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{inq.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">{inq.subject}</p>
                      {inq.responseSummary && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                          "{inq.responseSummary}"
                        </p>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono">
                        {inq.respondedAt ? `Replied: ${new Date(inq.respondedAt).toLocaleDateString()}` : 'Responded'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 4: Closed */}
            <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  Closed / Completed
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  {inquiries.filter((i) => i.status === 'Closed').length}
                </span>
              </div>
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {inquiries
                  .filter((i) => i.status === 'Closed')
                  .map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setInternalNotesText(inq.internalNotes || '');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 opacity-80"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{inq.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Closed</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">{inq.subject}</p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATION & PRIVACY RETENTION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl max-w-3xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Email Notification &amp; Auto-Responder Preferences</h3>
                <p className="text-xs text-slate-400">Configure alert routing when visitors submit inquiries on AERC Ghana.</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="mt-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Recipient Notification Email *
                  </label>
                  <input
                    type="email"
                    name="notificationRecipientEmail"
                    defaultValue={notificationSettings?.notificationRecipientEmail || 'info@aercghana.net'}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Alerts for every incoming message will be delivered here.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CC Notification Emails (comma separated)
                  </label>
                  <input
                    type="text"
                    name="ccEmails"
                    defaultValue={notificationSettings?.ccEmails || 'admin@aercgh.org, comms@aercghana.org'}
                    placeholder="admin@aercgh.org, comms@aercghana.org"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enable Inbound Staff Notifications
                  </label>
                  <select
                    name="notificationsEnabled"
                    defaultValue={notificationSettings?.notificationsEnabled || 'yes'}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="yes">Yes &ndash; Send instant email alerts to staff</option>
                    <option value="no">No &ndash; Dashboard logging only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enable Sender Auto-Responder Confirmation
                  </label>
                  <select
                    name="autoResponderEnabled"
                    defaultValue={notificationSettings?.autoResponderEnabled || 'yes'}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="yes">Yes &ndash; Send immediate receipt email to sender</option>
                    <option value="no">No &ndash; Disable auto-responder</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Auto-Responder Subject Line
                </label>
                <input
                  type="text"
                  name="autoResponderSubject"
                  defaultValue={notificationSettings?.autoResponderSubject || 'Thank you for contacting AERC Ghana'}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Auto-Responder Confirmation Message Template
                </label>
                <textarea
                  name="autoResponderMessage"
                  rows={4}
                  defaultValue={
                    notificationSettings?.autoResponderMessage ||
                    'Dear Sender,\n\nThank you for reaching out to the Alliance for Empowering Rural Communities (AERC Ghana). We have received your inquiry and our team is reviewing your message.\n\nWe will get back to you shortly.\n\nWarm regards,\nAERC Ghana Communications & Secretariat'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Data Retention & Privacy Section */}
              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Privacy &amp; Data Retention Compliance</h4>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  In compliance with Ghanaian Data Protection Act (Act 843) and international privacy frameworks, personal messages can be automatically purged after a designated retention period.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Data Retention Period (Days)
                    </label>
                    <input
                      type="number"
                      name="retentionDays"
                      min={30}
                      max={1825}
                      defaultValue={notificationSettings?.retentionDays || 365}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Default: 365 days (1 year).</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Spam Protection Level
                    </label>
                    <select
                      name="spamProtectionLevel"
                      defaultValue={notificationSettings?.spamProtectionLevel || 'standard'}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="standard">Standard (Honeypot + Bot Timing Check)</option>
                      <option value="strict">Strict (Honeypot + Timing + Strict Regex)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Manual Data Retention Cleanup</div>
                    <div className="text-[11px] text-slate-400">Purge personal inquiry records older than retention threshold.</div>
                  </div>
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => setIsPurgingRetention(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold transition-colors"
                    >
                      Run Retention Purge
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Notification Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- INSPECTOR DRAWER (FULL MESSAGE MODAL) ---------------- */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(selectedInquiry.status)}
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedInquiry.category || 'General Inquiry'}
                  </span>
                  {getPriorityBadge(selectedInquiry.priority)}
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedInquiry.subject || 'No Subject Provided'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                &times;
              </button>
            </div>

            {/* Sender Profile Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Sender Details</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedInquiry.name}</div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 font-mono mt-1">
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3 text-slate-500" />
                    {selectedInquiry.email}
                  </a>
                  {selectedInquiry.phone && (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="text-slate-300 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-slate-500" />
                      {selectedInquiry.phone}
                    </a>
                  )}
                </div>
              </div>

              <div className="text-right text-slate-400 font-mono text-[11px] shrink-0">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Received On</span>
                <span>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Message Content
              </span>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Status</label>
                <select
                  value={selectedInquiry.status || 'New'}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Responded">Responded</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Priority</label>
                <select
                  value={selectedInquiry.priority || 'normal'}
                  onChange={(e) => handlePriorityChange(selectedInquiry.id, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Staff Assignee */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Assign to Staff</label>
                <select
                  value={selectedInquiry.assignedTo || ''}
                  onChange={(e) => handleAssignStaff(selectedInquiry.id, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                >
                  <option value="">(Unassigned)</option>
                  {staffUsers.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Official Response History or CTA */}
            {selectedInquiry.responseSummary ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Official Response Recorded
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    By {selectedInquiry.respondedBy || 'Staff'} &middot;{' '}
                    {selectedInquiry.respondedAt
                      ? new Date(selectedInquiry.respondedAt).toLocaleDateString()
                      : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{selectedInquiry.responseSummary}"
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Record Response</div>
                  <div className="text-[11px] text-slate-400">Log email, phone, or in-person consultation reply.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResponseModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Record Response</span>
                </button>
              </div>
            )}

            {/* Internal Staff Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Internal Staff Notes &amp; Follow-Up Log
              </label>
              <textarea
                rows={3}
                placeholder="Add confidential staff notes, meeting outcomes, or next steps..."
                value={internalNotesText}
                onChange={(e) => setInternalNotesText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveInternalNotes(selectedInquiry.id)}
                  disabled={isPending}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleRead(selectedInquiry)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  {selectedInquiry.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                  <span>{selectedInquiry.isRead ? 'Mark as Unread' : 'Mark as Read'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleArchive(selectedInquiry)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{selectedInquiry.isArchived === 'yes' ? 'Restore' : 'Archive'}</span>
                </button>
              </div>

              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setIsDeletingInquiry(selectedInquiry)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: RECORD RESPONSE ---------------- */}
      {isResponseModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white">Record Official Response</h3>
            <p className="text-xs text-slate-400 mt-1">
              Document response details provided to {selectedInquiry.name} ({selectedInquiry.email}).
            </p>

            <form onSubmit={handleRecordResponseSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Response Summary / Reply Notes *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Sent formal project partnership brochure and arranged Zoom consultation for next Tuesday."
                  value={responseSummary}
                  onChange={(e) => setResponseSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResponseModalOpen(false)}
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
                  <span>Save &amp; Set Responded</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: DELETE INQUIRY ---------------- */}
      {isDeletingInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">Permanently Delete Inquiry?</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              This action permanently purges the message and personal sender data ({isDeletingInquiry.name} &bull; {isDeletingInquiry.email}) in compliance with privacy retention. This cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsDeletingInquiry(null)}
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
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: RETENTION PURGE ---------------- */}
      {isPurgingRetention && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">Run Data Retention Cleanup?</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              This will permanently delete all inquiry records older than{' '}
              <strong>{notificationSettings?.retentionDays || 365} days</strong> from the database to comply with data privacy policies.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPurgingRetention(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRetentionPurge}
                disabled={isPending}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-all shadow-rose-950 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Execute Purge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
