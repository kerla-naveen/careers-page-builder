import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import JobsSection from '../../../components/sections/JobsSection';

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
    '--brand-bg': company.backgroundColor || '#0f172a',
    '--brand-text': company.textColor || '#f8fafc',
  };

  return (
    <div style={brandStyles} className="min-h-screen">
      <Head>
        <title>All Jobs & Roles — {company.name} Careers</title>
        <meta
          name="description"
          content={`Browse and apply for all open job opportunities at ${company.name}.`}
        />
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
    const companyRes = await fetch(`http://127.0.0.1:5000/api/companies/${slug}`);
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
      `http://127.0.0.1:5000/api/companies/${slug}/jobs?${queryString}`
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
        error: 'Failed to connect to backend server on port 5000.',
      },
    };
  }
}
