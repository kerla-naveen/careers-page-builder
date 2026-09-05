import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from './JobsSection.module.css';

export default function JobsSection({ title, subtitle, jobs = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedPolicy, setSelectedPolicy] = useState('All');
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Extract unique departments & work policies
  const departments = useMemo(() => {
    if (!jobs.length) return ['All'];
    const set = new Set(jobs.map((j) => j.department).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [jobs]);

  const workPolicies = useMemo(() => {
    if (!jobs.length) return ['All'];
    const set = new Set(jobs.map((j) => j.work_policy).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [jobs]);

  // Filter jobs based on search term, department, and work policy
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === 'All' || job.department === selectedDept;
      const matchesPolicy = selectedPolicy === 'All' || job.work_policy === selectedPolicy;

      return matchesSearch && matchesDept && matchesPolicy;
    });
  }, [jobs, searchTerm, selectedDept, selectedPolicy]);

  if (!jobs || jobs.length === 0) return null;

  return (
    <section ref={sectionRef} id="jobs-section" className={styles.jobsSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.subtitle}>{subtitle || 'Join Our Mission'}</span>
          <h2 className={styles.title}>
            {title || 'Open Opportunities'}{' '}
            <span className={styles.countBadge}>{filteredJobs.length}</span>
          </h2>
          <div className={styles.titleAccent}></div>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className={styles.controlsRow}>
          {/* Search Input */}
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search roles, locations, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className={styles.clearSearchBtn}
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Department Filter Chips */}
          {departments.length > 2 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Dept:</span>
              <div className={styles.chipsContainer}>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    className={`${styles.chip} ${selectedDept === dept ? styles.chipActive : ''}`}
                    onClick={() => setSelectedDept(dept)}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Work Policy Filter Chips */}
          {workPolicies.length > 2 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Workplace:</span>
              <div className={styles.chipsContainer}>
                {workPolicies.map((policy) => (
                  <button
                    key={policy}
                    className={`${styles.chip} ${selectedPolicy === policy ? styles.chipActive : ''}`}
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    {policy}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className={styles.jobsGrid}>
            {filteredJobs.map((job, idx) => (
              <div
                key={job._id || idx}
                className={styles.jobCard}
                style={{ transitionDelay: `${0.05 + idx * 0.04}s` }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.deptBadge}>{job.department}</span>
                  {job.posted_days_ago !== undefined && (
                    <span className={styles.postedBadge}>
                      {job.posted_days_ago === 0 ? 'Just added' : `${job.posted_days_ago}d ago`}
                    </span>
                  )}
                </div>

                <h3 className={styles.jobTitle}>{job.title}</h3>

                <div className={styles.jobMeta}>
                  {job.location && (
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {job.location}
                    </span>
                  )}

                  {job.work_policy && (
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      {job.work_policy}
                    </span>
                  )}

                  {job.employment_type && (
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {job.employment_type}
                    </span>
                  )}

                  {job.salary_range && (
                    <span className={`${styles.metaItem} ${styles.salaryItem}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      {job.salary_range}
                    </span>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <a
                    href={`#apply-${job.job_slug || idx}`}
                    className={styles.applyBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Applying for role: ${job.title}`);
                    }}
                  >
                    <span>View Role</span>
                    <svg
                      className={styles.arrowIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>No matching positions found</h3>
            <p className={styles.emptyText}>
              Try adjusting your search criteria or clear your active filters.
            </p>
            <button
              className={styles.resetBtn}
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All');
                setSelectedPolicy('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
