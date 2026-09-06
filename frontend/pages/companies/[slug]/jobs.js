import React from 'react';
import Head from 'next/head';
import { API_BASE } from '../../../utils/apiConfig';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import JobsSection from '../../../components/sections/JobsSection';
import { generateJobListSchema } from '../../../utils/seoHelper';

export default function DedicatedJobsPage({ company, jobs, error }) {
  if (error) {
    return (
      <div style={{ padding: '3rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1>Error Loading Roles</h1>
        <p>{error}</p>
        <Link href="/">Back to Home</Link>
      </div>
    );
  }

  const brandStyles = {
    '--brand-primary': company.primaryColor || '#2563eb',
    '--brand-accent': company.accentColor || '#3b82f6',
    '--brand-bg': company.backgroundColor || '#FAFAF9',
    '--brand-text': company.textColor || '#18181B',
  };

  // Generate JSON-LD Schema for Job Postings list
  const jsonLdings = generateJobListSchema(company, jobs);

  const pageTitle = `Open Roles & Vacancies — ${company.name} Careers`;
  const metaDesc = `Browse ${jobs.length || ''} open job positions at ${company.name}. Filter by department, workplace policy, and location. Apply today!`;
  const heroBanner = company.bannerUrl || company.logoUrl;

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

        {/* JSON-LD Structured Data for Google Job Indexing (JobPosting / ItemList) */}
        {jsonLdings && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdings) }}
          />
        )}
      </Head>

      <Header company={company} />

      <main style={{ background: 'var(--brand-bg)', minHeight: '80vh', paddingTop: '2rem' }}>
        {/* Breadcrumb Navigation Header */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link
              href={`/companies/${company.slug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--brand-accent)',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              ← Back to {company.name} Careers Landing Page
            </Link>
          </div>
        </div>

        {/* Jobs Section Component wired to filtered GET API route */}
        <JobsSection
          title={`All Open Roles at ${company.name}`}
          subtitle="Search, filter, and discover your next role."
          jobs={jobs}
          companySlug={company.slug}
        />
      </main>

      <Footer company={company} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const { query } = context;

  try {
    const companyRes = await fetch(`${API_BASE}/companies/${slug}`);
    const companyData = await companyRes.json();

    if (!companyRes.ok || !companyData.success) {
      return {
        props: {
          error: companyData.error || 'Failed to fetch company details',
        },
      };
    }

    // Pass initial URL query parameters to backend API
    const queryString = new URLSearchParams(query).toString();
    const jobsRes = await fetch(
      `${API_BASE}/companies/${slug}/jobs?${queryString}`
    );
    const jobsData = await jobsRes.json();

    return {
      props: {
        company: companyData.data,
        jobs: jobsData.data || [],
      },
    };
  } catch (err) {
    console.error('Error fetching jobs sub-page data:', err);
    return {
      props: {
        error: 'Failed to connect to backend server.',
      },
    };
  }
}
