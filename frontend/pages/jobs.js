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
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {toast.type === 'error' ? <UilExclamationTriangle size={18} /> : <UilCheckCircle size={18} />} {toast.message}
        </div>
      )}

      {/* Recruiter Navigation Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '18px', color: '#0f172a', letterSpacing: '-0.02em' }}>
            <span style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UilBriefcase size={18} />
            </span>
            {user?.company?.name || user?.companyName || 'Recruiter Portal'}
          </div>

          <div style={{ height: '24px', width: '1px', background: '#e2e8f0' }} />

          <nav style={{ display: 'flex', gap: '6px' }}>
            <Link href="/editor" style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#64748b',
              textDecoration: 'none',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <UilPalette size={16} /> Careers Page
            </Link>
            <Link href="/jobs" style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#2563eb',
              background: '#eff6ff',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <UilBriefcase size={16} /> Jobs
            </Link>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href={`/companies/${companySlug}/careers`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              textDecoration: 'none',
              padding: '6px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              background: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Live Site <UilExternalLinkAlt size={14} />
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'R'}
            </div>
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '2rem' }}>
        
        {/* Page Title & + Create Job */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Jobs
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Manage your company&apos;s open positions, track role statuses, and publish postings.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'transform 0.15s, boxShadow 0.15s',
            }}
          >
            <UilPlus size={18} /> Create Job
          </button>
        </div>

        {/* Status Count Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  background: isActive ? '#eff6ff' : '#ffffff',
                  color: isActive ? '#2563eb' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
                <span style={{
                  background: isActive ? '#bfdbfe' : '#f1f5f9',
                  color: isActive ? '#1e40af' : '#475569',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters & Search Toolbar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          marginBottom: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left Controls: Search & Select Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                <UilSearch size={16} />
              </span>
              <input
                type="text"
                placeholder="Search jobs by title, department, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1); }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
              }}
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
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">Location: All</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

          </div>

          {/* Right Control: Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 600,
              }}
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
          <div style={{
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '12px 20px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
            animation: 'fadeIn 0.2s ease-in-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600 }}>
              <span style={{ background: '#2563eb', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>
                {selectedIds.length} selected
              </span>
              <span>Bulk management actions:</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={bulkActionLoading}
                onClick={() => handleBulkStatusChange('PUBLISHED')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#16a34a',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <UilRocket size={14} /> Publish
              </button>

              <button
                disabled={bulkActionLoading}
                onClick={() => handleBulkStatusChange('CLOSED')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#d97706',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <UilPauseCircle size={14} /> Close
              </button>

              <button
                disabled={bulkActionLoading}
                onClick={() => handleBulkStatusChange('ARCHIVED')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#4b5563',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <UilArchive size={14} /> Archive
              </button>

              <button
                disabled={bulkActionLoading}
                onClick={() => setDeleteConfirmTarget({ type: 'bulk' })}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <UilTrashAlt size={14} /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Scalable Job Table */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '24px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                <UilSync size={24} className="animate-spin" />
              </div>
              Loading job postings...
            </div>
          ) : error ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <UilExclamationTriangle size={20} /> {error}
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem', color: '#94a3b8', display: 'flex', justifyContent: 'center' }}>
                <UilInbox size={48} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px 0', color: '#1e293b' }}>
                No jobs found
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem 0', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                {debouncedSearch || statusFilter !== 'ALL' || departmentFilter !== 'ALL'
                  ? 'No roles match your search filters. Try clearing filters to see all jobs.'
                  : "You haven't created any job postings yet. Get started by creating your first position!"}
              </p>
              {debouncedSearch || statusFilter !== 'ALL' || departmentFilter !== 'ALL' ? (
                <button
                  onClick={() => { setSearch(''); setStatusFilter('ALL'); setDepartmentFilter('ALL'); setLocationFilter('ALL'); }}
                  style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={handleOpenCreateModal}
                  style={{ padding: '10px 20px', background: '#2563eb', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                >
                  + Create Your First Job
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Responsive Styles for Jobs Page */}
              <style jsx>{`
                .jobs-table-container {
                  display: block;
                }
                .jobs-cards-container {
                  display: none;
                }
                @media (max-width: 767px) {
                  .jobs-table-container {
                    display: none;
                  }
                  .jobs-cards-container {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 12px;
                  }
                }
              `}</style>

              {/* Desktop / Tablet Table View (>= 768px) */}
              <div className="jobs-table-container" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                      <th style={{ padding: '12px 16px', width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => el && (el.indeterminate = isSomeSelected)}
                          onChange={handleSelectAll}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ padding: '12px 16px' }}>Job Title</th>
                      <th style={{ padding: '12px 16px' }}>Department</th>
                      <th style={{ padding: '12px 16px' }}>Location</th>
                      <th style={{ padding: '12px 16px' }}>Employment Type</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', minWidth: '220px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => {
                      const isSelected = selectedIds.includes(job._id);
                      const badge = STATUS_BADGES[job.status] || STATUS_BADGES.DRAFT;

                      return (
                        <tr
                          key={job._id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: isSelected ? '#eff6ff' : '#ffffff',
                            transition: 'background 0.15s',
                          }}
                        >
                          {/* Checkbox */}
                          <td style={{ padding: '14px 16px' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectOne(job._id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>

                          {/* Title & Clickable to Edit */}
                          <td style={{ padding: '14px 16px' }}>
                            <div
                              onClick={() => handleOpenEditModal(job)}
                              style={{
                                fontWeight: 700,
                                color: '#1e293b',
                                cursor: 'pointer',
                                display: 'inline-block',
                              }}
                            >
                              <span style={{ transition: 'color 0.15s' }}>{job.title}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                              {job.work_policy || 'Remote'} • Slug: /{job.job_slug}
                            </div>
                          </td>

                          {/* Department */}
                          <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 500 }}>
                            {job.department || 'Engineering'}
                          </td>

                          {/* Location */}
                          <td style={{ padding: '14px 16px', color: '#475569' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <UilMapPin size={14} /> {job.location || 'Remote'}
                            </span>
                          </td>

                          {/* Employment Type */}
                          <td style={{ padding: '14px 16px', color: '#475569' }}>
                            {job.employment_type || 'Full time'}
                          </td>

                          {/* Status Badge */}
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: badge.bg,
                              color: badge.text,
                              border: `1px solid ${badge.border}`,
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.dot }} />
                              {badge.label}
                            </span>
                          </td>

                          {/* Inline Actions (Side-by-Side: View, Edit, Delete) */}
                          <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                              <a
                                href={`/companies/${companySlug}/jobs/${job.job_slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#334155',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  transition: 'all 0.15s',
                                }}
                                title="View public job webpage"
                              >
                                <UilEye size={14} /> View
                              </a>

                              <button
                                onClick={() => handleOpenEditModal(job)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #93c5fd',
                                  background: '#eff6ff',
                                  color: '#1d4ed8',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
                                title="Edit job details"
                              >
                                <UilPen size={14} /> Edit
                              </button>

                              <button
                                onClick={() => setDeleteConfirmTarget({ type: 'single', id: job._id })}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #fca5a5',
                                  background: '#fef2f2',
                                  color: '#b91c1c',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
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

              {/* Mobile Jobs Cards Container (< 768px) */}
              <div className="jobs-cards-container">
                {jobs.map((job) => {
                  const isSelected = selectedIds.includes(job._id);
                  const badge = STATUS_BADGES[job.status] || STATUS_BADGES.DRAFT;

                  return (
                    <div
                      key={job._id}
                      style={{
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      {/* Top Row: Checkbox, Title & Status */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(job._id)}
                            style={{ cursor: 'pointer', marginTop: '3px' }}
                          />
                          <div>
                            <h3
                              onClick={() => handleOpenEditModal(job)}
                              style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                margin: 0,
                                color: '#0f172a',
                                cursor: 'pointer',
                              }}
                            >
                              {job.title}
                            </h3>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {job.department || 'Engineering'} • {job.work_policy || 'Remote'}
                            </div>
                          </div>
                        </div>

                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                          flexShrink: 0,
                        }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: badge.dot }} />
                          {badge.label}
                        </span>
                      </div>

                      {/* Location & Employment Details */}
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#475569', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <UilMapPin size={14} /> {job.location || 'Remote'}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <UilBriefcase size={14} /> {job.employment_type || 'Full time'}
                        </span>
                      </div>

                      {/* Card Actions Row (Side-by-Side: View, Edit, Delete) */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '6px',
                        paddingTop: '8px',
                        borderTop: '1px solid #f1f5f9',
                      }}>
                        <a
                          href={`/companies/${companySlug}/jobs/${job.job_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            fontSize: '12px',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          <UilEye size={14} /> View
                        </a>

                        <button
                          onClick={() => handleOpenEditModal(job)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #93c5fd',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <UilPen size={14} /> Edit
                        </button>

                        <button
                          onClick={() => setDeleteConfirmTarget({ type: 'single', id: job._id })}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #fca5a5',
                            background: '#fef2f2',
                            color: '#b91c1c',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
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
            <div style={{
              padding: '12px 20px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '13px',
              color: '#64748b',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>
                  Showing <b>{(page - 1) * limit + 1}</b> to <b>{Math.min(page * limit, totalJobs)}</b> of <b>{totalJobs}</b> positions
                </span>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: page <= 1 ? '#f1f5f9' : '#ffffff',
                    color: page <= 1 ? '#94a3b8' : '#334155',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  ← Previous
                </button>

                <span style={{ fontWeight: 600, color: '#334155' }}>
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: page >= totalPages ? '#f1f5f9' : '#ffffff',
                    color: page >= totalPages ? '#94a3b8' : '#334155',
                    cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Existing Job Creation / Editing Modal (Preserved experience!) */}
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
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            maxWidth: '420px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px 0', color: '#0f172a' }}>
              Confirm Deletion
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
              {deleteConfirmTarget.type === 'bulk'
                ? `Are you sure you want to permanently delete ${selectedIds.length} selected job posting(s)? This action cannot be undone.`
                : 'Are you sure you want to permanently delete this job posting? This action cannot be undone.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
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
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
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
