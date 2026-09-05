import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from './JobsSection.module.css';

export default function JobsSection({ title, subtitle, jobs: initialJobs = [], companySlug }) {
  const router = useRouter();
  const sectionRef = useRef(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Data & Facets States
  const [jobs, setJobs] = useState(initialJobs);
  const [facets, setFacets] = useState({
    department: [],
    work_policy: [],
    employment_type: [],
    location: [],
    experience_level: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // IntersectionObserver reveal
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

  // Read initial query params from URL if available
  useEffect(() => {
    if (!router.isReady) return;

    const { search, department, work_policy, employment_type, experience_level, location } = router.query;

    if (search) setSearchTerm(search);
    if (department) setSelectedDepts(department.split(','));
    if (work_policy) setSelectedPolicies(work_policy.split(','));
    if (employment_type) setSelectedTypes(employment_type.split(','));
    if (experience_level) setSelectedLevels(experience_level.split(','));
    if (location) setSelectedLocations(location.split(','));

    setIsInitialRender(false);
  }, [router.isReady]);

  // Fetch jobs from backend filtered GET API route
  const fetchFilteredJobs = useCallback(async () => {
    if (!companySlug) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedDepts.length > 0) params.append('department', selectedDepts.join(','));
      if (selectedPolicies.length > 0) params.append('work_policy', selectedPolicies.join(','));
      if (selectedTypes.length > 0) params.append('employment_type', selectedTypes.join(','));
      if (selectedLevels.length > 0) params.append('experience_level', selectedLevels.join(','));
      if (selectedLocations.length > 0) params.append('location', selectedLocations.join(','));

      const url = `http://127.0.0.1:5000/api/companies/${companySlug}/jobs?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setJobs(data.data || []);
        if (data.facets) {
          setFacets(data.facets);
        }
      }

      // Update URL query string silently without reloading page
      const queryString = params.toString();
      const newPath = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;

      window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath);
    } catch (err) {
      console.error('Error fetching filtered jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    companySlug,
    searchTerm,
    selectedDepts,
    selectedPolicies,
    selectedTypes,
    selectedLevels,
    selectedLocations,
  ]);

  // Trigger fetch with 300ms debounce on search or filter change
  useEffect(() => {
    if (isInitialRender) return;

    const timer = setTimeout(() => {
      fetchFilteredJobs();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchFilteredJobs, isInitialRender]);

  // Toggle multi-select helper
  const toggleFilter = (item, currentList, setter) => {
    if (currentList.includes(item)) {
      setter(currentList.filter((i) => i !== item));
    } else {
      setter([...currentList, item]);
    }
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedDepts([]);
    setSelectedPolicies([]);
    setSelectedTypes([]);
    setSelectedLevels([]);
    setSelectedLocations([]);
  };

  const [activeJobModal, setActiveJobModal] = useState(null);

  const totalActiveFilters =
    (searchTerm ? 1 : 0) +
    selectedDepts.length +
    selectedPolicies.length +
    selectedTypes.length +
    selectedLevels.length +
    selectedLocations.length;

  return (
    <section ref={sectionRef} id="jobs-section" className={styles.jobsSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.subtitle}>{subtitle || 'Join Our Mission'}</span>
          <h2 className={styles.title}>
            {title || 'Open Opportunities'}{' '}
            <span className={styles.countBadge}>{jobs.length}</span>
          </h2>
          <div className={styles.titleAccent}></div>
        </div>

        {/* Search & Main Filter Controls */}
        <div className={styles.controlsRow}>
          {/* Search Box */}
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by job title, department, or location..."
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

          {/* Department Chips */}
          {facets.department?.length > 1 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Department:</span>
              <div className={styles.chipsContainer}>
                {facets.department.map((dept) => {
                  const isActive = selectedDepts.includes(dept);
                  return (
                    <button
                      key={dept}
                      className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
                      onClick={() => toggleFilter(dept, selectedDepts, setSelectedDepts)}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Work Policy Chips */}
          {facets.work_policy?.length > 1 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Workplace:</span>
              <div className={styles.chipsContainer}>
                {facets.work_policy.map((policy) => {
                  const isActive = selectedPolicies.includes(policy);
                  return (
                    <button
                      key={policy}
                      className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
                      onClick={() => toggleFilter(policy, selectedPolicies, setSelectedPolicies)}
                    >
                      {policy}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Employment Type Chips */}
          {facets.employment_type?.length > 1 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Type:</span>
              <div className={styles.chipsContainer}>
                {facets.employment_type.map((type) => {
                  const isActive = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
                      onClick={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Active Filter Badges Bar */}
        {totalActiveFilters > 0 && (
          <div className={styles.activeFiltersBar}>
            <span className={styles.activeLabel}>Active Filters ({totalActiveFilters}):</span>

            {searchTerm && (
              <span className={styles.filterBadge}>
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')}>✕</button>
              </span>
            )}

            {selectedDepts.map((d) => (
              <span key={d} className={styles.filterBadge}>
                {d}
                <button onClick={() => toggleFilter(d, selectedDepts, setSelectedDepts)}>✕</button>
              </span>
            ))}

            {selectedPolicies.map((p) => (
              <span key={p} className={styles.filterBadge}>
                {p}
                <button onClick={() => toggleFilter(p, selectedPolicies, setSelectedPolicies)}>✕</button>
              </span>
            ))}

            {selectedTypes.map((t) => (
              <span key={t} className={styles.filterBadge}>
                {t}
                <button onClick={() => toggleFilter(t, selectedTypes, setSelectedTypes)}>✕</button>
              </span>
            ))}

            <button className={styles.clearAllBtn} onClick={resetAllFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* Loading Spinner Overlay / Job Content */}
        <div className={styles.gridWrapper}>
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner}></div>
              <span>Updating roles from server...</span>
            </div>
          )}

          {jobs.length > 0 ? (
            <div className={`${styles.jobsGrid} ${isLoading ? styles.dimmed : ''}`}>
              {jobs.map((job, idx) => (
                <div
                  key={job._id || idx}
                  className={styles.jobCard}
                  style={{ transitionDelay: `${0.04 + idx * 0.03}s` }}
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
                      href={`/companies/${companySlug}/jobs/${job.job_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.applyBtn}
                    >
                      <span>View Role Details ↗</span>
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
              <div className={styles.emptyIcon}>🔎</div>
              <h3 className={styles.emptyTitle}>No open positions match your search</h3>
              <p className={styles.emptyText}>
                We couldn't find any jobs matching your current filter criteria. Try adjusting your search query or clear selected filters.
              </p>
              <button className={styles.resetBtn} onClick={resetAllFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Job Details Modal Overlay */}
        {activeJobModal && (
          <div className={styles.modalBackdrop} onClick={() => setActiveJobModal(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div>
                  <span className={styles.modalDeptBadge}>{activeJobModal.department}</span>
                  <h2 className={styles.modalTitle}>{activeJobModal.title}</h2>
                </div>
                <button
                  className={styles.closeModalBtn}
                  onClick={() => setActiveJobModal(null)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalMetaRow}>
                {activeJobModal.location && (
                  <span className={styles.modalMetaPill}>📍 {activeJobModal.location}</span>
                )}
                {activeJobModal.work_policy && (
                  <span className={styles.modalMetaPill}>🏢 {activeJobModal.work_policy}</span>
                )}
                {activeJobModal.employment_type && (
                  <span className={styles.modalMetaPill}>⏳ {activeJobModal.employment_type}</span>
                )}
                {activeJobModal.salary_range && (
                  <span className={`${styles.modalMetaPill} ${styles.modalSalaryPill}`}>
                    💰 {activeJobModal.salary_range}
                  </span>
                )}
              </div>

              <div className={styles.modalBody}>
                {activeJobModal.description && (
                  <div className={styles.modalSection}>
                    <h4 className={styles.modalSectionTitle}>Role Description</h4>
                    <p className={styles.modalText}>{activeJobModal.description}</p>
                  </div>
                )}

                {activeJobModal.requirements && activeJobModal.requirements.length > 0 && (
                  <div className={styles.modalSection}>
                    <h4 className={styles.modalSectionTitle}>Key Requirements & Qualifications</h4>
                    <ul className={styles.modalReqList}>
                      {(Array.isArray(activeJobModal.requirements)
                        ? activeJobModal.requirements
                        : activeJobModal.requirements.split('\n')
                      ).map((req, idx) => (
                        <li key={idx}>{req.trim().replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.closeModalFooterBtn}
                  onClick={() => setActiveJobModal(null)}
                >
                  Close
                </button>

                {activeJobModal.apply_url && (
                  <a
                    href={activeJobModal.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.externalApplyBtn}
                  >
                    Apply on ATS Portal ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
