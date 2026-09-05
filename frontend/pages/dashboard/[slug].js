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

export default function RecruiterDashboard() {
  const router = useRouter();
  const { slug } = router.query;

  // Local Editable State
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'edit' | 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  // Available Demo Companies
  const companiesList = [
    { slug: 'workable', name: 'Workable' },
    { slug: 'ashby', name: 'Ashby' },
    { slug: 'whitecarrot', name: 'Whitecarrot' },
  ];

  // Fetch Company Data from API
  const loadCompanyData = useCallback(async (companySlug) => {
    if (!companySlug) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${companySlug}`);
      const data = await res.json();
      if (data.success) {
        // Normalize sections orderIndex
        const normalizedSections = (data.data.sections || [])
          .slice()
          .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        setCompany({ ...data.data, sections: normalizedSections });
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
    if (slug) {
      loadCompanyData(slug);
    }
  }, [slug, loadCompanyData]);

  // Handle Company Switch
  const handleCompanyChange = (e) => {
    const newSlug = e.target.value;
    router.push(`/dashboard/${newSlug}`);
  };

  // Color & Metadata Handlers
  const handleMetaChange = (field, value) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  // Section Reordering
  const moveSection = (index, direction) => {
    if (!company?.sections) return;
    const newSections = [...company.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap elements
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update orderIndex values
    newSections.forEach((sec, idx) => {
      sec.orderIndex = idx;
    });

    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  // Section Visibility Toggle
  const toggleVisibility = (index) => {
    if (!company?.sections) return;
    const newSections = [...company.sections];
    newSections[index].isVisible = !newSections[index].isVisible;
    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  // Section Field Text Updates
  const updateSectionHeader = (index, field, value) => {
    const newSections = [...company.sections];
    newSections[index][field] = value;
    setCompany((prev) => ({ ...prev, sections: newSections }));
  };

  // Save changes via PUT API call
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
          description: company.description,
          website: company.website,
          videoUrl: company.videoUrl,
          bannerUrl: company.bannerUrl,
          logoUrl: company.logoUrl,
          sections: company.sections,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast('🎉 Company theme & sections saved successfully to backend!');
        setTimeout(() => setToast(''), 4000);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings to server.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!company) {
    return (
      <div style={{ padding: '4rem', color: '#f8fafc', background: '#090d16', minHeight: '100vh', textAlign: 'center' }}>
        <h2>Loading Recruiter Dashboard...</h2>
      </div>
    );
  }

  // Dynamic CSS Variables for Live Preview
  const previewBrandStyles = {
    '--brand-primary': company.primaryColor || '#2563eb',
    '--brand-accent': company.accentColor || '#3b82f6',
    '--brand-bg': company.backgroundColor || '#0f172a',
    '--brand-text': company.textColor || '#f8fafc',
  };

  // Helper to render live preview sections
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
        <title>Recruiter Dashboard — Edit {company.name} Careers Page</title>
      </Head>

      {/* Toast Notification */}
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* Top Navbar */}
      <header className={styles.topNav}>
        <div className={styles.brandBrand}>
          <h1 className={styles.dashboardTitle}>⚙️ Recruiter Studio</h1>
          <select className={styles.companySelect} value={slug} onChange={handleCompanyChange}>
            {companiesList.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.navActions}>
          {/* View Mode Toggle */}
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
            <span>View Live Page</span> ↗
          </Link>

          <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </header>

      {/* Main Split Screen Container */}
      <div
        className={`${styles.mainContainer} ${
          viewMode === 'edit' ? styles.fullEdit : viewMode === 'preview' ? styles.fullPreview : ''
        }`}
      >
        {/* LEFT PANEL: Editor Controls */}
        {viewMode !== 'preview' && (
          <aside className={styles.editorSidebar}>
            {/* Panel 1: Theme & Brand Colors */}
            <div className={styles.panelSection}>
              <h3 className={styles.panelTitle}>🎨 Brand Theme Colors</h3>
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

            {/* Panel 2: Company Details */}
            <div className={styles.panelSection}>
              <h3 className={styles.panelTitle}>🏢 Company Metadata</h3>
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
                <label className={styles.label}>Website URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={company.website || ''}
                  onChange={(e) => handleMetaChange('website', e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>YouTube Video URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={company.videoUrl || ''}
                  onChange={(e) => handleMetaChange('videoUrl', e.target.value)}
                />
              </div>
            </div>

            {/* Panel 3: Section Reordering & Visibility Toggles */}
            <div className={styles.panelSection}>
              <h3 className={styles.panelTitle}>📑 Sections Reorder & Toggle</h3>
              <div className={styles.sectionsList}>
                {company.sections?.map((section, idx) => (
                  <div key={idx} className={styles.sectionCard}>
                    <div className={styles.sectionCardHeader}>
                      <span className={styles.sectionTypeBadge}>
                        <span>{idx + 1}.</span> {section.type}
                      </span>

                      <div className={styles.cardControls}>
                        {/* Move Up/Down */}
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

                        {/* Visibility Toggle */}
                        <label className={styles.toggleSwitch} title="Toggle Section Visibility">
                          <input
                            type="checkbox"
                            checked={section.isVisible}
                            onChange={() => toggleVisibility(idx)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>
                    </div>

                    {/* Expandable Section Fields */}
                    <div className={styles.sectionContentForm}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Section Title</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={section.title || ''}
                          onChange={(e) => updateSectionHeader(idx, 'title', e.target.value)}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Section Subtitle</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={section.subtitle || ''}
                          onChange={(e) => updateSectionHeader(idx, 'subtitle', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* RIGHT PANEL: Real-Time Client-Side Live Preview */}
        {viewMode !== 'edit' && (
          <section className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <div className={styles.previewBadge}>
                <span className={styles.liveDot}></span>
                <span>REAL-TIME CLIENT PREVIEW</span>
              </div>
              <span>Changes re-render live as you edit</span>
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
