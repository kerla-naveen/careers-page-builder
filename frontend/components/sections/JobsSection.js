import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { API_BASE } from '../../utils/apiConfig';

export default function JobsSection({ title, subtitle, jobs: initialJobs = [], companySlug }) {
  const router = useRouter();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
          setIsVisible(true);
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

      const url = `${API_BASE}/companies/${companySlug}/jobs?${params.toString()}`;
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
    <section ref={sectionRef} id="jobs-section" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--brand-bg,#0b0f19)] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-600 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <span className="inline-block font-inter text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--brand-accent,#38bdf8)] mb-2">
            {subtitle || 'Join Our Mission'}
          </span>
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-text,#f8fafc)] m-0 leading-tight flex items-center justify-center gap-3">
            {title || 'Open Opportunities'}{' '}
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_20%,transparent)] text-[var(--brand-accent,#38bdf8)] border border-[color-mix(in_srgb,var(--brand-primary,#6366f1)_40%,transparent)]">
              {jobs.length}
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[var(--brand-primary,#6366f1)] to-[var(--brand-accent,#38bdf8)] rounded-full mx-auto mt-4"></div>
        </div>

        {/* Search & Main Filter Controls */}
        <div
          className={`flex flex-col gap-5 mb-8 transition-all duration-600 ease-out delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {/* Search Box */}
          <div className="relative w-full max-w-[680px] mx-auto">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_50%,transparent)] pointer-events-none"
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
              className="w-full py-3.5 pr-11 pl-12 bg-[color-mix(in_srgb,var(--brand-text,#f8fafc)_6%,transparent)] backdrop-blur-md border border-[color-mix(in_srgb,var(--brand-text,#f8fafc)_15%,transparent)] rounded-2xl font-inter text-base text-[var(--brand-text,#f8fafc)] outline-none transition-all focus:border-[var(--brand-primary,#6366f1)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand-primary,#6366f1)_15%,transparent)] placeholder:text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_50%,transparent)] shadow-sm"
              placeholder="Search by job title, department, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-transparent border-0 text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_60%,transparent)] hover:text-[var(--brand-text,#f8fafc)] cursor-pointer text-base p-1"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Department Chips */}
          {facets.department?.length > 1 && (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="font-inter text-xs font-bold uppercase tracking-wider text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_70%,transparent)]">Department:</span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {facets.department.map((dept) => {
                  const isActive = selectedDepts.includes(dept);
                  return (
                    <button
                      key={dept}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold font-inter cursor-pointer transition-all border ${
                        isActive
                          ? 'bg-[var(--brand-primary,#6366f1)] text-white border-[var(--brand-primary,#6366f1)] shadow-md'
                          : 'bg-[color-mix(in_srgb,var(--brand-text,#f8fafc)_6%,transparent)] border-[color-mix(in_srgb,var(--brand-text,#f8fafc)_15%,transparent)] text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_80%,transparent)] hover:bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_15%,transparent)] hover:text-[var(--brand-primary,#6366f1)] hover:border-[var(--brand-primary,#6366f1)]'
                      }`}
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
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="font-inter text-xs font-bold uppercase tracking-wider text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_70%,transparent)]">Workplace:</span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {facets.work_policy.map((policy) => {
                  const isActive = selectedPolicies.includes(policy);
                  return (
                    <button
                      key={policy}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold font-inter cursor-pointer transition-all border ${
                        isActive
                          ? 'bg-[var(--brand-primary,#6366f1)] text-white border-[var(--brand-primary,#6366f1)] shadow-md'
                          : 'bg-[color-mix(in_srgb,var(--brand-text,#f8fafc)_6%,transparent)] border-[color-mix(in_srgb,var(--brand-text,#f8fafc)_15%,transparent)] text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_80%,transparent)] hover:bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_15%,transparent)] hover:text-[var(--brand-primary,#6366f1)] hover:border-[var(--brand-primary,#6366f1)]'
                      }`}
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
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="font-inter text-xs font-bold uppercase tracking-wider text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_70%,transparent)]">Type:</span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {facets.employment_type.map((type) => {
                  const isActive = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold font-inter cursor-pointer transition-all border ${
                        isActive
                          ? 'bg-[var(--brand-primary,#6366f1)] text-white border-[var(--brand-primary,#6366f1)] shadow-md'
                          : 'bg-[color-mix(in_srgb,var(--brand-text,#f8fafc)_6%,transparent)] border-[color-mix(in_srgb,var(--brand-text,#f8fafc)_15%,transparent)] text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_80%,transparent)] hover:bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_15%,transparent)] hover:text-[var(--brand-primary,#6366f1)] hover:border-[var(--brand-primary,#6366f1)]'
                      }`}
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
          <div className="flex items-center justify-center gap-2 flex-wrap p-4 bg-[color-mix(in_srgb,var(--brand-text,#f8fafc)_5%,transparent)] backdrop-blur-md border border-[color-mix(in_srgb,var(--brand-text,#f8fafc)_12%,transparent)] rounded-xl mb-8">
            <span className="text-xs font-semibold text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_80%,transparent)]">Active Filters ({totalActiveFilters}):</span>

            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_15%,transparent)] border border-[color-mix(in_srgb,var(--brand-primary,#6366f1)_35%,transparent)] text-[var(--brand-primary,#6366f1)] text-xs font-medium">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="bg-transparent border-0 text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_60%,transparent)] hover:text-[var(--brand-text,#f8fafc)] cursor-pointer ml-1">✕</button>
              </span>
            )}

            {selectedDepts.map((d) => (
              <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_15%,transparent)] border border-[color-mix(in_srgb,var(--brand-primary,#6366f1)_35%,transparent)] text-[var(--brand-primary,#6366f1)] text-xs font-medium">
                {d}
                <button onClick={() => toggleFilter(d, selectedDepts, setSelectedDepts)} className="bg-transparent border-0 text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_60%,transparent)] hover:text-[var(--brand-text,#f8fafc)] cursor-pointer ml-1">✕</button>
              </span>
            ))}

            {selectedPolicies.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_15%,transparent)] border border-[color-mix(in_srgb,var(--brand-primary,#6366f1)_35%,transparent)] text-[var(--brand-primary,#6366f1)] text-xs font-medium">
                {p}
                <button onClick={() => toggleFilter(p, selectedPolicies, setSelectedPolicies)} className="bg-transparent border-0 text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_60%,transparent)] hover:text-[var(--brand-text,#f8fafc)] cursor-pointer ml-1">✕</button>
              </span>
            ))}

            {selectedTypes.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_15%,transparent)] border border-[color-mix(in_srgb,var(--brand-primary,#6366f1)_35%,transparent)] text-[var(--brand-primary,#6366f1)] text-xs font-medium">
                {t}
                <button onClick={() => toggleFilter(t, selectedTypes, setSelectedTypes)} className="bg-transparent border-0 text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_60%,transparent)] hover:text-[var(--brand-text,#f8fafc)] cursor-pointer ml-1">✕</button>
              </span>
            ))}

            <button className="text-xs font-semibold text-rose-500 hover:text-rose-600 ml-2 bg-transparent border-0 cursor-pointer" onClick={resetAllFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* Loading Spinner Overlay / Job Content */}
        <div className="relative min-h-[300px]">
          {isLoading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-3 rounded-2xl">
              <div className="w-8 h-8 border-[3px] border-[var(--brand-primary,#6366f1)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-[var(--brand-text,#f8fafc)] font-inter">Updating roles from server...</span>
            </div>
          )}

          {jobs.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              {jobs.map((job, idx) => (
                <div
                  key={job._id || idx}
                  className="group bg-[color-mix(in_srgb,var(--brand-text,#f8fafc)_5%,transparent)] backdrop-blur-md border border-[color-mix(in_srgb,var(--brand-text,#f8fafc)_12%,transparent)] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary,#6366f1)] hover:shadow-xl"
                  style={{ transitionDelay: `${0.04 + idx * 0.03}s` }}
                >
                  <div>
                    <div className="flex justify-between items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_15%,transparent)] text-[var(--brand-primary,#6366f1)] border border-[color-mix(in_srgb,var(--brand-primary,#6366f1)_30%,transparent)]">{job.department}</span>
                      {job.posted_days_ago !== undefined && (
                        <span className="text-xs font-medium text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_65%,transparent)] font-inter">
                          {job.posted_days_ago === 0 ? 'Just added' : `${job.posted_days_ago}d ago`}
                        </span>
                      )}
                    </div>

                    <h3 className="font-outfit text-xl font-semibold text-[var(--brand-text,#f8fafc)] mb-4 leading-snug group-hover:text-[var(--brand-primary,#6366f1)] transition-colors">{job.title}</h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-xs text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_70%,transparent)] font-inter">
                      {job.location && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {job.location}
                        </span>
                      )}

                      {job.work_policy && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                          {job.work_policy}
                        </span>
                      )}

                      {job.employment_type && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {job.employment_type}
                        </span>
                      )}

                      {job.salary_range && (
                        <span className="flex items-center gap-1.5 text-[var(--brand-primary,#6366f1)] font-semibold">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                          {job.salary_range}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[color-mix(in_srgb,var(--brand-text,#f8fafc)_12%,transparent)] flex justify-end">
                    <a
                      href={`/companies/${companySlug}/jobs/${job.job_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary,#6366f1)] hover:text-[var(--brand-accent,#38bdf8)] transition-colors no-underline group/link font-inter"
                    >
                      <span>View Role Details ↗</span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
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
            <div className="text-center py-16 px-4 bg-[color-mix(in_srgb,var(--brand-text,#f8fafc)_4%,transparent)] border border-[color-mix(in_srgb,var(--brand-text,#f8fafc)_12%,transparent)] rounded-2xl max-w-[500px] mx-auto">
              <div className="text-4xl mb-4">🔎</div>
              <h3 className="font-outfit text-xl font-bold text-[var(--brand-text,#f8fafc)] mb-2">No open positions match your search</h3>
              <p className="font-inter text-sm text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_70%,transparent)] mb-6 leading-relaxed">
                We couldn't find any jobs matching your current filter criteria. Try adjusting your search query or clear selected filters.
              </p>
              <button className="px-6 py-2.5 bg-[var(--brand-primary,#6366f1)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-0 shadow-md" onClick={resetAllFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Job Details Modal Overlay */}
        {activeJobModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setActiveJobModal(null)}>
            <div className="bg-slate-900 border border-white/15 rounded-2xl max-w-[650px] w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 text-white shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-white/10">
                <div>
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">{activeJobModal.department}</span>
                  <h2 className="font-outfit text-2xl md:text-3xl font-bold text-white leading-tight">{activeJobModal.title}</h2>
                </div>
                <button
                  className="text-slate-400 hover:text-white text-xl bg-transparent border-0 cursor-pointer p-1"
                  onClick={() => setActiveJobModal(null)}
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {activeJobModal.location && (
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium text-slate-200 border border-white/10">📍 {activeJobModal.location}</span>
                )}
                {activeJobModal.work_policy && (
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium text-slate-200 border border-white/10">🏢 {activeJobModal.work_policy}</span>
                )}
                {activeJobModal.employment_type && (
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium text-slate-200 border border-white/10">⏳ {activeJobModal.employment_type}</span>
                )}
                {activeJobModal.salary_range && (
                  <span className="px-3 py-1 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                    💰 {activeJobModal.salary_range}
                  </span>
                )}
              </div>

              <div className="space-y-6 mb-8">
                {activeJobModal.description && (
                  <div>
                    <h4 className="font-outfit text-lg font-semibold text-white mb-2">Role Description</h4>
                    <p className="font-inter text-sm text-slate-300 leading-relaxed">{activeJobModal.description}</p>
                  </div>
                )}

                {activeJobModal.requirements && activeJobModal.requirements.length > 0 && (
                  <div>
                    <h4 className="font-outfit text-lg font-semibold text-white mb-2">Key Requirements & Qualifications</h4>
                    <ul className="list-disc list-inside space-y-1.5 font-inter text-sm text-slate-300">
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

              <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/10">
                <button
                  className="px-5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors border-0 cursor-pointer"
                  onClick={() => setActiveJobModal(null)}
                >
                  Close
                </button>

                {activeJobModal.apply_url && (
                  <a
                    href={activeJobModal.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors no-underline"
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

