import React, { useMemo, useRef, useEffect } from 'react';
import styles from './Editor.module.css';

import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import CultureSection from '../sections/CultureSection';
import PerksSection from '../sections/PerksSection';
import JobsSection from '../sections/JobsSection';
import TeamSection from '../sections/TeamSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import FaqSection from '../sections/FaqSection';
import CtaSection from '../sections/CtaSection';
import GallerySection from '../sections/GallerySection';
import Header from '../Header';
import Footer from '../Footer';

/**
 * Section type labels for the overlay badges
 */
const SECTION_TYPE_LABELS = {
  HERO: 'Hero',
  ABOUT: 'About',
  CULTURE: 'Culture & Values',
  PERKS: 'Perks & Benefits',
  JOBS: 'Open Positions',
  TEAM: 'Team & Leadership',
  TESTIMONIALS: 'Testimonials',
  FAQ: 'FAQ',
  CTA: 'Call to Action',
  GALLERY: 'Photo Gallery',
};

/**
 * Renders an individual section based on its type.
 */
function renderSectionContent(section, company, jobs) {
  switch (section.type) {
    case 'HERO':
      return (
        <HeroSection
          content={section.content}
          companyName={company.name}
          bannerUrl={company.bannerUrl}
        />
      );
    case 'ABOUT':
      return (
        <AboutSection
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
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
        />
      );
    case 'PERKS':
      return (
        <PerksSection
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
        />
      );
    case 'JOBS':
      return (
        <JobsSection
          title={section.title}
          subtitle={section.subtitle}
          jobs={jobs}
          companySlug={company.slug}
        />
      );
    case 'TEAM':
      return (
        <TeamSection
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
        />
      );
    case 'TESTIMONIALS':
      return (
        <TestimonialsSection
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
        />
      );
    case 'FAQ':
      return (
        <FaqSection
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
        />
      );
    case 'CTA':
      return (
        <CtaSection
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
        />
      );
    case 'GALLERY':
      return (
        <GallerySection
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
        />
      );
    default:
      return (
        <div style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'var(--brand-text, #94a3b8)',
          opacity: 0.5,
          fontSize: '1rem',
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧩</p>
          <p>{section.type} section</p>
        </div>
      );
  }
}

/**
 * EditorCanvas — The central live preview area of the editor.
 */
export default function EditorCanvas({
  company,
  jobs,
  viewportMode,
  selectedSectionId,
  brandingFocusArea,
  onSelectSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onDuplicateSection,
  onToggleVisibility,
  onDeleteSection,
}) {
  const sectionRefs = useRef({});
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  // Smoothly scroll the preview viewport to center the selected section
  useEffect(() => {
    if (!selectedSectionId) return;
    const targetEl = sectionRefs.current[selectedSectionId];
    if (targetEl && typeof targetEl.scrollIntoView === 'function') {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [selectedSectionId]);

  // Smoothly scroll to the corresponding branding area when focused
  useEffect(() => {
    if (!brandingFocusArea) return;

    let targetEl = null;

    if (brandingFocusArea === 'logo') {
      targetEl = headerRef.current;
    } else if (brandingFocusArea === 'banner') {
      // Find HERO section ref if visible
      const heroSection = company?.sections?.find((s) => s.type === 'HERO' && s.isVisible);
      if (heroSection && sectionRefs.current[heroSection._id]) {
        targetEl = sectionRefs.current[heroSection._id];
      } else {
        targetEl = headerRef.current;
      }
    } else if (brandingFocusArea === 'about') {
      // Find ABOUT section ref if visible
      const aboutSection = company?.sections?.find((s) => s.type === 'ABOUT' && s.isVisible);
      if (aboutSection && sectionRefs.current[aboutSection._id]) {
        targetEl = sectionRefs.current[aboutSection._id];
      } else {
        targetEl = headerRef.current;
      }
    } else if (brandingFocusArea === 'footer') {
      targetEl = footerRef.current;
    }

    if (targetEl && typeof targetEl.scrollIntoView === 'function') {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [brandingFocusArea, company]);

  // Brand CSS variables for the canvas
  const brandStyles = useMemo(() => {
    if (!company) return {};
    return {
      '--brand-primary': company.primaryColor || '#2563eb',
      '--brand-accent': company.accentColor || '#3b82f6',
      '--brand-bg': company.backgroundColor || '#0f172a',
      '--brand-text': company.textColor || '#f8fafc',
      '--brand-radius': company.borderRadius || '16px',
      fontFamily: company.fontFamily
        ? `'${company.fontFamily}', sans-serif`
        : "'Outfit', sans-serif",
    };
  }, [company]);

  const containerClass = [
    styles.canvasContainer,
    viewportMode === 'tablet' ? styles.tablet : '',
    viewportMode === 'mobile' ? styles.mobile : '',
  ].filter(Boolean).join(' ');

  if (!company) {
    return (
      <div className={styles.canvasArea}>
        <div className={styles.canvasContainer}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#475569',
          }}>
            <div className={styles.loadingSpinner} />
          </div>
        </div>
      </div>
    );
  }

  const allSections = company.sections || [];

  return (
    <div 
      className={styles.canvasArea}
      onClick={() => onSelectSection && onSelectSection(null)}
    >
      <div className={containerClass}>
        <div className={styles.canvasFrame} style={brandStyles}>
          {/* Header */}
          <div
            ref={headerRef}
            className={`${styles.canvasSectionWrapper} ${brandingFocusArea === 'logo' ? styles.selected : ''}`}
          >
            <Header company={company} />
          </div>

          {/* Sections */}
          <main>
            {allSections.map((section, index) => {
              if (!section.isVisible) return null;
              const isHeroHighlighted = brandingFocusArea === 'banner' && section.type === 'HERO';
              const isAboutHighlighted = brandingFocusArea === 'about' && section.type === 'ABOUT';
              const isSelected = section._id === selectedSectionId || isHeroHighlighted || isAboutHighlighted;

              return (
                <div
                  key={section._id || index}
                  ref={(el) => {
                    if (section._id) {
                      sectionRefs.current[section._id] = el;
                    }
                  }}
                  className={`${styles.canvasSectionWrapper} ${isSelected ? styles.selected : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection(section._id);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${SECTION_TYPE_LABELS[section.type] || section.type} section`}
                >
                  {/* Section label badge & Toolbar */}
                  <div className={styles.canvasSectionHeader}>
                    <span className={styles.canvasSectionLabel}>
                      {SECTION_TYPE_LABELS[section.type] || section.type}
                    </span>

                    {/* Quick action toolbar overlay */}
                    <div className={styles.canvasToolbar} onClick={(e) => e.stopPropagation()}>
                      <button
                        title="Move Up"
                        disabled={index === 0}
                        onClick={() => onMoveSectionUp && onMoveSectionUp(index)}
                        className={styles.canvasToolbarBtn}
                      >
                        ↑
                      </button>
                      <button
                        title="Move Down"
                        disabled={index === allSections.length - 1}
                        onClick={() => onMoveSectionDown && onMoveSectionDown(index)}
                        className={styles.canvasToolbarBtn}
                      >
                        ↓
                      </button>
                      <button
                        title="Duplicate"
                        onClick={() => onDuplicateSection && onDuplicateSection(index)}
                        className={styles.canvasToolbarBtn}
                      >
                        📋
                      </button>
                      <button
                        title="Toggle Visibility"
                        onClick={() => onToggleVisibility && onToggleVisibility(index)}
                        className={styles.canvasToolbarBtn}
                      >
                        👁️
                      </button>
                      <button
                        title="Delete Section"
                        onClick={() => onDeleteSection && onDeleteSection(index)}
                        className={`${styles.canvasToolbarBtn} ${styles.danger}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Render Actual Section */}
                  {renderSectionContent(section, company, jobs)}
                </div>
              );
            })}

            {/* Empty state */}
            {allSections.length === 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                color: '#475569',
                textAlign: 'center',
                padding: '2rem',
              }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>📄</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  No sections added yet
                </p>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                  Use the sidebar to add sections to your careers page
                </p>
              </div>
            )}
          </main>

          {/* Footer */}
          <div
            ref={footerRef}
            className={`${styles.canvasSectionWrapper} ${brandingFocusArea === 'footer' ? styles.selected : ''}`}
          >
            <Footer company={company} />
          </div>
        </div>
      </div>
    </div>
  );
}
