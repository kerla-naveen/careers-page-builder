import React, { useState, useEffect, useCallback } from 'react';
import JobEditorModal from './JobEditorModal';
import { API_BASE } from '../../utils/apiConfig';

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
      const res = await fetch(`${API_BASE}/companies/${companySlug}/jobs/recruiter`, {
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
      const res = await fetch(`${API_BASE}/companies/${companySlug}/jobs/${jobId}/status`, {
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
      const res = await fetch(`${API_BASE}/companies/${companySlug}/jobs/${jobId}`, {
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
      <div
        className="fixed inset-0 bg-slate-900/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-xl font-bold m-0 text-slate-900">
                💼 Company Jobs Management
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Create, edit, publish, or unpublish your company's job openings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-lg border-none bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:from-indigo-600 hover:to-indigo-700 cursor-pointer transition-all"
              >
                + Create Job
              </button>
              <button
                onClick={onClose}
                className="bg-transparent border-none text-xl text-slate-500 hover:text-slate-800 cursor-pointer p-1 rounded-md transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-6 py-3 border-b border-slate-100 bg-white">
            <input
              type="text"
              placeholder="Search jobs by title, department, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">
                <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs">Loading company jobs...</p>
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500 text-sm">
                <p>⚠️ {error}</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <p className="text-4xl mb-2 opacity-50">💼</p>
                <h3 className="text-base font-semibold text-slate-700 m-0 mb-1">
                  No Jobs Found
                </h3>
                <p className="text-xs m-0 mb-4">
                  {search ? 'No jobs match your search query.' : 'You haven\'t created any job postings yet.'}
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="px-4 py-2 rounded-md border-none bg-indigo-600 text-white font-semibold text-xs cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  Create First Job →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {filteredJobs.map((job) => {
                  const isPublished = job.status === 'PUBLISHED';
                  const isDraft = job.status === 'DRAFT';

                  return (
                    <div
                      key={job._id}
                      className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white hover:border-slate-300 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold m-0 text-slate-900">
                            {job.title}
                          </h3>

                          {/* Status Badge */}
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                              isPublished
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : isDraft
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {job.status || 'DRAFT'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          <span>📍 {job.location || 'Remote'}</span>
                          <span>🏢 {job.work_policy || 'Hybrid'}</span>
                          <span>📂 {job.department || 'General'}</span>
                          <span>🎯 {job.experience_level || 'Mid Level'}</span>
                          {job.salary_range && <span>💰 {job.salary_range}</span>}
                          {isPublished && (
                            <span className="text-emerald-600 font-medium">
                              📅 {job.posted_days_ago === 0 ? 'Posted Today' : `Posted ${job.posted_days_ago}d ago`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`/companies/${companySlug}/jobs/${job.job_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View public job web page"
                          className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-slate-50 text-slate-700 text-xs font-medium no-underline hover:bg-slate-100 transition-colors"
                        >
                          View ↗
                        </a>

                        <button
                          onClick={() => handleOpenEdit(job)}
                          className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-900 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleToggleStatus(job._id, job.status)}
                          className={`px-3 py-1.5 rounded-md border-none text-xs font-semibold cursor-pointer transition-colors ${
                            isPublished
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          }`}
                        >
                          {isPublished ? 'Unpublish' : 'Publish'}
                        </button>

                        <button
                          onClick={() => handleDeleteJob(job._id, job.title)}
                          className="px-2.5 py-1.5 rounded-md border border-red-300 bg-red-50 text-red-700 text-xs cursor-pointer hover:bg-red-100 transition-colors"
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
