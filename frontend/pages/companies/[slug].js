import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSection from '../../components/sections/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import CultureSection from '../../components/sections/CultureSection';
import PerksSection from '../../components/sections/PerksSection';
import JobsSection from '../../components/sections/JobsSection';
import TeamSection from '../../components/sections/TeamSection';
import TestimonialsSection from '../../components/sections/TestimonialsSection';
import FaqSection from '../../components/sections/FaqSection';
import CtaSection from '../../components/sections/CtaSection';
import GallerySection from '../../components/sections/GallerySection';
import { generateCompanySchema } from '../../utils/seoHelper';

export default function CompanyPage({ company, jobs, error }) {
  if (error) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'sans-serif', background: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Careers Page Unavailable</h1>
        <p style={{ color: '#94a3b8' }}>{error}</p>
      </div>
    );
  }

  // Dynamic CSS Variables based on company brand theme
  const brandStyles = {
    '--brand-primary': company.primaryColor || '#2563eb',
    '--brand-accent': company.accentColor || '#3b82f6',
    '--brand-bg': company.backgroundColor || '#0f172a',
    '--brand-text': company.textColor || '#f8fafc',
    '--brand-radius': company.borderRadius || '16px',
    fontFamily: company.fontFamily ? `'${company.fontFamily}', sans-serif` : "'Outfit', sans-serif",
  };

  // Generate JSON-LD Schema for Organization
  const jsonLd = generateCompanySchema(company, jobs);

  // Page Meta Information
  const pageTitle = `${company.name} Careers — Open Jobs & Company Culture`;
  const metaDesc = company.description || `Explore open roles, benefits, culture, and career opportunities at ${company.name}.`;
  const heroBanner = company.bannerUrl || company.logoUrl;

  const displaySections = (company.publishedSections && company.publishedSections.length > 0)
    ? company.publishedSections
    : (company.sections || []);

  // Helper to render sections dynamically
  const renderSection = (section, index) => {
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
      case 'TEAM':
        return (
          <TeamSection
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            content={section.content}
          />
        );
      case 'TESTIMONIALS':
        return (
          <TestimonialsSection
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            content={section.content}
          />
        );
      case 'FAQ':
        return (
          <FaqSection
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            content={section.content}
          />
        );
      case 'CTA':
        return (
          <CtaSection
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            content={section.content}
          />
        );
      case 'GALLERY':
        return (
          <GallerySection
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            content={section.content}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={brandStyles} className="min-h-screen">
      <Head>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDesc} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={`${company.name} Careers`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        {heroBanner && <meta property="og:image" content={heroBanner} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        {heroBanner && <meta name="twitter:image" content={heroBanner} />}

        {/* JSON-LD Structured Data */}
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </Head>

      <Header company={company} />

      <main>
        {displaySections.map((section, index) => renderSection(section, index))}
      </main>

      <Footer company={company} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const companyRes = await fetch(`http://127.0.0.1:5000/api/companies/${slug}`);
    const companyData = await companyRes.json();

    if (!companyRes.ok || !companyData.success) {
      return {
        props: {
          error: companyData.error || 'Failed to fetch company',
        },
      };
    }

    const jobsRes = await fetch(`http://127.0.0.1:5000/api/companies/${slug}/jobs`);
    const jobsData = await jobsRes.json();

    return {
      props: {
        company: companyData.data,
        jobs: jobsData.data || [],
      },
    };
  } catch (err) {
    console.error('Error fetching data:', err);
    return {
      props: {
        error: 'Failed to fetch data from backend. Is the server running on port 5000?',
      },
    };
  }
}
