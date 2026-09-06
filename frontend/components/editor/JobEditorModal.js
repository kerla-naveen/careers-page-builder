import React, { useState, useEffect } from 'react';
import { UilExclamationTriangle, UilRocket } from '@iconscout/react-unicons';

const WORK_POLICY_OPTIONS = ['Hybrid', 'Remote', 'On-site'];
const EMPLOYMENT_TYPE_OPTIONS = ['Full time', 'Part time', 'Contract', 'Internship'];
const EXPERIENCE_LEVEL_OPTIONS = ['Entry Level', 'Mid Level', 'Senior', 'Lead / Executive'];
const JOB_TYPE_OPTIONS = ['Permanent', 'Temporary', 'Contract'];
const DEPARTMENT_OPTIONS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Customer Support', 'Operations', 'HR / People', 'Finance'];

export default function JobEditorModal({ isOpen, onClose, companySlug, token, jobToEdit, onSaved }) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Bangalore, India');
  const [workPolicy, setWorkPolicy] = useState('Hybrid');
  const [employmentType, setEmploymentType] = useState('Full time');
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [jobType, setJobType] = useState('Permanent');
  const [salaryRange, setSalaryRange] = useState('USD 80K–120K / year');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title || '');
      setDepartment(jobToEdit.department || 'Engineering');
      setLocation(jobToEdit.location || '');
      setWorkPolicy(jobToEdit.work_policy || 'Hybrid');
      setEmploymentType(jobToEdit.employment_type || 'Full time');
      setExperienceLevel(jobToEdit.experience_level || 'Senior');
      setJobType(jobToEdit.job_type || 'Permanent');
      setSalaryRange(jobToEdit.salary_range || '');
      setDescription(jobToEdit.description || '');
    } else {
      // Reset defaults for new job
      setTitle('');
      setDepartment('Engineering');
      setLocation('Bangalore, India');
      setWorkPolicy('Hybrid');
      setEmploymentType('Full time');
      setExperienceLevel('Senior');
      setJobType('Permanent');
      setSalaryRange('USD 80K–120K / year');
      setDescription(
        `### About the Role\nWe are seeking an experienced and passionate professional to join our team.\n\n### Key Responsibilities\n- Design and deliver scalable solutions.\n- Collaborate across cross-functional engineering and product teams.\n- Drive best technical practices and continuous improvement.`
      );
    }
    setError('');
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInsertFormat = (prefix, suffix = '') => {
    setDescription((prev) => `${prev}\n${prefix} ${suffix}`);
  };

  const handleSave = async (targetStatus) => {
    if (!companySlug) {
      setError('Company context missing. Please refresh or re-login.');
      return;
    }
    if (!title.trim()) {
      setError('Job Title is required');
      return;
    }
    if (!location.trim()) {
      setError('Location is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      title: title.trim(),
      department,
      location: location.trim(),
      work_policy: workPolicy,
      employment_type: employmentType,
      experience_level: experienceLevel,
      job_type: jobType,
      salary_range: salaryRange.trim(),
      description: description.trim(),
      status: targetStatus,
    };

    try {
      const url = jobToEdit
        ? `http://127.0.0.1:5000/api/companies/${companySlug}/jobs/${jobToEdit._id}`
        : `http://127.0.0.1:5000/api/companies/${companySlug}/jobs`;

      const method = jobToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onSaved && onSaved(data.data);
        onClose();
      } else {
        setError(data.error || 'Failed to save job posting');
      }
    } catch (err) {
      setError('Network error while saving job posting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold m-0 text-slate-900">
              {jobToEdit ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              Configure role details, categorical metadata, and rich description.
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-xl text-slate-500 hover:text-slate-800 cursor-pointer p-1 rounded-md transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-lg text-xs mb-5 flex items-center gap-2">
              <UilExclamationTriangle size={16} /> {error}
            </div>
          )}

          {/* Job Title & Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* Department & Salary Range Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
              >
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                placeholder="e.g. USD 80K–120K / year"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* Categorical Selects Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Workplace
              </label>
              <select
                value={workPolicy}
                onChange={(e) => setWorkPolicy(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
              >
                {WORK_POLICY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
              >
                {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
              >
                {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
              >
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Description & Formatting Toolbar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600">
                Rich Job Description
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleInsertFormat('### Header Title')}
                  className="text-[11px] px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  H3 Heading
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertFormat('- Bullet Point')}
                  className="text-[11px] px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  • List Item
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertFormat('**Bold text**')}
                  className="text-[11px] px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 hover:bg-slate-200 cursor-pointer font-bold"
                >
                  B
                </button>
              </div>
            </div>
            <textarea
              rows={8}
              placeholder="Provide a detailed description of the role, responsibilities, and qualifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors resize-y min-h-[140px]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 font-medium text-xs hover:bg-slate-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('DRAFT')}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('PUBLISHED')}
              className="px-5 py-2 rounded-lg border-none bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 transition-all"
            >
              {isSubmitting ? 'Publishing...' : <><UilRocket size={14} /> Publish Live</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
