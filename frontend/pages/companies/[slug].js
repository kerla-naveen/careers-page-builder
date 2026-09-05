import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSection from '../../components/sections/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import CultureSection from '../../components/sections/CultureSection';
import PerksSection from '../../components/sections/PerksSection';
import JobsSection from '../../components/sections/JobsSection';

export default function CompanyPage({ company, jobs, error }) {
  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Dynamic CSS Variables based on company brand theme
  const brandStyles = {
    '--brand-primary': company.primaryColor || '#2563eb',
    '--brand-accent': company.accentColor || '#3b82f6',
    '--brand-bg': company.backgroundColor || '#f8fafc',
    '--brand-text': company.textColor || '#0f172a',
  };

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
      default:
        return null;
    }
  };

  return (
    <div style={brandStyles} className="min-h-screen">
      <Head>
        <title>{company.name} Careers</title>
        <meta name="description" content={company.description || `Careers at ${company.name}`} />
      </Head>

      <Header company={company} />

      <main>
        {company.sections?.map((section, index) => renderSection(section, index))}
      </main>

      <Footer company={company} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const companyRes = await fetch(`http://127.0.0.1:5000/companies/${slug}`);
    const companyData = await companyRes.json();

    if (!companyRes.ok || !companyData.success) {
      return {
        props: {
          error: companyData.error || 'Failed to fetch company',
        },
      };
    }

    const jobsRes = await fetch(`http://127.0.0.1:5000/companies/${slug}/jobs`);
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
