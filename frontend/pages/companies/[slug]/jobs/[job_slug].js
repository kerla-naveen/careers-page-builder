import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import { generateSingleJobSchema } from '../../../../utils/seoHelper';

export default function CandidateJobDetailPage({ company, job, error }) {
  const [applied, setApplied] = useState(false);
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    resumeUrl: '',
    coverLetter: '',
  });

  if (error || !job || !company) {
    return (
      <div style={{ padding: '4rem', fontFamily: 'sans-serif', textAlign: 'center', background: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
        <h1>Position Not Found</h1>
        <p>{error || 'The requested job posting could not be found.'}</p>
        <Link href="/" style={{ color: '#38bdf8' }}>Back to Home</Link>
      </div>
    );
  }

  const brandStyles = {
    '--brand-primary': company.primaryColor || '#2563eb',
    '--brand-accent': company.accentColor || '#3b82f6',
    '--brand-bg': company.backgroundColor || '#0f172a',
    '--brand-text': company.textColor || '#f8fafc',
    fontFamily: company.fontFamily ? `'${company.fontFamily}', sans-serif` : "'Outfit', sans-serif",
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    if (!formState.fullName || !formState.email) {
      alert('Please fill out your name and email address.');
      return;
    }
    setApplied(true);
  };

  // Generate JSON-LD Schema for JobPosting
  const jobSchema = generateSingleJobSchema(company, job);

  const pageTitle = `${job.title} — ${company.name} Careers`;
  const metaDesc = `Apply for ${job.title} (${job.department}) at ${company.name}. Location: ${job.location}. Salary: ${job.salary_range || 'Competitive'}.`;

  return (
    <div style={brandStyles} className="min-h-screen">
      <Head>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />

        {jobSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
          />
        )}
      </Head>

      <Header company={company} />

      <main style={{ background: 'var(--brand-bg)', color: 'var(--brand-text)', padding: '3rem 1.5rem', minHeight: '85vh' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '2rem' }}>
            <Link
              href={`/companies/${company.slug}/jobs`}
              style={{
                color: 'var(--brand-accent)',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              ← Back to All Roles at {company.name}
            </Link>
          </div>

          {/* Job Banner Header */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '2.5rem',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  background: 'color-mix(in srgb, var(--brand-primary) 20%, transparent)',
                  color: 'var(--brand-accent)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  border: '1px solid color-mix(in srgb, var(--brand-primary) 40%, transparent)',
                }}
              >
                {job.department}
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                {job.posted_days_ago === 0 ? 'Just posted' : typeof job.posted_days_ago === 'number' ? `${job.posted_days_ago} days ago` : job.posted_days_ago}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 1.25rem 0', lineHeight: 1.2 }}>
              {job.title}
            </h1>

            {/* Badges Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>
              {job.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.9 }}>
                  📍 <span>{job.location}</span>
                </div>
              )}
              {job.work_policy && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.9 }}>
                  🏢 <span>{job.work_policy}</span>
                </div>
              )}
              {job.employment_type && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.9 }}>
                  ⏱️ <span>{job.employment_type}</span>
                </div>
              )}
              {job.salary_range && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontWeight: 600 }}>
                  💰 <span>{job.salary_range}</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Content Section */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '20px',
              padding: '2.5rem',
              marginBottom: '2.5rem',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.7,
            }}
          >
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 1rem 0' }}>
              About The Role
            </h2>
            <div style={{ whiteSpace: 'pre-line', fontSize: '1.05rem', opacity: 0.9, marginBottom: '2rem' }}>
              {job.description}
            </div>

            {job.requirements && (
              <>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 700, margin: '2rem 0 1rem 0' }}>
                  Requirements & Qualifications
                </h2>
                <div style={{ whiteSpace: 'pre-line', fontSize: '1.05rem', opacity: 0.9 }}>
                  {job.requirements}
                </div>
              </>
            )}
          </div>

          {/* Candidate Application Form */}
          <div
            id="apply-form"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(16px)',
              border: '1px solid color-mix(in srgb, var(--brand-accent) 30%, transparent)',
              borderRadius: '20px',
              padding: '2.5rem',
            }}
          >
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              Apply for {job.title}
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', opacity: 0.75, margin: '0 0 2rem 0' }}>
              Submit your application details directly to the recruiting team at {company.name}.
            </p>

            {applied ? (
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '16px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#10b981' }}>
                  Application Submitted Successfully!
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', opacity: 0.9 }}>
                  Thank you, <strong>{formState.fullName}</strong>. The hiring team at {company.name} has received your application for <strong>{job.title}</strong> and will review it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', opacity: 0.8 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--brand-text)',
                        outline: 'none',
                        fontSize: '1rem',
                      }}
                      value={formState.fullName}
                      onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', opacity: 0.8 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--brand-text)',
                        outline: 'none',
                        fontSize: '1rem',
                      }}
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', opacity: 0.8 }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--brand-text)',
                        outline: 'none',
                        fontSize: '1rem',
                      }}
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', opacity: 0.8 }}>
                      Resume / LinkedIn URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--brand-text)',
                        outline: 'none',
                        fontSize: '1rem',
                      }}
                      value={formState.resumeUrl}
                      onChange={(e) => setFormState({ ...formState, resumeUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem', opacity: 0.8 }}>
                    Cover Letter / Additional Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us why you are interested in this position..."
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--brand-text)',
                      outline: 'none',
                      fontSize: '1rem',
                      resize: 'vertical',
                    }}
                    value={formState.coverLetter}
                    onChange={(e) => setFormState({ ...formState, coverLetter: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '0.95rem 2rem',
                    borderRadius: '12px',
                    background: 'var(--brand-primary)',
                    border: 'none',
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                    marginTop: '0.5rem',
                    boxShadow: '0 4px 14px color-mix(in srgb, var(--brand-primary) 35%, transparent)',
                  }}
                >
                  Submit Application →
                </button>
              </form>
            )}
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
          error: data.error || 'Job not found',
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
        error: 'Failed to connect to backend server.',
      },
    };
  }
}
