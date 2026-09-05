import React, { useState, useEffect } from 'react';
import styles from './Editor.module.css';

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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1.5rem',
    }} onClick={onClose}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '720px',
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
              {jobToEdit ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Configure role details, categorical metadata, and rich description.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.25rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '1.25rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Job Title & Location Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Job Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={styles.inputField}
              />
            </div>
          </div>

          {/* Department & Salary Range Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={styles.selectField}
              >
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Salary Range
              </label>
              <input
                type="text"
                placeholder="e.g. USD 80K–120K / year"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className={styles.inputField}
              />
            </div>
          </div>

          {/* Categorical Selects Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                Workplace
              </label>
              <select
                value={workPolicy}
                onChange={(e) => setWorkPolicy(e.target.value)}
                className={styles.selectField}
                style={{ fontSize: '12px', padding: '6px 8px' }}
              >
                {WORK_POLICY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className={styles.selectField}
                style={{ fontSize: '12px', padding: '6px 8px' }}
              >
                {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className={styles.selectField}
                style={{ fontSize: '12px', padding: '6px 8px' }}
              >
                {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className={styles.selectField}
                style={{ fontSize: '12px', padding: '6px 8px' }}
              >
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Description & Formatting Toolbar */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Rich Job Description
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => handleInsertFormat('### Header Title')}
                  style={{ fontSize: '11px', padding: '2px 6px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                >
                  H3 Heading
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertFormat('- Bullet Point')}
                  style={{ fontSize: '11px', padding: '2px 6px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                >
                  • List Item
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertFormat('**Bold text**')}
                  style={{ fontSize: '11px', padding: '2px 6px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
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
              className={styles.textareaField}
              style={{ minHeight: '140px' }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 500,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('DRAFT')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#f1f5f9',
                color: '#334155',
                fontWeight: 600,
                fontSize: '13px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('PUBLISHED')}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
              }}
            >
              {isSubmitting ? 'Publishing...' : '🚀 Publish Live'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
