import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import styles from './JobDetail.module.css';

export default function JobDetailPage({ company, job, error }) {
  if (error || !job) {
    return (
      <div style={{ padding: '4rem 1.5rem', fontFamily: 'sans-serif', textAlign: 'center', background: '#0b0f19', color: '#f8fafc', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Job Posting Not Found</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>{error || 'The job position you are looking for does not exist or has been removed.'}</p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: '#6366f1',
            color: '#ffffff',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // Inject Google Fonts dynamically
  const fontName = company.fontFamily || 'Inter';
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(
    / /g,
    '+'
  )}:wght@400;500;600;700;800&display=swap`;

  const brandStyles = {
    '--brand-primary': company.primaryColor || '#6366f1',
    '--brand-accent': company.accentColor || '#38bdf8',
    '--brand-bg': company.backgroundColor || '#0b0f19',
    '--brand-text': company.textColor || '#f8fafc',
    fontFamily: `"${fontName}", sans-serif`,
  };

  const pageTitle = `${job.title} — ${company.name} Careers`;
  const metaDesc = `Learn more about the ${job.title} position in ${job.department} at ${company.name}. Location: ${job.location || 'Multiple Locations'}, Workplace: ${job.work_policy || 'Flexible'}.`;
  const bannerImg = company.bannerUrl || company.logoUrl;

  // Requirements parsing
  const requirementsList = Array.isArray(job.requirements)
    ? job.requirements
    : typeof job.requirements === 'string'
    ? job.requirements.split('\n').filter((req) => req.trim().length > 0)
    : [];

  // Safely parse days count from integer or string ("40 days ago", "Posted today")
  const parseDaysAgo = (val) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : Math.max(0, val);
    const str = String(val).toLowerCase();
    if (str.includes('today') || str.includes('just')) return 0;
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const daysAgoNum = parseDaysAgo(job.posted_days_ago);
  const postedDateIso = new Date(Date.now() - daysAgoNum * 86400000).toISOString();

  // Schema.org JobPosting JSON-LD for Google Jobs indexing
  const jobPostingSchema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || metaDesc,
    identifier: {
      '@type': 'PropertyValue',
      name: company.name,
      value: job._id || job.job_slug,
    },
    datePosted: postedDateIso,
    employmentType: job.employment_type === 'Full-time' ? 'FULL_TIME' : 'PART_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: company.name,
      sameAs: company.websiteUrl || undefined,
      logo: company.logoUrl || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Remote',
      },
    },
    baseSalary: job.salary_range
      ? {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: {
            '@type': 'QuantitativeValue',
            value: job.salary_range,
            unitText: 'YEAR',
          },
        }
      : undefined,
  };

  return (
    <div style={brandStyles} className={styles.pageWrapper}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontUrl} rel="stylesheet" />

        {/* OpenGraph / Social */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        {bannerImg && <meta property="og:image" content={bannerImg} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        {bannerImg && <meta name="twitter:image" content={bannerImg} />}

        {/* Google Jobs Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />
      </Head>

      <Header company={company} />

      <main className={styles.mainContainer}>
        {/* Navigation Breadcrumbs */}
        <div className={styles.breadcrumbBar}>
          <Link href={`/companies/${company.slug}/careers`} className={styles.backLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to {company.name} Careers Page
          </Link>
        </div>

        {/* Job Header Hero Card */}
        <div className={styles.heroCard}>
          <div className={styles.heroHeaderTop}>
            <span className={styles.deptBadge}>{job.department}</span>
            <span className={styles.postedBadge}>
              📅 {job.posted_days_ago === 0 ? 'Posted Today' : `Posted ${job.posted_days_ago} days ago`}
            </span>
          </div>

          <h1 className={styles.jobTitle}>{job.title}</h1>

          {/* Role Specs / Attributes Bar */}
          <div className={styles.specGrid}>
            {job.location && (
              <div className={styles.specBox}>
                <span className={styles.specLabel}>Location</span>
                <span className={styles.specValue}>📍 {job.location}</span>
              </div>
            )}

            {job.work_policy && (
              <div className={styles.specBox}>
                <span className={styles.specLabel}>Workplace</span>
                <span className={styles.specValue}>🏢 {job.work_policy}</span>
              </div>
            )}

            {job.employment_type && (
              <div className={styles.specBox}>
                <span className={styles.specLabel}>Employment Type</span>
                <span className={styles.specValue}>⏳ {job.employment_type}</span>
              </div>
            )}

            {job.experience_level && (
              <div className={styles.specBox}>
                <span className={styles.specLabel}>Experience Level</span>
                <span className={styles.specValue}>🎯 {job.experience_level}</span>
              </div>
            )}

            {job.salary_range && (
              <div className={`${styles.specBox} ${styles.salaryBox}`}>
                <span className={styles.specLabel}>Salary Range</span>
                <span className={styles.specValue}>💰 {job.salary_range}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className={styles.contentLayout}>
          {/* Detailed Explanation Column */}
          <div className={styles.detailColumn}>
            {/* Job Description */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeading}>
                <span className={styles.headingIcon}>📋</span>
                Detailed Job Overview & Description
              </h2>
              <div className={styles.descriptionText}>
                {job.description ? (
                  job.description.split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <br key={idx} />;
                    if (trimmed.startsWith('###')) {
                      return <h3 key={idx} style={{ fontSize: '1.1rem', fontWeight: 700, margin: '1.25rem 0 0.5rem 0', color: 'var(--brand-primary, #6366f1)' }}>{trimmed.replace(/^###\s*/, '')}</h3>;
                    }
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                      return <li key={idx} style={{ marginLeft: '1.25rem', marginBottom: '0.25rem' }}>{trimmed.replace(/^[\-\*]\s*/, '')}</li>;
                    }
                    return <p key={idx} style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>{trimmed}</p>;
                  })
                ) : (
                  <p>We are seeking a talented {job.title} to join our growing {job.department} team at {company.name}.</p>
                )}
              </div>
            </div>

            {/* Required Skills & Qualifications */}
            {requirementsList.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionHeading}>
                  <span className={styles.headingIcon}>⚡</span>
                  Required Skills & Qualifications
                </h2>
                <ul className={styles.requirementsList}>
                  {requirementsList.map((req, idx) => (
                    <li key={idx} className={styles.reqItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <span>{req.replace(/^[•\-\*]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className={styles.sidebarColumn}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>About {company.name}</h3>
              <p className={styles.sidebarDesc}>
                {company.description || `${company.name} is building the future of innovation.`}
              </p>

              <div className={styles.sidebarMetaList}>
                {company.websiteUrl && (
                  <div className={styles.sidebarMetaItem}>
                    <span>Website:</span>
                    <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer">
                      {company.websiteUrl.replace(/^https?:\/\//, '')} ↗
                    </a>
                  </div>
                )}
                {job.department && (
                  <div className={styles.sidebarMetaItem}>
                    <span>Department:</span>
                    <strong>{job.department}</strong>
                  </div>
                )}
                {job.experience_level && (
                  <div className={styles.sidebarMetaItem}>
                    <span>Level:</span>
                    <strong>{job.experience_level}</strong>
                  </div>
                )}
              </div>

              {job.apply_url && (
                <div style={{ marginTop: '1.5rem' }}>
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sidebarApplyBtn}
                  >
                    Apply on Recruiter Portal ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer company={company} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug, job_slug } = context.params;

  try {
    const res = await fetch(`http://127.0.0.1:5000/api/companies/${slug}/jobs/${job_slug}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        props: {
          error: data.error || `Failed to fetch job '${job_slug}' for company '${slug}'`,
        },
      };
    }

    return {
      props: {
        company: data.data.company,
        job: data.data.job,
      },
    };
  } catch (err) {
    console.error('Error fetching job details:', err);
    return {
      props: {
        error: 'Unable to connect to backend service.',
      },
    };
  }
}
