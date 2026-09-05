import React, { useState, useEffect, useCallback } from 'react';
import styles from './Editor.module.css';
import JobEditorModal from './JobEditorModal';

export default function JobManagerModal({ isOpen, onClose, companySlug, token }) {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [editingJob, setEditingJob] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const fetchRecruiterJobs = useCallback(async () => {
    if (!companySlug || !token) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}/jobs/recruiter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.data || []);
      } else {
        setError(data.error || 'Failed to load jobs');
      }
    } catch (err) {
      setError('Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  }, [companySlug, token]);

  useEffect(() => {
    if (isOpen) {
      fetchRecruiterJobs();
    }
  }, [isOpen, fetchRecruiterJobs]);

  if (!isOpen) return null;

  const handleOpenCreate = () => {
    setEditingJob(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setIsEditorOpen(true);
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
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
        fetchRecruiterJobs();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error updating job status');
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        fetchRecruiterJobs();
      } else {
        alert(data.error || 'Failed to delete job');
      }
    } catch (err) {
      alert('Network error deleting job');
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      (j.department && j.department.toLowerCase().includes(q)) ||
      (j.location && j.location.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1.5rem',
      }} onClick={onClose}>
        <div style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }} onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                💼 Company Jobs Management
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Create, edit, publish, or unpublish your company's job openings.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleOpenCreate}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(99, 102, 241, 0.25)',
                }}
              >
                + Create Job
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.25rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ padding: '1rem 1.5rem 0.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <input
              type="text"
              placeholder="Search jobs by title, department, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.inputField}
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>

          {/* Content */}
          <div style={{ padding: '1rem 1.5rem', overflowY: 'auto', flex: 1 }}>
            {isLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                <div className={styles.loadingSpinner} style={{ margin: '0 auto 12px' }} />
                <p>Loading company jobs...</p>
              </div>
            ) : error ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                <p>⚠️ {error}</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '8px', opacity: 0.5 }}>💼</p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', margin: '0 0 4px 0' }}>
                  No Jobs Found
                </h3>
                <p style={{ fontSize: '0.85rem', margin: '0 0 16px 0' }}>
                  {search ? 'No jobs match your search query.' : 'You haven\'t created any job postings yet.'}
                </p>
                <button
                  onClick={handleOpenCreate}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#6366f1',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Create First Job →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredJobs.map((job) => {
                  const isPublished = job.status === 'PUBLISHED';
                  const isDraft = job.status === 'DRAFT';

                  return (
                    <div
                      key={job._id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                            {job.title}
                          </h3>

                          {/* Status Badge */}
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            background: isPublished
                              ? '#dcfce7'
                              : isDraft
                              ? '#fef3c7'
                              : '#f1f5f9',
                            color: isPublished
                              ? '#15803d'
                              : isDraft
                              ? '#b45309'
                              : '#64748b',
                            border: `1px solid ${
                              isPublished
                                ? '#bbf7d0'
                                : isDraft
                                ? '#fde68a'
                                : '#e2e8f0'
                            }`,
                          }}>
                            {job.status || 'DRAFT'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748b' }}>
                          <span>📍 {job.location || 'Remote'}</span>
                          <span>🏢 {job.work_policy || 'Hybrid'}</span>
                          <span>📂 {job.department || 'General'}</span>
                          <span>🎯 {job.experience_level || 'Mid Level'}</span>
                          {job.salary_range && <span>💰 {job.salary_range}</span>}
                          {isPublished && (
                            <span style={{ color: '#059669', fontWeight: 500 }}>
                              📅 {job.posted_days_ago === 0 ? 'Posted Today' : `Posted ${job.posted_days_ago}d ago`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <a
                          href={`/companies/${companySlug}/jobs/${job.job_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View public job web page"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            color: '#334155',
                            fontSize: '12px',
                            fontWeight: 500,
                            textDecoration: 'none',
                          }}
                        >
                          View ↗
                        </a>

                        <button
                          onClick={() => handleOpenEdit(job)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleToggleStatus(job._id, job.status)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: isPublished ? '#fef3c7' : '#dcfce7',
                            color: isPublished ? '#92400e' : '#166534',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isPublished ? 'Unpublish' : 'Publish'}
                        </button>

                        <button
                          onClick={() => handleDeleteJob(job._id, job.title)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #fca5a5',
                            background: '#fef2f2',
                            color: '#b91c1c',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                          title="Delete job posting"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Job Editor Modal */}
      <JobEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        companySlug={companySlug}
        token={token}
        jobToEdit={editingJob}
        onSaved={fetchRecruiterJobs}
      />
    </>
  );
}
