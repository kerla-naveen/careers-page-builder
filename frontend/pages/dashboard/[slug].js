import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Dashboard.module.css';

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
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'info' | 'content' | 'create'
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'edit' | 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Add Section State
  const [newSectionType, setNewSectionType] = useState('CULTURE');

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

  // Save changes via PUT API
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
    <div className={styles.dashboardLayout}>
      <Head>
        <title>SaaS Recruiter Studio — {company.name}</title>
      </Head>

      {/* Toast Notification */}
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* Top Navigation */}
      <header className={styles.topNav}>
        <div className={styles.brandBrand}>
          <h1 className={styles.dashboardTitle}>⚙️ SaaS Recruiter Studio</h1>
          <select className={styles.companySelect} value={slug} onChange={handleCompanyChange}>
            {companiesList.map((c) => (
              <option key={c.slug} value={c.slug}>
                🏢 {c.name} ({c.slug})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.navActions}>
          <div className={styles.viewModeToggle}>
            <button
              className={`${styles.modeBtn} ${viewMode === 'split' ? styles.activeMode : ''}`}
              onClick={() => setViewMode('split')}
            >
              Split View
            </button>
            <button
              className={`${styles.modeBtn} ${viewMode === 'edit' ? styles.activeMode : ''}`}
              onClick={() => setViewMode('edit')}
            >
              Editor Only
            </button>
            <button
              className={`${styles.modeBtn} ${viewMode === 'preview' ? styles.activeMode : ''}`}
              onClick={() => setViewMode('preview')}
            >
              Live Preview
            </button>
          </div>

          <Link href={`/companies/${company.slug}`} target="_blank" className={styles.livePageLink}>
            <span>Live Page</span> ↗
          </Link>

          <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : '💾 Save & Publish'}
          </button>
        </div>
      </header>

      {/* Split Screen Workspace */}
      <div
        className={`${styles.mainContainer} ${
          viewMode === 'edit' ? styles.fullEdit : viewMode === 'preview' ? styles.fullPreview : ''
        }`}
      >
        {/* LEFT PANEL: Recruiter CMS Editor */}
        {viewMode !== 'preview' && (
          <aside className={styles.editorSidebar}>
            {/* Tabbed Navigation */}
            <div className={styles.tabNav}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'design' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('design')}
              >
                🎨 Design & Fonts
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'info' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('info')}
              >
                🏢 Info & Social
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'content' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('content')}
              >
                📑 Content Builder
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'create' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('create')}
              >
                ➕ New Company
              </button>
            </div>

            {/* TAB 1: Design & Fonts */}
            {activeTab === 'design' && (
              <div className={styles.panelSection}>
                <h3 className={styles.panelTitle}>🎨 Theme Colors & Typography</h3>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Font Family (Google Fonts)</label>
                  <select
                    className={styles.select}
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

                <div className={styles.colorsGrid}>
                  <div className={styles.colorItem}>
                    <input
                      type="color"
                      className={styles.colorPicker}
                      value={company.primaryColor || '#2563eb'}
                      onChange={(e) => handleMetaChange('primaryColor', e.target.value)}
                    />
                    <div>
                      <span className={styles.label}>Primary</span>
                      <div className={styles.colorHex}>{company.primaryColor}</div>
                    </div>
                  </div>

                  <div className={styles.colorItem}>
                    <input
                      type="color"
                      className={styles.colorPicker}
                      value={company.accentColor || '#3b82f6'}
                      onChange={(e) => handleMetaChange('accentColor', e.target.value)}
                    />
                    <div>
                      <span className={styles.label}>Accent</span>
                      <div className={styles.colorHex}>{company.accentColor}</div>
                    </div>
                  </div>

                  <div className={styles.colorItem}>
                    <input
                      type="color"
                      className={styles.colorPicker}
                      value={company.backgroundColor || '#0f172a'}
                      onChange={(e) => handleMetaChange('backgroundColor', e.target.value)}
                    />
                    <div>
                      <span className={styles.label}>Background</span>
                      <div className={styles.colorHex}>{company.backgroundColor}</div>
                    </div>
                  </div>

                  <div className={styles.colorItem}>
                    <input
                      type="color"
                      className={styles.colorPicker}
                      value={company.textColor || '#f8fafc'}
                      onChange={(e) => handleMetaChange('textColor', e.target.value)}
                    />
                    <div>
                      <span className={styles.label}>Text</span>
                      <div className={styles.colorHex}>{company.textColor}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Company Info & Social Links */}
            {activeTab === 'info' && (
              <div className={styles.panelSection}>
                <h3 className={styles.panelTitle}>🏢 Company Profile & Links</h3>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Company Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={company.name || ''}
                    onChange={(e) => handleMetaChange('name', e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={company.description || ''}
                    onChange={(e) => handleMetaChange('description', e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Official Website URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={company.website || ''}
                    onChange={(e) => handleMetaChange('website', e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>YouTube / Vimeo Video URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={company.videoUrl || ''}
                    onChange={(e) => handleMetaChange('videoUrl', e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Logo URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={company.logoUrl || ''}
                    onChange={(e) => handleMetaChange('logoUrl', e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Banner Image URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={company.bannerUrl || ''}
                    onChange={(e) => handleMetaChange('bannerUrl', e.target.value)}
                  />
                </div>

                <h4 style={{ color: '#38bdf8', margin: '1rem 0 0.5rem 0', fontSize: '0.95rem' }}>
                  🔗 Social Media Links
                </h4>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>LinkedIn URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://linkedin.com/company/..."
                    value={company.socialLinks?.linkedin || ''}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Twitter / X URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://twitter.com/..."
                    value={company.socialLinks?.twitter || ''}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>GitHub URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://github.com/..."
                    value={company.socialLinks?.github || ''}
                    onChange={(e) => handleSocialChange('github', e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Glassdoor URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://glassdoor.com/..."
                    value={company.socialLinks?.glassdoor || ''}
                    onChange={(e) => handleSocialChange('glassdoor', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Deep Content Builder */}
            {activeTab === 'content' && (
              <div className={styles.panelSection}>
                <div className={styles.panelHeaderRow}>
                  <h3 className={styles.panelTitle}>📑 Deep Section & Content Builder</h3>
                </div>

                {/* Add Section Bar */}
                <div className={styles.addSectionBar}>
                  <select
                    className={styles.addSectionSelect}
                    value={newSectionType}
                    onChange={(e) => setNewSectionType(e.target.value)}
                  >
                    <option value="HERO">Hero Section</option>
                    <option value="ABOUT">About Section</option>
                    <option value="CULTURE">Culture & Values Section</option>
                    <option value="PERKS">Perks & Benefits Section</option>
                    <option value="JOBS">Jobs & Roles Section</option>
                  </select>
                  <button className={styles.addBtn} onClick={handleAddSection}>
                    + Add Section
                  </button>
                </div>

                {/* Sections List */}
                <div className={styles.sectionsList}>
                  {company.sections?.map((section, idx) => (
                    <div key={idx} className={styles.sectionCard}>
                      <div className={styles.sectionCardHeader}>
                        <span className={styles.sectionTypeBadge}>
                          <span>{idx + 1}.</span> {section.type}
                        </span>

                        <div className={styles.cardControls}>
                          <button
                            className={styles.reorderBtn}
                            onClick={() => moveSection(idx, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            className={styles.reorderBtn}
                            onClick={() => moveSection(idx, 'down')}
                            disabled={idx === company.sections.length - 1}
                            title="Move Down"
                          >
                            ▼
                          </button>

                          <label className={styles.toggleSwitch} title="Toggle Visibility">
                            <input
                              type="checkbox"
                              checked={section.isVisible}
                              onChange={() => toggleVisibility(idx)}
                            />
                            <span className={styles.slider}></span>
                          </label>

                          <button
                            className={styles.deleteBtn}
                            onClick={() => deleteSection(idx)}
                            title="Delete Section"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Header Inputs */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Section Title</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={section.title || ''}
                          onChange={(e) => updateSectionField(idx, 'title', e.target.value)}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Section Subtitle</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={section.subtitle || ''}
                          onChange={(e) => updateSectionField(idx, 'subtitle', e.target.value)}
                        />
                      </div>

                      {/* Section Specific Content Array Editors */}
                      {section.type === 'HERO' && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Hero Badge Text</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={section.content?.badgeText || ''}
                              onChange={(e) => updateSectionContentField(idx, 'badgeText', e.target.value)}
                            />
                          </div>

                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Headline</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={section.content?.headline || ''}
                              onChange={(e) => updateSectionContentField(idx, 'headline', e.target.value)}
                            />
                          </div>

                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Tagline</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={section.content?.tagline || ''}
                              onChange={(e) => updateSectionContentField(idx, 'tagline', e.target.value)}
                            />
                          </div>

                          {/* Hero Stats Array */}
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Hero Key Stats Badges</label>
                            <div className={styles.arrayItemsContainer}>
                              {(section.content?.stats || []).map((st, stIdx) => (
                                <div key={stIdx} className={styles.arrayCard}>
                                  <div className={styles.arrayCardHeader}>
                                    <span>Stat #{stIdx + 1}</span>
                                    <button
                                      className={styles.removeArrayItemBtn}
                                      onClick={() => removeArrayItem(idx, 'stats', stIdx)}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Value (e.g. 27,000+)"
                                    value={st.value || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'stats', stIdx, 'value', e.target.value)
                                    }
                                  />
                                  <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Label (e.g. Companies)"
                                    value={st.label || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'stats', stIdx, 'label', e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <button
                                className={styles.addArrayItemBtn}
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
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Story (Multi-paragraph)</label>
                            <textarea
                              className={styles.textarea}
                              rows={5}
                              value={section.content?.story || ''}
                              onChange={(e) => updateSectionContentField(idx, 'story', e.target.value)}
                            />
                          </div>

                          {/* About Stats Array */}
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Company Milestones / Stats</label>
                            <div className={styles.arrayItemsContainer}>
                              {(section.content?.stats || []).map((st, stIdx) => (
                                <div key={stIdx} className={styles.arrayCard}>
                                  <div className={styles.arrayCardHeader}>
                                    <span>Milestone #{stIdx + 1}</span>
                                    <button
                                      className={styles.removeArrayItemBtn}
                                      onClick={() => removeArrayItem(idx, 'stats', stIdx)}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Value (e.g. 2012)"
                                    value={st.value || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'stats', stIdx, 'value', e.target.value)
                                    }
                                  />
                                  <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Label (e.g. Founded)"
                                    value={st.label || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'stats', stIdx, 'label', e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <button
                                className={styles.addArrayItemBtn}
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
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Culture Description</label>
                            <textarea
                              className={styles.textarea}
                              value={section.content?.description || ''}
                              onChange={(e) => updateSectionContentField(idx, 'description', e.target.value)}
                            />
                          </div>

                          {/* Culture Values Array */}
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Core Values List</label>
                            <div className={styles.arrayItemsContainer}>
                              {(section.content?.values || []).map((val, valIdx) => (
                                <div key={valIdx} className={styles.arrayCard}>
                                  <div className={styles.arrayCardHeader}>
                                    <span>Value #{valIdx + 1}</span>
                                    <button
                                      className={styles.removeArrayItemBtn}
                                      onClick={() => removeArrayItem(idx, 'values', valIdx)}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                      type="text"
                                      className={styles.input}
                                      style={{ width: '60px', textAlign: 'center' }}
                                      placeholder="Icon"
                                      value={val.icon || '💡'}
                                      onChange={(e) =>
                                        updateArrayItem(idx, 'values', valIdx, 'icon', e.target.value)
                                      }
                                    />
                                    <input
                                      type="text"
                                      className={styles.input}
                                      placeholder="Value Name"
                                      value={val.name || ''}
                                      onChange={(e) =>
                                        updateArrayItem(idx, 'values', valIdx, 'name', e.target.value)
                                      }
                                    />
                                  </div>
                                  <textarea
                                    className={styles.textarea}
                                    placeholder="Description"
                                    value={val.description || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'values', valIdx, 'description', e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <button
                                className={styles.addArrayItemBtn}
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
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {/* Perks Array */}
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Benefits & Perks List</label>
                            <div className={styles.arrayItemsContainer}>
                              {(section.content?.perks || []).map((pk, pkIdx) => (
                                <div key={pkIdx} className={styles.arrayCard}>
                                  <div className={styles.arrayCardHeader}>
                                    <span>Perk #{pkIdx + 1}</span>
                                    <button
                                      className={styles.removeArrayItemBtn}
                                      onClick={() => removeArrayItem(idx, 'perks', pkIdx)}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                      type="text"
                                      className={styles.input}
                                      style={{ width: '60px', textAlign: 'center' }}
                                      placeholder="Icon"
                                      value={pk.icon || '🎁'}
                                      onChange={(e) =>
                                        updateArrayItem(idx, 'perks', pkIdx, 'icon', e.target.value)
                                      }
                                    />
                                    <input
                                      type="text"
                                      className={styles.input}
                                      placeholder="Perk Title"
                                      value={pk.title || ''}
                                      onChange={(e) =>
                                        updateArrayItem(idx, 'perks', pkIdx, 'title', e.target.value)
                                      }
                                    />
                                  </div>
                                  <textarea
                                    className={styles.textarea}
                                    placeholder="Description"
                                    value={pk.description || ''}
                                    onChange={(e) =>
                                      updateArrayItem(idx, 'perks', pkIdx, 'description', e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <button
                                className={styles.addArrayItemBtn}
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

            {/* TAB 4: Create New Company */}
            {activeTab === 'create' && (
              <form className={styles.panelSection} onSubmit={handleCreateCompanySubmit}>
                <h3 className={styles.panelTitle}>➕ Launch New SaaS Company Portal</h3>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Company Name *</label>
                  <input
                    type="text"
                    className={styles.input}
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

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>URL Slug *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. acme-corp"
                    required
                    value={newCompanyForm.slug}
                    onChange={(e) =>
                      setNewCompanyForm({ ...newCompanyForm, slug: e.target.value })
                    }
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Company mission or elevator pitch..."
                    value={newCompanyForm.description}
                    onChange={(e) =>
                      setNewCompanyForm({ ...newCompanyForm, description: e.target.value })
                    }
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Website</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://acme.com"
                    value={newCompanyForm.website}
                    onChange={(e) =>
                      setNewCompanyForm({ ...newCompanyForm, website: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className={styles.saveBtn}
                  style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                >
                  🚀 Launch Portal Now
                </button>
              </form>
            )}
          </aside>
        )}

        {/* RIGHT PANEL: Real-Time Live Preview */}
        {viewMode !== 'edit' && (
          <section className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <div className={styles.previewBadge}>
                <span className={styles.liveDot}></span>
                <span>REAL-TIME SAAS LIVE PREVIEW</span>
              </div>
              <span>Font: {company.fontFamily || 'Outfit'} | Live Preview Sync</span>
            </div>

            <div style={previewBrandStyles} className={styles.previewViewport}>
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
    </div>
  );
}
