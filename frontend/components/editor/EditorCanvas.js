import React, { useMemo, useRef, useEffect } from 'react';

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
      return null;
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

  // Auto-scroll canvas to selected section or focused branding area
  useEffect(() => {
    if (selectedSectionId && sectionRefs.current[selectedSectionId]) {
      sectionRefs.current[selectedSectionId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [selectedSectionId]);

  useEffect(() => {
    if (!brandingFocusArea) return;

    let targetRef = null;
    if (brandingFocusArea === 'logo' && headerRef.current) {
      targetRef = headerRef.current;
    } else if (brandingFocusArea === 'banner') {
      const heroSec = company?.sections?.find((s) => s.type === 'HERO');
      if (heroSec && sectionRefs.current[heroSec._id]) {
        targetRef = sectionRefs.current[heroSec._id];
      }
    } else if (brandingFocusArea === 'about') {
      const aboutSec = company?.sections?.find((s) => s.type === 'ABOUT');
      if (aboutSec && sectionRefs.current[aboutSec._id]) {
        targetRef = sectionRefs.current[aboutSec._id];
      }
    } else if (brandingFocusArea === 'footer' && footerRef.current) {
      targetRef = footerRef.current;
    }

    if (targetRef) {
      targetRef.scrollIntoView({
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
    'w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 transition-all duration-300',
    viewportMode === 'desktop' ? 'max-w-[1280px]' : '',
    viewportMode === 'tablet' ? 'max-w-[768px] mx-auto' : '',
    viewportMode === 'mobile' ? 'max-w-[390px] mx-auto' : '',
  ].filter(Boolean).join(' ');

  if (!company) {
    return (
      <div className="flex-1 bg-slate-200 overflow-y-auto p-4 md:p-8 flex justify-center items-start min-h-0">
        <div className="w-full max-w-[1280px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300">
          <div className="flex items-center justify-center h-64 text-slate-500">
            <div className="w-8 h-8 border-[3px] border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const allSections = company.sections || [];

  return (
    <div 
      className="flex-1 bg-slate-200 overflow-y-auto p-4 md:p-8 flex justify-center items-start min-h-0"
      onClick={() => onSelectSection && onSelectSection(null)}
    >
      <div className={containerClass}>
        <div className="w-full min-h-full bg-[var(--brand-bg,#0b0f19)] text-[var(--brand-text,#f8fafc)] relative" style={brandStyles}>
          {/* Header */}
          <div
            ref={headerRef}
            className={`relative group transition-all duration-200 border-2 border-transparent hover:border-blue-400/50 ${
              brandingFocusArea === 'logo' ? 'border-2 border-blue-600 shadow-lg z-10' : ''
            }`}
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
                  className={`relative group transition-all duration-200 border-2 border-transparent hover:border-blue-400/50 ${
                    isSelected ? 'border-2 border-blue-600 shadow-lg z-10' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSection(section._id);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${SECTION_TYPE_LABELS[section.type] || section.type} section`}
                >
                  {/* Section label badge & Toolbar */}
                  <div className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="px-3 py-1 bg-slate-900/90 text-white text-xs font-semibold rounded-lg backdrop-blur-md border border-white/20 shadow-md">
                      {SECTION_TYPE_LABELS[section.type] || section.type}
                    </span>

                    {/* Quick action toolbar overlay */}
                    <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-white/20 shadow-lg" onClick={(e) => e.stopPropagation()}>
                      <button
                        title="Move Up"
                        disabled={index === 0}
                        onClick={() => onMoveSectionUp && onMoveSectionUp(index)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-white hover:bg-white/20 rounded cursor-pointer transition-colors bg-transparent border-0 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        title="Move Down"
                        disabled={index === allSections.length - 1}
                        onClick={() => onMoveSectionDown && onMoveSectionDown(index)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-white hover:bg-white/20 rounded cursor-pointer transition-colors bg-transparent border-0 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                      <button
                        title="Duplicate"
                        onClick={() => onDuplicateSection && onDuplicateSection(index)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-white hover:bg-white/20 rounded cursor-pointer transition-colors bg-transparent border-0"
                      >
                        📋
                      </button>
                      <button
                        title="Toggle Visibility"
                        onClick={() => onToggleVisibility && onToggleVisibility(index)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-white hover:bg-white/20 rounded cursor-pointer transition-colors bg-transparent border-0"
                      >
                        👁️
                      </button>
                      <button
                        title="Delete Section"
                        onClick={() => onDeleteSection && onDeleteSection(index)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer transition-colors bg-transparent border-0"
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
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 text-center p-8">
                <p className="text-5xl mb-4 opacity-40">📄</p>
                <p className="text-lg font-medium mb-2">
                  No sections added yet
                </p>
                <p className="text-sm opacity-70">
                  Use the sidebar to add sections to your careers page
                </p>
              </div>
            )}
          </main>

          {/* Footer */}
          <div
            ref={footerRef}
            className={`relative group transition-all duration-200 border-2 border-transparent hover:border-blue-400/50 ${
              brandingFocusArea === 'footer' ? 'border-2 border-blue-600 shadow-lg z-10' : ''
            }`}
          >
            <Footer company={company} />
          </div>
        </div>
      </div>
    </div>
  );
}
