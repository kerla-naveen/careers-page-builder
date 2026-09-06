import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';


import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSection from '../../components/sections/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import CultureSection from '../../components/sections/CultureSection';
import PerksSection from '../../components/sections/PerksSection';
import JobsSection from '../../components/sections/JobsSection';
import { createNewSection } from '../../utils/sectionTemplates';

export default function RecruiterDashboard() {
  const router = useRouter();
  const { slug } = router.query;

  // Local Editable Company & Jobs State
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);

  // Dashboard UI States
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'info' | 'content' | 'jobs' | 'create'
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'edit' | 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Add Section State
  const [newSectionType, setNewSectionType] = useState('CULTURE');

  // Job Management Form State
  const [editingJob, setEditingJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    work_policy: 'Hybrid',
    employment_type: 'Full time',
    experience_level: 'Mid-level',
    job_type: 'Permanent',
    salary_range: '$100,000 - $130,000',
    description: '',
    requirements: '',
  });

  // Create Company Form State
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    primaryColor: '#2563eb',
    accentColor: '#3b82f6',
  });

  // Fetch all companies list for dropdown
  const loadAllCompanies = useCallback(async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/companies');
      const data = await res.json();
      if (data.success) {
        setCompaniesList(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching companies list:', err);
    }
  }, []);

  // Fetch specific company details by slug
  const loadCompanyData = useCallback(async (companySlug) => {
    if (!companySlug) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}`);
      const data = await res.json();
      if (data.success) {
        const normalizedSections = (data.data.sections || [])
          .slice()
          .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

        setCompany({
          ...data.data,
          fontFamily: data.data.fontFamily || 'Outfit',
          borderRadius: data.data.borderRadius || '16px',
          socialLinks: data.data.socialLinks || {
            linkedin: '',
            twitter: '',
            github: '',
            glassdoor: '',
            instagram: '',
          },
          sections: normalizedSections,
        });
      }

      const jobsRes = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}/jobs`);
      const jobsData = await jobsRes.json();
      if (jobsData.success) {
        setJobs(jobsData.data || []);
      }
    } catch (err) {
      console.error('Error loading company data:', err);
    }
  }, []);

  useEffect(() => {
    loadAllCompanies();
  }, [loadAllCompanies]);

  useEffect(() => {
    if (slug) {
      loadCompanyData(slug);
    }
  }, [slug, loadCompanyData]);

  const handleCompanyChange = (e) => {
    const newSlug = e.target.value;
    router.push(`/dashboard/${newSlug}`);
  };

  // Field update handlers
  const handleMetaChange = (field, value) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network, value) => {
    setCompany((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || {}),
        [network]: value,
      },
    }));
  };

  // Section Operations (Reorder, Toggle, Delete, Add)
  const moveSection = (index, direction) => {
    if (!company?.sections) return;
    const newSections = [...company.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((sec, idx) => {
      sec.orderIndex = idx;
    });

    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  const toggleVisibility = (index) => {
    if (!company?.sections) return;
    const newSections = [...company.sections];
    newSections[index].isVisible = !newSections[index].isVisible;
    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  const deleteSection = (index) => {
    if (!company?.sections) return;
    if (!confirm('Are you sure you want to delete this section?')) return;
    const newSections = company.sections.filter((_, idx) => idx !== index);
    newSections.forEach((sec, idx) => {
      sec.orderIndex = idx;
    });
    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  const handleAddSection = () => {
    if (!company?.sections) return;
    const newSec = createNewSection(newSectionType, company.sections.length);
    if (newSec) {
      setCompany((prev) => ({
        ...prev,
        sections: [...prev.sections, newSec],
      }));
      setToast(`➕ Added new ${newSectionType} section!`);
      setTimeout(() => setToast(''), 3000);
    }
  };

  // Section Text Updates
  const updateSectionField = (secIndex, field, value) => {
    const newSections = [...company.sections];
    newSections[secIndex][field] = value;
    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  const updateSectionContentField = (secIndex, contentField, value) => {
    const newSections = [...company.sections];
    newSections[secIndex].content = {
      ...(newSections[secIndex].content || {}),
      [contentField]: value,
    };
    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  // Deep Array Editors (Stats, Values, Perks)
  const updateArrayItem = (secIndex, arrayKey, itemIndex, field, value) => {
    const newSections = [...company.sections];
    const currentArray = [...(newSections[secIndex].content[arrayKey] || [])];
    currentArray[itemIndex] = {
      ...currentArray[itemIndex],
      [field]: value,
    };
    newSections[secIndex].content[arrayKey] = currentArray;
    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  const addArrayItem = (secIndex, arrayKey, newItem) => {
    const newSections = [...company.sections];
    const currentArray = [...(newSections[secIndex].content[arrayKey] || [])];
    currentArray.push(newItem);
    newSections[secIndex].content[arrayKey] = currentArray;
    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  const removeArrayItem = (secIndex, arrayKey, itemIndex) => {
    const newSections = [...company.sections];
    const currentArray = [...(newSections[secIndex].content[arrayKey] || [])];
    currentArray.splice(itemIndex, 1);
    newSections[secIndex].content[arrayKey] = currentArray;
    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  // Job CRUD Handlers
  const handleOpenCreateJob = () => {
    setEditingJob(null);
    setJobForm({
      title: '',
      department: 'Engineering',
      location: 'Remote',
      work_policy: 'Hybrid',
      employment_type: 'Full time',
      experience_level: 'Mid-level',
      job_type: 'Permanent',
      salary_range: '$110,000 - $140,000',
      description: `We are looking for a talented team member to join our growing company. In this role, you will collaborate with cross-functional teams to build high-impact products.`,
      requirements: `• 3+ years of relevant industry experience.\n• Strong technical or domain expertise.\n• Excellent teamwork and communication skills.`,
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (j) => {
    setEditingJob(j);
    setJobForm({
      title: j.title || '',
      department: j.department || 'Engineering',
      location: j.location || 'Remote',
      work_policy: j.work_policy || 'Hybrid',
      employment_type: j.employment_type || 'Full time',
      experience_level: j.experience_level || 'Mid-level',
      job_type: j.job_type || 'Permanent',
      salary_range: j.salary_range || 'Competitive',
      description: j.description || '',
      requirements: j.requirements || '',
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJobSubmit = async (e) => {
    e.preventDefault();
    if (!jobForm.title) return alert('Job Title is required.');

    try {
      if (editingJob) {
        // PUT update existing job
        const res = await fetch(`http://127.0.0.1:5000/api/companies/jobs/${editingJob._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobForm),
        });
        const data = await res.json();
        if (data.success) {
          setToast(`🎉 Updated job "${jobForm.title}"!`);
        } else alert(`Error: ${data.error}`);
      } else {
        // POST create new job
        const res = await fetch(`http://127.0.0.1:5000/api/companies/${slug}/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobForm),
        });
        const data = await res.json();
        if (data.success) {
          setToast(`🎉 Posted new job "${jobForm.title}"!`);
        } else alert(`Error: ${data.error}`);
      }

      setIsJobModalOpen(false);
      await loadCompanyData(slug);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to save job posting.');
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!confirm(`Are you sure you want to delete job "${jobTitle}"?`)) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/jobs/${jobId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setToast(`🗑️ Job "${jobTitle}" deleted.`);
        await loadCompanyData(slug);
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  // Save Company settings via PUT API
  const handleSave = async () => {
    if (!company || !slug) return;
    setIsSaving(true);
    setToast('');

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: company.name,
          primaryColor: company.primaryColor,
          accentColor: company.accentColor,
          backgroundColor: company.backgroundColor,
          textColor: company.textColor,
          fontFamily: company.fontFamily,
          borderRadius: company.borderRadius,
          description: company.description,
          website: company.website,
          videoUrl: company.videoUrl,
          bannerUrl: company.bannerUrl,
          logoUrl: company.logoUrl,
          socialLinks: company.socialLinks,
          sections: company.sections,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast('🎉 Company settings & deep section content saved to server!');
        setTimeout(() => setToast(''), 4000);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Create New SaaS Company
  const handleCreateCompanySubmit = async (e) => {
    e.preventDefault();
    if (!newCompanyForm.name || !newCompanyForm.slug) {
      alert('Company Name and Slug are required.');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompanyForm),
      });
      const data = await res.json();

      if (data.success) {
        setToast(`🎉 Created new company portal '${data.data.name}'!`);
        await loadAllCompanies();
        router.push(`/dashboard/${data.data.slug}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error creating company:', err);
      alert('Failed to create company.');
    }
  };

  if (!company) {
    return (
      <div style={{ padding: '4rem', color: '#f8fafc', background: '#090d16', minHeight: '100vh', textAlign: 'center' }}>
        <h2>Loading Recruiter Studio...</h2>
      </div>
    );
  }

  // Dynamic Preview CSS Variables & Font Family
  const previewBrandStyles = {
    '--brand-primary': company.primaryColor || '#2563eb',
    '--brand-accent': company.accentColor || '#3b82f6',
    '--brand-bg': company.backgroundColor || '#0f172a',
    '--brand-text': company.textColor || '#f8fafc',
    fontFamily: company.fontFamily ? `'${company.fontFamily}', sans-serif` : "'Outfit', sans-serif",
  };

  // Helper to render sections live in preview
  const renderPreviewSection = (section, index) => {
    if (!section.isVisible) return null;

    switch (section.type) {
      case 'HERO':
        return (
          <HeroSection
            key={index}
            content={section.content}
            companyName={company.name}
            bannerUrl={company.bannerUrl}
          />
        );
      case 'ABOUT':
        return (
          <AboutSection
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            content={section.content}
            videoUrl={company.videoUrl}
            website={company.website}
          />
        );
      case 'CULTURE':
        return (
          <CultureSection
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            content={section.content}
          />
        );
      case 'PERKS':
        return (
          <PerksSection
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            content={section.content}
          />
        );
      case 'JOBS':
        return (
          <JobsSection
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            jobs={jobs}
            companySlug={company.slug}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
      <Head>
        <title>SaaS Recruiter Studio — {company.name}</title>
      </Head>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-0 inset-x-0 z-[300] py-3 px-6 bg-emerald-600 text-white text-sm font-semibold text-center shadow-lg transition-all">
          {toast}
        </div>
      )}

      {/* Top Navigation */}
      <header className="flex items-center justify-between px-8 py-3.5 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <h1 className="font-outfit text-xl font-bold m-0 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            ⚙️ SaaS Recruiter Studio
          </h1>
          <select
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-slate-50 text-sm font-semibold outline-none cursor-pointer focus:border-indigo-500 [&>option]:bg-slate-900 [&>option]:text-slate-50"
            value={slug}
            onChange={handleCompanyChange}
          >
            {companiesList.map((c) => (
              <option key={c.slug} value={c.slug}>
                🏢 {c.name} ({c.slug})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              className={`px-3.5 py-1.5 rounded-lg bg-transparent border-none text-xs font-medium cursor-pointer transition-all ${
                viewMode === 'split' ? 'bg-white/15 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setViewMode('split')}
            >
              Split View
            </button>
            <button
              className={`px-3.5 py-1.5 rounded-lg bg-transparent border-none text-xs font-medium cursor-pointer transition-all ${
                viewMode === 'edit' ? 'bg-white/15 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setViewMode('edit')}
            >
              Editor Only
            </button>
            <button
              className={`px-3.5 py-1.5 rounded-lg bg-transparent border-none text-xs font-medium cursor-pointer transition-all ${
                viewMode === 'preview' ? 'bg-white/15 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setViewMode('preview')}
            >
              Live Preview
            </button>
          </div>

          <Link
            href={`/companies/${company.slug}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sky-400 text-sm font-semibold no-underline inline-flex items-center gap-1.5 hover:bg-sky-400/10 transition-colors"
          >
            <span>Live Page</span> ↗
          </Link>

          <button
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 border-none text-white text-sm font-semibold cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : '💾 Save & Publish'}
          </button>
        </div>
      </header>

      {/* Split Screen Workspace */}
      <div
        className={`grid flex-1 ${
          viewMode === 'edit'
            ? 'grid-cols-1'
            : viewMode === 'preview'
            ? 'grid-cols-1'
            : 'grid-cols-1 lg:grid-cols-[520px_1fr]'
        } h-[calc(100vh-65px)] overflow-hidden`}
      >
        {/* LEFT PANEL: Recruiter CMS Editor */}
        {viewMode !== 'preview' && (
          <aside className="bg-slate-900 border-r border-white/10 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Tabbed Navigation */}
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 gap-1">
              <button
                className={`flex-1 py-2 px-1 rounded-lg bg-transparent border-none text-xs font-semibold cursor-pointer transition-all text-center ${
                  activeTab === 'design' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                onClick={() => setActiveTab('design')}
              >
                🎨 Design
              </button>
              <button
                className={`flex-1 py-2 px-1 rounded-lg bg-transparent border-none text-xs font-semibold cursor-pointer transition-all text-center ${
                  activeTab === 'info' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                onClick={() => setActiveTab('info')}
              >
                🏢 Info
              </button>
              <button
                className={`flex-1 py-2 px-1 rounded-lg bg-transparent border-none text-xs font-semibold cursor-pointer transition-all text-center ${
                  activeTab === 'content' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                onClick={() => setActiveTab('content')}
              >
                📑 Content
              </button>
              <button
                className={`flex-1 py-2 px-1 rounded-lg bg-transparent border-none text-xs font-semibold cursor-pointer transition-all text-center ${
                  activeTab === 'jobs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                onClick={() => setActiveTab('jobs')}
              >
                💼 Jobs ({jobs.length})
              </button>
              <button
                className={`flex-1 py-2 px-1 rounded-lg bg-transparent border-none text-xs font-semibold cursor-pointer transition-all text-center ${
                  activeTab === 'create' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                onClick={() => setActiveTab('create')}
              >
                ➕ New
              </button>
            </div>

            {/* TAB 1: Design & Fonts */}
            {activeTab === 'design' && (
              <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-5">
                <h3 className="font-outfit text-base font-bold text-slate-50 m-0 flex items-center gap-2">🎨 Theme Colors & Typography</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Font Family (Google Fonts)</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors cursor-pointer [&>option]:bg-slate-900 [&>option]:text-slate-50"
                    value={company.fontFamily || 'Outfit'}
                    onChange={(e) => handleMetaChange('fontFamily', e.target.value)}
                  >
                    <option value="Outfit">Outfit (Modern Tech)</option>
                    <option value="Inter">Inter (Clean SaaS)</option>
                    <option value="Poppins">Poppins (Friendly)</option>
                    <option value="Roboto">Roboto (Classic)</option>
                    <option value="Playfair Display">Playfair Display (Editorial Luxury)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (SaaS Prime)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex items-center gap-2.5 p-2 px-3 bg-white/5 border border-white/10 rounded-xl">
                    <input
                      type="color"
                      className="w-8 h-8 border-none rounded-lg cursor-pointer bg-none"
                      value={company.primaryColor || '#2563eb'}
                      onChange={(e) => handleMetaChange('primaryColor', e.target.value)}
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Primary</span>
                      <div className="font-mono text-xs text-slate-300">{company.primaryColor}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 px-3 bg-white/5 border border-white/10 rounded-xl">
                    <input
                      type="color"
                      className="w-8 h-8 border-none rounded-lg cursor-pointer bg-none"
                      value={company.accentColor || '#3b82f6'}
                      onChange={(e) => handleMetaChange('accentColor', e.target.value)}
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Accent</span>
                      <div className="font-mono text-xs text-slate-300">{company.accentColor}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 px-3 bg-white/5 border border-white/10 rounded-xl">
                    <input
                      type="color"
                      className="w-8 h-8 border-none rounded-lg cursor-pointer bg-none"
                      value={company.backgroundColor || '#0f172a'}
                      onChange={(e) => handleMetaChange('backgroundColor', e.target.value)}
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Background</span>
                      <div className="font-mono text-xs text-slate-300">{company.backgroundColor}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 px-3 bg-white/5 border border-white/10 rounded-xl">
                    <input
                      type="color"
                      className="w-8 h-8 border-none rounded-lg cursor-pointer bg-none"
                      value={company.textColor || '#f8fafc'}
                      onChange={(e) => handleMetaChange('textColor', e.target.value)}
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Text</span>
                      <div className="font-mono text-xs text-slate-300">{company.textColor}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Company Info & Social Links */}
            {activeTab === 'info' && (
              <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-5">
                <h3 className="font-outfit text-base font-bold text-slate-50 m-0 flex items-center gap-2">🏢 Company Profile & Links</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    value={company.name || ''}
                    onChange={(e) => handleMetaChange('name', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors resize-y min-h-[90px]"
                    value={company.description || ''}
                    onChange={(e) => handleMetaChange('description', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Official Website URL</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    value={company.website || ''}
                    onChange={(e) => handleMetaChange('website', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">YouTube / Vimeo Video URL</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    value={company.videoUrl || ''}
                    onChange={(e) => handleMetaChange('videoUrl', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logo URL</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    value={company.logoUrl || ''}
                    onChange={(e) => handleMetaChange('logoUrl', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Banner Image URL</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    value={company.bannerUrl || ''}
                    onChange={(e) => handleMetaChange('bannerUrl', e.target.value)}
                  />
                </div>

                <h4 className="text-sky-400 mt-4 mb-2 text-sm font-semibold">
                  🔗 Social Media Links
                </h4>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">LinkedIn URL</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="https://linkedin.com/company/..."
                    value={company.socialLinks?.linkedin || ''}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Twitter / X URL</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="https://twitter.com/..."
                    value={company.socialLinks?.twitter || ''}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GitHub URL</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="https://github.com/..."
                    value={company.socialLinks?.github || ''}
                    onChange={(e) => handleSocialChange('github', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Glassdoor URL</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="https://glassdoor.com/..."
                    value={company.socialLinks?.glassdoor || ''}
                    onChange={(e) => handleSocialChange('glassdoor', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Deep Content Builder */}
            {activeTab === 'content' && (
              <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit text-base font-bold text-slate-50 m-0 flex items-center gap-2">📑 Deep Section Builder</h3>
                </div>

                {/* Add Section Bar */}
                <div className="flex items-center gap-2 pb-2">
                  <select
                    className="flex-1 p-2 rounded-lg bg-white/5 border border-white/15 text-slate-50 text-xs outline-none [&>option]:bg-slate-900"
                    value={newSectionType}
                    onChange={(e) => setNewSectionType(e.target.value)}
                  >
                    <option value="HERO">Hero Section</option>
                    <option value="ABOUT">About Section</option>
                    <option value="CULTURE">Culture & Values Section</option>
                    <option value="PERKS">Perks & Benefits Section</option>
                    <option value="JOBS">Jobs & Roles Section</option>
                  </select>
                  <button className="px-4 py-2 rounded-lg bg-emerald-500 border-none text-white font-semibold text-xs cursor-pointer hover:bg-emerald-600 transition-colors" onClick={handleAddSection}>
                    + Add Section
                  </button>
                </div>

                {/* Sections List */}
                <div className="flex flex-col gap-4">
                  {company.sections?.map((section, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-outfit text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                          <span>{idx + 1}.</span> {section.type}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-slate-300 cursor-pointer text-xs hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => moveSection(idx, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-slate-300 cursor-pointer text-xs hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => moveSection(idx, 'down')}
                            disabled={idx === company.sections.length - 1}
                            title="Move Down"
                          >
                            ▼
                          </button>

                          <label className="relative inline-block w-10 h-5 cursor-pointer" title="Toggle Visibility">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={section.isVisible}
                              onChange={() => toggleVisibility(idx)}
                            />
                            <span className="absolute inset-0 bg-white/15 peer-checked:bg-emerald-500 transition-all rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-5"></span>
                          </label>

                          <button
                            className="px-2 py-1 bg-red-500/15 border border-red-500/30 rounded-md text-red-300 cursor-pointer text-xs hover:bg-red-600 hover:text-white transition-colors"
                            onClick={() => deleteSection(idx)}
                            title="Delete Section"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Header Inputs */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Section Title</label>
                        <input
                          type="text"
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                          value={section.title || ''}
                          onChange={(e) => updateSectionField(idx, 'title', e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Section Subtitle</label>
                        <input
                          type="text"
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                          value={section.subtitle || ''}
                          onChange={(e) => updateSectionField(idx, 'subtitle', e.target.value)}
                        />
                      </div>

                      {/* Section Specific Content Array Editors */}
                      {section.type === 'HERO' && (
                        <div className="mt-2 flex flex-col gap-2.5">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hero Badge Text</label>
                            <input
                              type="text"
                              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                              value={section.content?.badgeText || ''}
                              onChange={(e) => updateSectionContentField(idx, 'badgeText', e.target.value)}
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Headline</label>
                            <input
                              type="text"
                              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                              value={section.content?.headline || ''}
                              onChange={(e) => updateSectionContentField(idx, 'headline', e.target.value)}
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tagline</label>
                            <input
                              type="text"
                              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                              value={section.content?.tagline || ''}
                              onChange={(e) => updateSectionContentField(idx, 'tagline', e.target.value)}
                            />
                          </div>

                          {/* Hero Stats Array */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hero Key Stats Badges</label>
                            <div className="flex flex-col gap-3 mt-2">
                              {(section.content?.stats || []).map((st, stIdx) => (
                                <div key={stIdx} className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 relative">
                                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                                    <span>Stat #{stIdx + 1}</span>
                                    <button
                                      className="bg-transparent border-none text-red-400 cursor-pointer text-xs p-0 hover:text-red-300"
                                      onClick={() => removeArrayItem(idx, 'stats', stIdx)}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Value (e.g. 27,000+)"
                                    value={st.value || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'stats', stIdx, 'value', e.target.value)
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Label (e.g. Companies)"
                                    value={st.label || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'stats', stIdx, 'label', e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <button
                                className="px-3.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold cursor-pointer self-start mt-1 hover:bg-indigo-500/25 transition-colors"
                                onClick={() =>
                                  addArrayItem(idx, 'stats', { value: '100+', label: 'New Metric' })
                                }
                              >
                                + Add Stat Metric
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.type === 'ABOUT' && (
                        <div className="mt-2 flex flex-col gap-2.5">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Story (Multi-paragraph)</label>
                            <textarea
                              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors resize-y min-h-[90px]"
                              rows={5}
                              value={section.content?.story || ''}
                              onChange={(e) => updateSectionContentField(idx, 'story', e.target.value)}
                            />
                          </div>

                          {/* About Stats Array */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Milestones / Stats</label>
                            <div className="flex flex-col gap-3 mt-2">
                              {(section.content?.stats || []).map((st, stIdx) => (
                                <div key={stIdx} className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 relative">
                                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                                    <span>Milestone #{stIdx + 1}</span>
                                    <button
                                      className="bg-transparent border-none text-red-400 cursor-pointer text-xs p-0 hover:text-red-300"
                                      onClick={() => removeArrayItem(idx, 'stats', stIdx)}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Value (e.g. 2012)"
                                    value={st.value || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'stats', stIdx, 'value', e.target.value)
                                    }
                                  />
                                  <input
                                    type="text"
                                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Label (e.g. Founded)"
                                    value={st.label || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'stats', stIdx, 'label', e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <button
                                className="px-3.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold cursor-pointer self-start mt-1 hover:bg-indigo-500/25 transition-colors"
                                onClick={() =>
                                  addArrayItem(idx, 'stats', { value: '2024', label: 'Milestone' })
                                }
                              >
                                + Add Milestone
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.type === 'CULTURE' && (
                        <div className="mt-2 flex flex-col gap-2.5">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Culture Description</label>
                            <textarea
                              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors resize-y min-h-[90px]"
                              value={section.content?.description || ''}
                              onChange={(e) => updateSectionContentField(idx, 'description', e.target.value)}
                            />
                          </div>

                          {/* Culture Values Array */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Core Values List</label>
                            <div className="flex flex-col gap-3 mt-2">
                              {(section.content?.values || []).map((val, valIdx) => (
                                <div key={valIdx} className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 relative">
                                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                                    <span>Value #{valIdx + 1}</span>
                                    <button
                                      className="bg-transparent border-none text-red-400 cursor-pointer text-xs p-0 hover:text-red-300"
                                      onClick={() => removeArrayItem(idx, 'values', valIdx)}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      className="w-16 px-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none text-center"
                                      placeholder="Icon"
                                      value={val.icon || '💡'}
                                      onChange={(e) =>
                                        updateArrayItem(idx, 'values', valIdx, 'icon', e.target.value)
                                      }
                                    />
                                    <input
                                      type="text"
                                      className="flex-1 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                                      placeholder="Value Name"
                                      value={val.name || ''}
                                      onChange={(e) =>
                                        updateArrayItem(idx, 'values', valIdx, 'name', e.target.value)
                                      }
                                    />
                                  </div>
                                  <textarea
                                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors resize-y min-h-[70px]"
                                    placeholder="Description"
                                    value={val.description || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'values', valIdx, 'description', e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <button
                                className="px-3.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold cursor-pointer self-start mt-1 hover:bg-indigo-500/25 transition-colors"
                                onClick={() =>
                                  addArrayItem(idx, 'values', {
                                    icon: '🚀',
                                    name: 'New Value',
                                    description: 'Value description text...',
                                  })
                                }
                              >
                                + Add Core Value
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.type === 'PERKS' && (
                        <div className="mt-2 flex flex-col gap-2.5">
                          {/* Perks Array */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Benefits & Perks List</label>
                            <div className="flex flex-col gap-3 mt-2">
                              {(section.content?.perks || []).map((pk, pkIdx) => (
                                <div key={pkIdx} className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 relative">
                                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                                    <span>Perk #{pkIdx + 1}</span>
                                    <button
                                      className="bg-transparent border-none text-red-400 cursor-pointer text-xs p-0 hover:text-red-300"
                                      onClick={() => removeArrayItem(idx, 'perks', pkIdx)}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      className="w-16 px-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none text-center"
                                      placeholder="Icon"
                                      value={pk.icon || '🎁'}
                                      onChange={(e) =>
                                        updateArrayItem(idx, 'perks', pkIdx, 'icon', e.target.value)
                                      }
                                    />
                                    <input
                                      type="text"
                                      className="flex-1 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                                      placeholder="Perk Title"
                                      value={pk.title || ''}
                                      onChange={(e) =>
                                        updateArrayItem(idx, 'perks', pkIdx, 'title', e.target.value)
                                      }
                                    />
                                  </div>
                                  <textarea
                                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors resize-y min-h-[70px]"
                                    placeholder="Description"
                                    value={pk.description || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'perks', pkIdx, 'description', e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <button
                                className="px-3.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold cursor-pointer self-start mt-1 hover:bg-indigo-500/25 transition-colors"
                                onClick={() =>
                                  addArrayItem(idx, 'perks', {
                                    icon: '🏖️',
                                    title: 'New Benefit',
                                    description: 'Perk description text...',
                                  })
                                }
                              >
                                + Add Perk / Benefit
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Full Jobs CRUD Studio */}
            {activeTab === 'jobs' && (
              <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit text-base font-bold text-slate-50 m-0 flex items-center gap-2">💼 Job Postings & JD Studio</h3>
                  <button className="px-4 py-2 rounded-lg bg-emerald-500 border-none text-white font-semibold text-xs cursor-pointer hover:bg-emerald-600 transition-colors" onClick={handleOpenCreateJob}>
                    + Create New Job
                  </button>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  {jobs.length > 0 ? (
                    jobs.map((j) => (
                      <div key={j._id} className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 relative">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                          <span className="text-sky-400 font-bold">{j.department}</span>
                          <div className="flex gap-1.5">
                            <button
                              className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-slate-300 cursor-pointer text-xs hover:bg-white/15"
                              onClick={() => handleOpenEditJob(j)}
                            >
                              ✏️ Edit JD
                            </button>
                            <button
                              className="px-2 py-1 bg-red-500/15 border border-red-500/30 rounded-md text-red-300 cursor-pointer text-xs hover:bg-red-600 hover:text-white transition-colors"
                              onClick={() => handleDeleteJob(j._id, j.title)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <h4 className="my-1 text-slate-50 font-bold text-base">
                          {j.title}
                        </h4>
                        <div className="flex gap-3 text-xs text-slate-400 opacity-90">
                          <span>📍 {j.location}</span>
                          <span>🏢 {j.work_policy}</span>
                          <span className="text-emerald-400">💰 {j.salary_range}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-4 text-xs">
                      No active job postings. Click "+ Create New Job" above to post your first position!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: Create New SaaS Company */}
            {activeTab === 'create' && (
              <form className="bg-white/[0.025] border border-white/10 rounded-2xl p-5 flex flex-col gap-5" onSubmit={handleCreateCompanySubmit}>
                <h3 className="font-outfit text-base font-bold text-slate-50 m-0 flex items-center gap-2">➕ Launch New SaaS Company Portal</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Acme Corp"
                    required
                    value={newCompanyForm.name}
                    onChange={(e) =>
                      setNewCompanyForm({
                        ...newCompanyForm,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">URL Slug *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. acme-corp"
                    required
                    value={newCompanyForm.slug}
                    onChange={(e) =>
                      setNewCompanyForm({ ...newCompanyForm, slug: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors resize-y min-h-[90px]"
                    placeholder="Company mission or elevator pitch..."
                    value={newCompanyForm.description}
                    onChange={(e) =>
                      setNewCompanyForm({ ...newCompanyForm, description: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Website</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="https://acme.com"
                    value={newCompanyForm.website}
                    onChange={(e) =>
                      setNewCompanyForm({ ...newCompanyForm, website: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 border-none text-white text-sm font-semibold cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 hover:opacity-95 self-start mt-2 transition-all"
                >
                  🚀 Launch Portal Now
                </button>
              </form>
            )}
          </aside>
        )}

        {/* RIGHT PANEL: Real-Time Live Preview */}
        {viewMode !== 'edit' && (
          <section className="bg-slate-950 overflow-y-auto relative h-full isolate">
            <div className="sticky top-0 z-50 px-6 py-2 bg-slate-900/95 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
              <div className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                <span>REAL-TIME SAAS LIVE PREVIEW</span>
              </div>
              <span>Font: {company.fontFamily || 'Outfit'} | Live Preview Sync</span>
            </div>

            <div style={previewBrandStyles} className="min-h-full transition-all">
              <Header company={company} />

              <main>
                {company.sections
                  ?.filter((s) => s.isVisible)
                  .map((section, index) => renderPreviewSection(section, index))}
              </main>

              <Footer company={company} />
            </div>
          </section>
        )}
      </div>

      {/* Job Create/Edit Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/15 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-50 font-sans shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-outfit text-xl font-bold m-0">
                {editingJob ? `✏️ Edit Job: ${editingJob.title}` : '💼 Post New Job Opportunity'}
              </h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="bg-transparent border-none text-slate-400 hover:text-white text-xl cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJobSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Engineering"
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Remote / Athens"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Work Policy</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors cursor-pointer [&>option]:bg-slate-900 [&>option]:text-slate-50"
                    value={jobForm.work_policy}
                    onChange={(e) => setJobForm({ ...jobForm, work_policy: e.target.value })}
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employment Type</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors cursor-pointer [&>option]:bg-slate-900 [&>option]:text-slate-50"
                    value={jobForm.employment_type}
                    onChange={(e) => setJobForm({ ...jobForm, employment_type: e.target.value })}
                  >
                    <option value="Full time">Full time</option>
                    <option value="Part time">Part time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Salary Range</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. $120k - $150k"
                    value={jobForm.salary_range}
                    onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Description (JD) *</label>
                <textarea
                  rows={6}
                  required
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors resize-y min-h-[90px]"
                  placeholder="Full role responsibilities, team vision, and daily impact..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Requirements & Qualifications</label>
                <textarea
                  rows={5}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-50 outline-none focus:border-indigo-500 transition-colors resize-y min-h-[90px]"
                  placeholder="Bullet points of required experience, skills, and qualifications..."
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 border-none text-white text-sm font-semibold cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 hover:opacity-95 transition-all"
                >
                  {editingJob ? '💾 Save Changes' : '🚀 Post Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
