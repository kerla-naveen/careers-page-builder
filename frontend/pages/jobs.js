import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import JobEditorModal from '../components/editor/JobEditorModal';
import {
  UilBriefcase,
  UilPalette,
  UilPlus,
  UilSearch,
  UilEye,
  UilPen,
  UilTrashAlt,
  UilRocket,
  UilPauseCircle,
  UilArchive,
  UilInbox,
  UilExclamationTriangle,
  UilCheckCircle,
  UilMapPin,
  UilSync,
  UilExternalLinkAlt,
} from '@iconscout/react-unicons';

const STATUS_BADGES = {
  PUBLISHED: { label: 'Published', bg: '#dcfce7', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
  DRAFT: { label: 'Draft', bg: '#f1f5f9', text: '#475569', border: '#e2e8f0', dot: '#94a3b8' },
  CLOSED: { label: 'Closed', bg: '#fef3c7', text: '#b45309', border: '#fde68a', dot: '#f59e0b' },
  UNPUBLISHED: { label: 'Closed', bg: '#fef3c7', text: '#b45309', border: '#fde68a', dot: '#f59e0b' },
  ARCHIVED: { label: 'Archived', bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb', dot: '#9ca3af' },
};

export default function JobsManagementPage() {
  const router = useRouter();
  const { user, token, loading: authLoading, logout } = useAuth();

  const [companySlug, setCompanySlug] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters & Search state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [sort, setSort] = useState('recently_created');

  // Facets
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ ALL: 0, DRAFT: 0, PUBLISHED: 0, CLOSED: 0, ARCHIVED: 0 });

  // Selection & Bulk actions
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Modals state
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [activeMenuJobId, setActiveMenuJobId] = useState(null);

  // Confirmation modal
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null); // { type: 'single' | 'bulk', id?: string }

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      const slug = user.company?.slug || user.companySlug || '';
      if (slug) {
        setCompanySlug(slug);
      }
    }
  }, [user, authLoading, router]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch jobs list
  const fetchJobs = useCallback(async () => {
    if (!companySlug || !token) return;

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
      });

      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (departmentFilter !== 'ALL') params.append('department', departmentFilter);
      if (locationFilter !== 'ALL') params.append('location', locationFilter);

      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}/jobs/recruiter?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setJobs(data.data || []);
        setTotalJobs(data.totalJobs || 0);
        setTotalPages(data.totalPages || 1);
        setAvailableDepartments(data.availableDepartments || []);
        setAvailableLocations(data.availableLocations || []);
        if (data.statusCounts) setStatusCounts(data.statusCounts);
      } else {
        setError(data.error || 'Failed to load jobs');
      }
    } catch (err) {
      setError('Network error loading jobs. Make sure server is running.');
    } finally {
      setLoading(false);
    }
  }, [companySlug, token, page, limit, debouncedSearch, statusFilter, departmentFilter, locationFilter, sort]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuJobId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(jobs.map((j) => j._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Job Actions
  const handleOpenCreateModal = () => {
    setJobToEdit(null);
    setIsEditorModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setJobToEdit(job);
    setIsEditorModalOpen(true);
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Job status updated to ${newStatus}`);
        fetchJobs();
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Network error updating status', 'error');
    }
  };

  const handleDuplicateJob = async (jobId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}/jobs/${jobId}/duplicate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Job duplicated successfully');
        fetchJobs();
      } else {
        showToast(data.error || 'Failed to duplicate job', 'error');
      }
    } catch (err) {
      showToast('Network error duplicating job', 'error');
    }
  };

  const handleDeleteSingle = async (jobId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Job deleted successfully');
        setSelectedIds((prev) => prev.filter((id) => id !== jobId));
        fetchJobs();
      } else {
        showToast(data.error || 'Failed to delete job', 'error');
      }
    } catch (err) {
      showToast('Network error deleting job', 'error');
    } finally {
      setDeleteConfirmTarget(null);
    }
  };

  // Bulk Actions
  const handleBulkStatusChange = async (targetStatus) => {
    if (selectedIds.length === 0) return;
    setBulkActionLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}/jobs/bulk-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobIds: selectedIds, status: targetStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Updated ${data.modifiedCount} jobs to ${targetStatus}`);
        setSelectedIds([]);
        fetchJobs();
      } else {
        showToast(data.error || 'Bulk status update failed', 'error');
      }
    } catch (err) {
      showToast('Network error performing bulk update', 'error');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkActionLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}/jobs/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobIds: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Deleted ${data.deletedCount} jobs`);
        setSelectedIds([]);
        fetchJobs();
      } else {
        showToast(data.error || 'Bulk delete failed', 'error');
      }
    } catch (err) {
      showToast('Network error performing bulk delete', 'error');
    } finally {
      setBulkActionLoading(false);
      setDeleteConfirmTarget(null);
    }
  };

  if (authLoading || (!user && !error)) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
            <UilSync size={28} className="animate-spin" />
          </div>
          Loading Jobs Workspace...
        </div>
      </div>
    );
  }

  const allSelected = jobs.length > 0 && selectedIds.length === jobs.length;
  const isSomeSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[99999] text-white px-5 py-3 rounded-lg shadow-xl text-sm font-semibold flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
        }`}>
          {toast.type === 'error' ? <UilExclamationTriangle size={18} /> : <UilCheckCircle size={18} />} {toast.message}
        </div>
      )}

      {/* Recruiter Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-extrabold text-lg text-slate-900 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <UilBriefcase size={18} />
            </span>
            {user?.company?.name || user?.companyName || 'Recruiter Portal'}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <nav className="flex gap-1.5">
            <Link href="/editor" className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 no-underline">
              <UilPalette size={16} /> Careers Page
            </Link>
            <Link href="/jobs" className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50 flex items-center gap-1.5 no-underline">
              <UilBriefcase size={16} /> Jobs
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`/companies/${companySlug}/careers`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-slate-600 no-underline px-3 py-1.5 border border-slate-300 rounded-md bg-white inline-flex items-center gap-1 hover:bg-slate-50 transition-colors"
          >
            Live Site <UilExternalLinkAlt size={14} />
          </a>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {user?.name ? user.name[0].toUpperCase() : 'R'}
            </div>
            <button
              onClick={logout}
              className="bg-transparent border-none text-red-500 text-xs font-semibold cursor-pointer hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        
        {/* Page Title & + Create Job */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold m-0 text-slate-900 tracking-tight">
              Jobs
            </h1>
            <p className="text-sm text-slate-500 m-0 mt-1">
              Manage your company&apos;s open positions, track role statuses, and publish postings.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <UilPlus size={18} /> Create Job
          </button>
        </div>

        {/* Status Count Pills */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'ALL', label: 'All Jobs', count: statusCounts.ALL },
            { key: 'PUBLISHED', label: 'Published', count: statusCounts.PUBLISHED },
            { key: 'DRAFT', label: 'Drafts', count: statusCounts.DRAFT },
            { key: 'CLOSED', label: 'Closed', count: statusCounts.CLOSED },
            { key: 'ARCHIVED', label: 'Archived', count: statusCounts.ARCHIVED },
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all border ${
                  isActive
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-4 flex flex-wrap gap-4 items-center justify-between">
          {/* Left Controls: Search & Select Filters */}
          <div className="flex flex-wrap gap-3 flex-1 min-w-[300px]">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                <UilSearch size={16} />
              </span>
              <input
                type="text"
                placeholder="Search jobs by title, department, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-600 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-slate-400 cursor-pointer text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-700 cursor-pointer"
            >
              <option value="ALL">Department: All</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={locationFilter}
              onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-700 cursor-pointer"
            >
              <option value="ALL">Location: All</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

          </div>

          {/* Right Control: Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-700 cursor-pointer font-semibold"
            >
              <option value="recently_created">Recently Created</option>
              <option value="recently_updated">Recently Updated</option>
              <option value="title">Job Title (A-Z)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Floating Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-slate-900 text-white rounded-xl px-5 py-3 mb-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="bg-blue-600 px-2.5 py-0.5 rounded-full text-xs">
                {selectedIds.length} selected
              </span>
              <span>Bulk management actions:</span>
            </div>

            <div className="flex gap-2">
              <button
                disabled={bulkActionLoading}
                onClick={() => handleBulkStatusChange('PUBLISHED')}
                className="px-3.5 py-1.5 rounded-md border-none bg-emerald-600 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1 hover:bg-emerald-700 transition-colors"
              >
                <UilRocket size={14} /> Publish
              </button>

              <button
                disabled={bulkActionLoading}
                onClick={() => handleBulkStatusChange('CLOSED')}
                className="px-3.5 py-1.5 rounded-md border-none bg-amber-600 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1 hover:bg-amber-700 transition-colors"
              >
                <UilPauseCircle size={14} /> Close
              </button>

              <button
                disabled={bulkActionLoading}
                onClick={() => handleBulkStatusChange('ARCHIVED')}
                className="px-3.5 py-1.5 rounded-md border-none bg-slate-600 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1 hover:bg-slate-700 transition-colors"
              >
                <UilArchive size={14} /> Archive
              </button>

              <button
                disabled={bulkActionLoading}
                onClick={() => setDeleteConfirmTarget({ type: 'bulk' })}
                className="px-3.5 py-1.5 rounded-md border-none bg-red-600 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1 hover:bg-red-700 transition-colors"
              >
                <UilTrashAlt size={14} /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Scalable Job Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-slate-500">
              <div className="text-2xl mb-3 flex justify-center">
                <UilSync size={24} className="animate-spin" />
              </div>
              Loading job postings...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 text-sm flex items-center justify-center gap-2">
              <UilExclamationTriangle size={20} /> {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-5xl mb-4 text-slate-400 flex justify-center">
                <UilInbox size={48} />
              </div>
              <h3 className="text-lg font-bold m-0 mb-1.5 text-slate-800">
                No jobs found
              </h3>
              <p className="text-sm text-slate-500 m-0 mb-6 max-w-sm mx-auto">
                {debouncedSearch || statusFilter !== 'ALL' || departmentFilter !== 'ALL'
                  ? 'No roles match your search filters. Try clearing filters to see all jobs.'
                  : "You haven't created any job postings yet. Get started by creating your first position!"}
              </p>
              {debouncedSearch || statusFilter !== 'ALL' || departmentFilter !== 'ALL' ? (
                <button
                  onClick={() => { setSearch(''); setStatusFilter('ALL'); setDepartmentFilter('ALL'); setLocationFilter('ALL'); }}
                  className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-semibold text-xs cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={handleOpenCreateModal}
                  className="px-5 py-2.5 bg-blue-600 border-none rounded-lg text-white font-semibold text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  + Create Your First Job
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="p-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => el && (el.indeterminate = isSomeSelected)}
                          onChange={handleSelectAll}
                          className="cursor-pointer"
                        />
                      </th>
                      <th className="p-3 px-4">Job Title</th>
                      <th className="p-3 px-4">Department</th>
                      <th className="p-3 px-4">Location</th>
                      <th className="p-3 px-4">Employment Type</th>
                      <th className="p-3 px-4">Status</th>
                      <th className="p-3 px-4 text-right min-w-[220px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => {
                      const isSelected = selectedIds.includes(job._id);
                      const badge = STATUS_BADGES[job.status] || STATUS_BADGES.DRAFT;

                      return (
                        <tr
                          key={job._id}
                          className={`border-b border-slate-100 transition-colors ${
                            isSelected ? 'bg-blue-50/60' : 'bg-white hover:bg-slate-50/50'
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-3.5 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectOne(job._id)}
                              className="cursor-pointer"
                            />
                          </td>

                          {/* Title & Clickable to Edit */}
                          <td className="p-3.5 px-4">
                            <div
                              onClick={() => handleOpenEditModal(job)}
                              className="font-bold text-slate-800 cursor-pointer inline-block hover:text-blue-600 transition-colors"
                            >
                              <span>{job.title}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {job.work_policy || 'Remote'} • Slug: /{job.job_slug}
                            </div>
                          </td>

                          {/* Department */}
                          <td className="p-3.5 px-4 text-slate-700 font-medium">
                            {job.department || 'Engineering'}
                          </td>

                          {/* Location */}
                          <td className="p-3.5 px-4 text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <UilMapPin size={14} /> {job.location || 'Remote'}
                            </span>
                          </td>

                          {/* Employment Type */}
                          <td className="p-3.5 px-4 text-slate-600">
                            {job.employment_type || 'Full time'}
                          </td>

                          {/* Status Badge */}
                          <td className="p-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              job.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                job.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-slate-400'
                              }`} />
                              {badge.label}
                            </span>
                          </td>

                          {/* Inline Actions */}
                          <td className="p-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <a
                                href={`/companies/${companySlug}/jobs/${job.job_slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-xs font-semibold no-underline hover:bg-slate-50 transition-colors"
                                title="View public job webpage"
                              >
                                <UilEye size={14} /> View
                              </a>

                              <button
                                onClick={() => handleOpenEditModal(job)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold cursor-pointer hover:bg-blue-100 transition-colors"
                                title="Edit job details"
                              >
                                <UilPen size={14} /> Edit
                              </button>

                              <button
                                onClick={() => setDeleteConfirmTarget({ type: 'single', id: job._id })}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-red-300 bg-red-50 text-red-700 text-xs font-semibold cursor-pointer hover:bg-red-100 transition-colors"
                                title="Delete job posting"
                              >
                                <UilTrashAlt size={14} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Jobs Cards Container */}
              <div className="md:hidden flex flex-col gap-3 p-3">
                {jobs.map((job) => {
                  const isSelected = selectedIds.includes(job._id);
                  const badge = STATUS_BADGES[job.status] || STATUS_BADGES.DRAFT;

                  return (
                    <div
                      key={job._id}
                      className={`border rounded-xl p-4 flex flex-col gap-3 shadow-sm ${
                        isSelected ? 'bg-blue-50/60 border-blue-300' : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(job._id)}
                            className="cursor-pointer mt-1"
                          />
                          <div>
                            <h3
                              onClick={() => handleOpenEditModal(job)}
                              className="text-base font-bold m-0 text-slate-900 cursor-pointer hover:text-blue-600"
                            >
                              {job.title}
                            </h3>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {job.department || 'Engineering'} • {job.work_policy || 'Remote'}
                            </div>
                          </div>
                        </div>

                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${
                          job.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {badge.label}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex gap-3 text-xs text-slate-600 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <UilMapPin size={14} /> {job.location || 'Remote'}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <UilBriefcase size={14} /> {job.employment_type || 'Full time'}
                        </span>
                      </div>

                      {/* Card Actions Row */}
                      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                        <a
                          href={`/companies/${companySlug}/jobs/${job.job_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-xs font-semibold no-underline"
                        >
                          <UilEye size={14} /> View
                        </a>

                        <button
                          onClick={() => handleOpenEditModal(job)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold cursor-pointer"
                        >
                          <UilPen size={14} /> Edit
                        </button>

                        <button
                          onClick={() => setDeleteConfirmTarget({ type: 'single', id: job._id })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-red-300 bg-red-50 text-red-700 text-xs font-semibold cursor-pointer"
                        >
                          <UilTrashAlt size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination Footer */}
          {!loading && jobs.length > 0 && (
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span>
                  Showing <b>{(page - 1) * limit + 1}</b> to <b>{Math.min(page * limit, totalJobs)}</b> of <b>{totalJobs}</b> positions
                </span>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="px-2 py-1 rounded-md border border-slate-300 text-xs bg-white"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 font-semibold cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                <span className="font-semibold text-slate-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 font-semibold cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Existing Job Creation / Editing Modal */}
      <JobEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        companySlug={companySlug}
        token={token}
        jobToEdit={jobToEdit}
        onSaved={() => {
          showToast(jobToEdit ? 'Job updated successfully' : 'New job created successfully');
          fetchJobs();
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold m-0 mb-2 text-slate-900">
              Confirm Deletion
            </h3>
            <p className="text-sm text-slate-500 m-0 mb-6 leading-relaxed">
              {deleteConfirmTarget.type === 'bulk'
                ? `Are you sure you want to permanently delete ${selectedIds.length} selected job posting(s)? This action cannot be undone.`
                : 'Are you sure you want to permanently delete this job posting? This action cannot be undone.'}
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 font-semibold text-xs cursor-pointer hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmTarget.type === 'bulk') {
                    handleBulkDelete();
                  } else if (deleteConfirmTarget.id) {
                    handleDeleteSingle(deleteConfirmTarget.id);
                  }
                }}
                className="px-4 py-2 rounded-lg border-none bg-red-600 text-white font-semibold text-xs cursor-pointer hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const menuItemStyle = {
  width: '100%',
  padding: '8px 14px',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  fontSize: '13px',
  color: '#334155',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};
