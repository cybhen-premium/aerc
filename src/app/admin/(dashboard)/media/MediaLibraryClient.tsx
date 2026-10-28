'use client';

import React, { useState, useTransition, useMemo } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Filter,
  Grid,
  List,
  Copy,
  Check,
  Trash2,
  Edit3,
  ExternalLink,
  AlertTriangle,
  Folder,
  FileText,
  RefreshCw,
  X,
  Layers,
  ZoomIn,
  ShieldAlert,
  Sparkles,
  Download,
  Info,
  Maximize2,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';
import { MediaItem } from '@/db/schema';
import {
  uploadMediaAction,
  updateMediaDetailsAction,
  replaceMediaFileAction,
  deleteMediaAction,
  checkMediaUsageAction,
} from '../../actions';

interface MediaLibraryClientProps {
  initialItems: MediaItem[];
}

interface MediaUsageItem {
  entityType: string;
  title: string;
  field: string;
  link?: string;
}

const CATEGORIES = [
  'All',
  'Team Photographs',
  'Project Images',
  'Event Photographs',
  'Publication Covers',
  'Homepage Banners',
  'Logos and Branding',
  'General Website Images',
];

export default function MediaLibraryClient({ initialItems }: MediaLibraryClientProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'image' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Selected item for Inspector Drawer
  const [inspectingItem, setInspectingItem] = useState<MediaItem | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'details' | 'usage' | 'replace' | 'responsive'>('details');

  // Usage audit state for inspected item
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [usageList, setUsageList] = useState<MediaUsageItem[]>([]);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [deleteUsages, setDeleteUsages] = useState<MediaUsageItem[]>([]);
  const [forceDeleteChecked, setForceDeleteChecked] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Upload Form State
  const [uploadCategory, setUploadCategory] = useState<string>('General Website Images');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Inspector Edit Form State
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');

  // Replace file state
  const [replacementFile, setReplacementFile] = useState<File | null>(null);

  // Load item details into inspector
  const openInspector = async (item: MediaItem) => {
    setInspectingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditAltText(item.altText || '');
    setEditCaption(item.caption || '');
    setEditDescription(item.description || '');
    setEditTags(item.tags || '');
    setReplacementFile(null);
    setInspectorTab('details');

    // Fetch usage audit
    setLoadingUsage(true);
    setUsageList([]);
    try {
      const report = await checkMediaUsageAction(item.id);
      setUsageList(report.usages || []);
    } catch (e) {
      console.error('Failed to audit usage:', e);
    } finally {
      setLoadingUsage(false);
    }
  };

  // Close inspector
  const closeInspector = () => {
    setInspectingItem(null);
  };

  // KPI calculations
  const totalAssets = items.length;
  const imageAssets = items.filter((i) => i.fileType.startsWith('image/')).length;
  const documentAssets = items.filter((i) => !i.fileType.startsWith('image/')).length;
  const totalBytes = items.reduce((acc, curr) => acc + (curr.bytes || 0), 0);
  const formattedTotalSize = (totalBytes / (1024 * 1024)).toFixed(1) + ' MB';

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }
        // File type filter
        if (fileTypeFilter === 'image' && !item.fileType.startsWith('image/')) {
          return false;
        }
        if (fileTypeFilter === 'document' && item.fileType.startsWith('image/')) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesFilename = item.filename.toLowerCase().includes(q);
          const matchesAlt = item.altText?.toLowerCase().includes(q);
          const matchesTags = item.tags?.toLowerCase().includes(q);
          const matchesCategory = item.category.toLowerCase().includes(q);
          return matchesTitle || matchesFilename || matchesAlt || matchesTags || matchesCategory;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (sortBy === 'size') {
          return (b.bytes || 0) - (a.bytes || 0);
        }
        if (sortBy === 'name') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [items, selectedCategory, fileTypeFilter, searchQuery, sortBy]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Handle Upload Form Submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUploadFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploadError(null);
    const formData = new FormData();
    formData.append('file', selectedUploadFile);
    formData.append('category', uploadCategory);
    formData.append('title', uploadTitle || selectedUploadFile.name);
    formData.append('altText', uploadAltText);
    formData.append('caption', uploadCaption);
    formData.append('description', uploadDescription);
    formData.append('tags', uploadTags);

    startTransition(async () => {
      const res = await uploadMediaAction(formData);
      if (res.success) {
        setShowUploadModal(false);
        setSelectedUploadFile(null);
        setUploadTitle('');
        setUploadAltText('');
        setUploadCaption('');
        setUploadDescription('');
        setUploadTags('');
        setActionFeedback({ type: 'success', message: 'Asset successfully uploaded to media library!' });
        setTimeout(() => setActionFeedback(null), 4000);
        window.location.reload();
      } else {
        setUploadError(res.error || 'Failed to upload media asset.');
      }
    });
  };

  // Handle Metadata Update
  const handleUpdateDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingItem) return;

    const formData = new FormData();
    formData.append('id', String(inspectingItem.id));
    formData.append('title', editTitle);
    formData.append('category', editCategory);
    formData.append('altText', editAltText);
    formData.append('caption', editCaption);
    formData.append('description', editDescription);
    formData.append('tags', editTags);

    startTransition(async () => {
      const res = await updateMediaDetailsAction(formData);
      if (res.success) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === inspectingItem.id
              ? {
                  ...item,
                  title: editTitle,
                  category: editCategory,
                  altText: editAltText,
                  caption: editCaption,
                  description: editDescription,
                  tags: editTags,
                }
              : item
          )
        );
        setInspectingItem((prev) =>
          prev
            ? {
                ...prev,
                title: editTitle,
                category: editCategory,
                altText: editAltText,
                caption: editCaption,
                description: editDescription,
                tags: editTags,
              }
            : null
        );
        setActionFeedback({ type: 'success', message: 'Media details updated successfully!' });
        setTimeout(() => setActionFeedback(null), 3000);
      } else {
        setActionFeedback({ type: 'error', message: res.error || 'Failed to update metadata.' });
        setTimeout(() => setActionFeedback(null), 4000);
      }
    });
  };

  // Handle File Replacement
  const handleReplaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingItem || !replacementFile) return;

    const formData = new FormData();
    formData.append('id', String(inspectingItem.id));
    formData.append('file', replacementFile);

    startTransition(async () => {
      const res = await replaceMediaFileAction(formData);
      if (res.success) {
        setActionFeedback({ type: 'success', message: 'Media file replaced successfully!' });
        setTimeout(() => setActionFeedback(null), 4000);
        window.location.reload();
      } else {
        setActionFeedback({ type: 'error', message: res.error || 'Replacement failed.' });
        setTimeout(() => setActionFeedback(null), 4000);
      }
    });
  };

  // Prompt delete dialog
  const promptDelete = async (item: MediaItem) => {
    setItemToDelete(item);
    setForceDeleteChecked(false);
    setDeleteError(null);
    setDeleteUsages([]);
    setShowDeleteModal(true);

    try {
      const report = await checkMediaUsageAction(item.id);
      setDeleteUsages(report.usages || []);
    } catch (e) {
      console.error('Failed to check usage prior to delete:', e);
    }
  };

  // Execute deletion
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;

    const formData = new FormData();
    formData.append('id', String(itemToDelete.id));
    if (forceDeleteChecked || deleteUsages.length === 0) {
      formData.append('force', 'true');
    }

    startTransition(async () => {
      const res = await deleteMediaAction(formData);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        if (inspectingItem?.id === itemToDelete.id) {
          setInspectingItem(null);
        }
        setShowDeleteModal(false);
        setItemToDelete(null);
        setActionFeedback({ type: 'success', message: 'Media asset deleted successfully.' });
        setTimeout(() => setActionFeedback(null), 3500);
      } else {
        setDeleteError(res.error || 'Cannot delete item.');
        if (res.usages) {
          setDeleteUsages(res.usages);
        }
      }
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Feedback Notification */}
      {actionFeedback && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all transform animate-in fade-in slide-in-from-top-4 ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-900/30'
              : 'bg-rose-600 text-white shadow-rose-900/30'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span>{actionFeedback.message}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="ml-2 hover:opacity-75 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-950">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Media Library & Cloudinary Assets
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Organize images, publication covers, project photos, and PDFs with usage auditing and responsive delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setUploadError(null);
              setSelectedUploadFile(null);
              setUploadTitle('');
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-sm shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Media</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalAssets}</div>
            <div className="text-xs text-slate-400">Total Media Assets</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{imageAssets}</div>
            <div className="text-xs text-slate-400">Photos & Graphics</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{documentAssets}</div>
            <div className="text-xs text-slate-400">PDFs & Documents</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{formattedTotalSize}</div>
            <div className="text-xs text-slate-400">Estimated Storage</div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = cat === 'All' ? items.length : items.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-emerald-800/80 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Toolbars */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, filename, alt text, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* File Type Filter */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setFileTypeFilter('all')}
              className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                fileTypeFilter === 'all' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFileTypeFilter('image')}
              className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                fileTypeFilter === 'image' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setFileTypeFilter('document')}
              className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                fileTypeFilter === 'document' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Documents
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="size">Largest Size</option>
            <option value="name">Name (A-Z)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No media assets found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
            {searchQuery
              ? `No media matching "${searchQuery}". Try adjusting your search query or category filter.`
              : 'There are no assets in this category yet. Upload images or documents to populate.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setFileTypeFilter('all');
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const isImage = item.fileType.startsWith('image/');
            const isSelected = inspectingItem?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => openInspector(item)}
                className={`group relative bg-slate-900 border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:border-emerald-500/60 ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                    : 'border-slate-800'
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hero-bg.jpg';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <FileText className="w-10 h-10 text-amber-400 mb-1" />
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {item.fileType.includes('pdf') ? 'PDF Document' : 'Document'}
                      </span>
                    </div>
                  )}

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] uppercase font-bold text-white">
                      {item.fileType.split('/')[1] || 'FILE'}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.url, `card-${item.id}`);
                      }}
                      className="p-1.5 rounded-md bg-black/70 hover:bg-emerald-600 text-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedKey === `card-${item.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        promptDelete(item);
                      }}
                      className="p-1.5 rounded-md bg-black/70 hover:bg-rose-600 text-white transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3">
                  <div className="font-semibold text-xs text-white truncate" title={item.title}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mb-1" title={item.filename}>
                    {item.filename}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    <span className="truncate max-w-[90px]">{item.category}</span>
                    <span className="font-medium text-slate-400">{item.fileSize}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List Table View */}
      {viewMode === 'list' && filteredItems.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Asset Preview</th>
                  <th className="px-4 py-3">Title & Filename</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Dimensions / Size</th>
                  <th className="px-4 py-3">Uploaded By</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredItems.map((item) => {
                  const isImage = item.fileType.startsWith('image/');

                  return (
                    <tr
                      key={item.id}
                      onClick={() => openInspector(item)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800">
                          {isImage ? (
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-6 h-6 text-amber-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.filename}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>{item.fileSize}</div>
                        {item.width && item.height && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            {item.width} × {item.height}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-[11px]">
                        <div>{item.uploadedBy || 'Admin'}</div>
                        <div className="text-[10px] text-slate-500">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'System'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleCopy(item.url, `list-${item.id}`)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Copy URL"
                          >
                            {copiedKey === `list-${item.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => openInspector(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Inspect Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => promptDelete(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/80 text-rose-400 hover:text-white transition-colors"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECTOR DRAWER / MODAL */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end transition-opacity animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Inspector Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm truncate max-w-sm">
                    {inspectingItem.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {inspectingItem.filename}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => promptDelete(inspectingItem)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  title="Delete Asset"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
                <button
                  onClick={closeInspector}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/30 text-xs">
              <button
                onClick={() => setInspectorTab('details')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                  inspectorTab === 'details'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Metadata & Specs
              </button>
              <button
                onClick={() => setInspectorTab('usage')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  inspectorTab === 'usage'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <span>Website Usages</span>
                {usageList.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                    {usageList.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setInspectorTab('replace')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                  inspectorTab === 'replace'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Replace File
              </button>
              <button
                onClick={() => setInspectorTab('responsive')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                  inspectorTab === 'responsive'
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Responsive Delivery
              </button>
            </div>

            {/* Inspector Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Asset Preview Box */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center">
                <div className="relative max-h-64 w-full flex items-center justify-center overflow-hidden rounded-lg">
                  {inspectingItem.fileType.startsWith('image/') ? (
                    <img
                      src={inspectingItem.url}
                      alt={inspectingItem.altText || inspectingItem.title}
                      className="max-h-60 max-w-full object-contain rounded-md shadow-md"
                    />
                  ) : (
                    <div className="py-8 flex flex-col items-center gap-2">
                      <FileText className="w-16 h-16 text-amber-400" />
                      <div className="text-sm font-semibold text-white">{inspectingItem.filename}</div>
                      <a
                        href={inspectingItem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF File
                      </a>
                    </div>
                  )}
                </div>

                {/* Quick 1-Click Copy Links */}
                <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] truncate max-w-[280px]">{inspectingItem.url}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(inspectingItem.url, 'insp-url')}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 transition-colors text-[11px]"
                    >
                      {copiedKey === 'insp-url' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                    <a
                      href={inspectingItem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Open Original in New Window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* TAB 1: METADATA & SPECS */}
              {inspectorTab === 'details' && (
                <form onSubmit={handleUpdateDetails} className="space-y-4">
                  {/* Technical Specs Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">File Size</div>
                      <div className="text-white font-semibold">{inspectingItem.fileSize}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">MIME Type</div>
                      <div className="text-white font-semibold truncate">{inspectingItem.fileType}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">Dimensions</div>
                      <div className="text-white font-semibold">
                        {inspectingItem.width && inspectingItem.height
                          ? `${inspectingItem.width} × ${inspectingItem.height}`
                          : 'Original'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">Storage Provider</div>
                      <div className="text-emerald-400 font-semibold truncate">
                        {inspectingItem.url.startsWith('/') ? 'Local Storage' : 'Cloudinary CDN'}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Asset Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Media Category
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Alternative Text */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Alternative Text (Alt Text)</span>
                      <span className="text-[10px] text-emerald-400 font-normal">Crucial for SEO & Accessibility</span>
                    </label>
                    <input
                      type="text"
                      value={editAltText}
                      onChange={(e) => setEditAltText(e.target.value)}
                      placeholder="Concise description of the image for screen readers"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Image Caption
                    </label>
                    <input
                      type="text"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder="Display caption shown directly below image in articles or lightboxes"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Internal Image Description & Context
                    </label>
                    <textarea
                      rows={2}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Context notes on origin, rights, participants, and publication permissions"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Search Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="energy, solar, ghana, climate, youth"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save Metadata Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: WEBSITE USAGE AUDIT */}
              {inspectorTab === 'usage' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <ShieldAlert className="w-4 h-4 text-emerald-400" />
                      <span>Dependency & Usage Audit</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      The system inspects articles, projects, publications, team profiles, and site pages to verify where this media asset is actively referenced.
                    </p>
                  </div>

                  {loadingUsage ? (
                    <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                      <span className="text-xs">Auditing website pages, articles, and databases...</span>
                    </div>
                  ) : usageList.length === 0 ? (
                    <div className="p-6 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-semibold text-emerald-300">Unused Asset</h4>
                      <p className="text-xs text-emerald-400/80 mt-1 max-w-sm mx-auto">
                        This file is not currently referenced as a cover or embedded in any known articles, projects, or pages. It can be safely deleted or replaced without breaking public links.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-amber-400 font-semibold px-1">
                        <span>Referenced in {usageList.length} location(s):</span>
                        <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">
                          Deletion Guardrail Active
                        </span>
                      </div>

                      {usageList.map((usage, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 rounded bg-slate-800 font-semibold text-[10px] text-slate-300 uppercase">
                              {usage.entityType}
                            </span>
                            <div>
                              <div className="font-semibold text-white">{usage.title}</div>
                              <div className="text-[10px] text-slate-400">Field: {usage.field}</div>
                            </div>
                          </div>

                          {usage.link && (
                            <a
                              href={usage.link}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="View Public Reference"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: REPLACE FILE */}
              {inspectorTab === 'replace' && (
                <form onSubmit={handleReplaceSubmit} className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <RefreshCw className="w-4 h-4 text-emerald-400" />
                      <span>Replace Media File Content</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Upload a new version of this image or document. All metadata, titles, and website references will stay intact while the underlying file is seamlessly updated.
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-emerald-500/60 transition-colors bg-slate-950/40">
                    <input
                      type="file"
                      id="replacementFileInput"
                      onChange={(e) => setReplacementFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="replacementFileInput" className="cursor-pointer flex flex-col items-center">
                      <UploadCloud className="w-10 h-10 text-emerald-400 mb-2" />
                      <span className="text-sm font-semibold text-white">
                        {replacementFile ? replacementFile.name : 'Choose Replacement File'}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        {replacementFile
                          ? `${(replacementFile.size / 1024).toFixed(0)} KB • Ready to replace`
                          : 'Supports JPG, PNG, WEBP, PDF, SVG'}
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!replacementFile || isPending}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Replacing Media File...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Confirm File Replacement</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 4: RESPONSIVE DELIVERY & OPTIMIZATION */}
              {inspectorTab === 'responsive' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>Responsive Delivery & Embed Snippets</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Copy optimized variant URLs and responsive code snippets ready to paste into pages, templates, or markdown articles.
                    </p>
                  </div>

                  {/* HTML Image Tag Snippet */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                      <span>HTML Image Element (`&lt;img&gt;`)</span>
                      <button
                        onClick={() =>
                          handleCopy(
                            `<img src="${inspectingItem.url}" alt="${inspectingItem.altText || inspectingItem.title}" loading="lazy" class="w-full h-auto rounded-xl" />`,
                            'snip-html'
                          )
                        }
                        className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === 'snip-html' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'snip-html' ? 'Copied' : 'Copy HTML'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                      {`<img src="${inspectingItem.url}" alt="${inspectingItem.altText || inspectingItem.title}" loading="lazy" class="w-full h-auto rounded-xl" />`}
                    </pre>
                  </div>

                  {/* Markdown Snippet */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                      <span>Markdown Snippet</span>
                      <button
                        onClick={() =>
                          handleCopy(`![${inspectingItem.altText || inspectingItem.title}](${inspectingItem.url})`, 'snip-md')
                        }
                        className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedKey === 'snip-md' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'snip-md' ? 'Copied' : 'Copy Markdown'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                      {`![${inspectingItem.altText || inspectingItem.title}](${inspectingItem.url})`}
                    </pre>
                  </div>

                  {/* Device Breakpoints Guide */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="font-semibold text-white">Target Breakpoints for Web Delivery:</div>
                    <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                      <li><strong className="text-slate-300">Mobile (320px - 480px):</strong> 400px width target with webp compression.</li>
                      <li><strong className="text-slate-300">Tablet / Card Preview (640px - 768px):</strong> 800px width with automatic quality.</li>
                      <li><strong className="text-slate-300">Desktop Banners (1024px - 1920px):</strong> High-res delivery with auto-fetch format.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD NEW MEDIA MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Upload Media Asset</h3>
                  <p className="text-xs text-slate-400">Add an image, logo, publication cover, or document</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {uploadError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* File Dropzone */}
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-emerald-500/60 transition-colors bg-slate-950/60">
                <input
                  type="file"
                  id="mediaUploadFileInput"
                  required
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedUploadFile(file);
                      if (!uploadTitle) {
                        setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                      }
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="mediaUploadFileInput" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-10 h-10 text-emerald-400 mb-2" />
                  <span className="text-sm font-semibold text-white">
                    {selectedUploadFile ? selectedUploadFile.name : 'Click to Browse or Drag File Here'}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    {selectedUploadFile
                      ? `${(selectedUploadFile.size / 1024).toFixed(0)} KB • Ready for upload`
                      : 'Supports JPEG, PNG, WEBP, GIF, SVG, and PDF documents up to 25MB'}
                  </span>
                </label>
              </div>

              {/* Title & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Descriptive asset title"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Alternative Text</span>
                  <span className="text-[10px] text-emerald-400 font-normal">For screen readers & search engines</span>
                </label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="Describe image visual contents"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Image Caption (Optional)
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Caption to display with photo in articles"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="e.g. project, clean cooking, accra, event"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !selectedUploadFile}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading Asset...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Asset</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE GUARDRAIL CONFIRMATION MODAL */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-rose-950/30">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Delete Media Asset</h3>
                <p className="text-xs text-rose-300/80">Safety Dependency Verification</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-300">
                Are you sure you want to delete <strong className="text-white">"{itemToDelete.title}"</strong> ({itemToDelete.filename})?
              </div>

              {deleteError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {deleteError}
                </div>
              )}

              {/* If actively in use: Display prominent warning guardrail */}
              {deleteUsages.length > 0 ? (
                <div className="bg-rose-950/40 border border-rose-900/60 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Active Website Dependency Detected!</span>
                  </div>
                  <p className="text-[11px] text-rose-300 leading-relaxed">
                    This media asset is currently used in <strong>{deleteUsages.length} place(s)</strong> across the website. Deleting this file will result in broken images or 404 links on public pages.
                  </p>

                  <div className="max-h-32 overflow-y-auto space-y-1 pt-1 scrollbar-thin">
                    {deleteUsages.map((u, i) => (
                      <div key={i} className="text-[11px] bg-slate-950/80 px-2 py-1 rounded text-slate-300 flex items-center justify-between">
                        <span className="truncate">{u.entityType}: {u.title}</span>
                        <span className="text-[10px] text-rose-400 shrink-0 font-medium">{u.field}</span>
                      </div>
                    ))}
                  </div>

                  <label className="flex items-start gap-2 pt-2 border-t border-rose-900/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={forceDeleteChecked}
                      onChange={(e) => setForceDeleteChecked(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-[11px] text-rose-300 font-semibold select-none">
                      I understand the risk and want to force delete this asset anyway.
                    </span>
                  </label>
                </div>
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Safe to delete. No active references were found across pages or articles.</span>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending || (deleteUsages.length > 0 && !forceDeleteChecked)}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-medium text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Deletion</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
