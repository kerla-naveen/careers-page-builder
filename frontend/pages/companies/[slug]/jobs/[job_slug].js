import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

export default function JobDetailPage({ company, job, error }) {
  if (error || !job) {
    return (
      <div className="p-16 px-6 font-sans text-center bg-slate-950 text-slate-50 min-h-screen">
        <h1 className="text-3xl mb-4 font-bold">Job Posting Not Found</h1>
        <p className="text-slate-400 mb-8">{error || 'The job position you are looking for does not exist or has been removed.'}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl no-underline font-semibold hover:bg-indigo-700 transition-colors"
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
    <div style={brandStyles} className="min-h-screen bg-[var(--brand-bg,#0b0f19)] text-[var(--brand-text,#f8fafc)] flex flex-col">
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

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20 w-full">
        {/* Navigation Breadcrumbs */}
        <div className="mb-5">
          <Link href={`/companies/${company.slug}/careers`} className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[var(--brand-accent,#38bdf8)] no-underline transition-all hover:opacity-85 hover:-translate-x-1 [&_svg]:w-4 [&_svg]:h-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to {company.name} Careers Page
          </Link>
        </div>

        {/* Job Header Hero Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 mb-7 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/20 text-[var(--brand-accent,#38bdf8)] border border-indigo-500/40">{job.department}</span>
            <span className="font-sans text-xs text-slate-400">
              📅 {job.posted_days_ago === 0 ? 'Posted Today' : `Posted ${job.posted_days_ago} days ago`}
            </span>
          </div>

          <h1 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--brand-text,#f8fafc)] m-0 mb-5 leading-tight">{job.title}</h1>

          {/* Role Specs / Attributes Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {job.location && (
              <div className="bg-white/[0.03] border border-white/5 p-2.5 px-4 rounded-xl flex flex-col gap-1">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400">Location</span>
                <span className="font-sans text-sm font-semibold text-[var(--brand-text,#f8fafc)]">📍 {job.location}</span>
              </div>
            )}

            {job.work_policy && (
              <div className="bg-white/[0.03] border border-white/5 p-2.5 px-4 rounded-xl flex flex-col gap-1">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workplace</span>
                <span className="font-sans text-sm font-semibold text-[var(--brand-text,#f8fafc)]">🏢 {job.work_policy}</span>
              </div>
            )}

            {job.employment_type && (
              <div className="bg-white/[0.03] border border-white/5 p-2.5 px-4 rounded-xl flex flex-col gap-1">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400">Employment Type</span>
                <span className="font-sans text-sm font-semibold text-[var(--brand-text,#f8fafc)]">⏳ {job.employment_type}</span>
              </div>
            )}

            {job.experience_level && (
              <div className="bg-white/[0.03] border border-white/5 p-2.5 px-4 rounded-xl flex flex-col gap-1">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400">Experience Level</span>
                <span className="font-sans text-sm font-semibold text-[var(--brand-text,#f8fafc)]">🎯 {job.experience_level}</span>
              </div>
            )}

            {job.salary_range && (
              <div className="bg-emerald-400/5 border border-emerald-400/20 p-2.5 px-4 rounded-xl flex flex-col gap-1">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400">Salary Range</span>
                <span className="font-sans text-sm font-semibold text-emerald-400">💰 {job.salary_range}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Detailed Explanation Column */}
          <div className="flex flex-col gap-8">
            {/* Job Description */}
            <div className="bg-white/[0.025] backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="font-outfit text-xl font-bold text-[var(--brand-text,#f8fafc)] m-0 mb-6 flex items-center gap-3">
                <span className="text-xl">📋</span>
                Detailed Job Overview & Description
              </h2>
              <div className="font-sans text-base leading-relaxed text-slate-300">
                {job.description ? (
                  job.description.split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <br key={idx} />;
                    if (trimmed.startsWith('###')) {
                      return <h3 key={idx} className="text-lg font-bold mt-5 mb-2 text-[var(--brand-primary,#6366f1)]">{trimmed.replace(/^###\s*/, '')}</h3>;
                    }
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                      return <li key={idx} className="ml-5 mb-1">{trimmed.replace(/^[\-\*]\s*/, '')}</li>;
                    }
                    return <p key={idx} className="mb-3 leading-relaxed">{trimmed}</p>;
                  })
                ) : (
                  <p>We are seeking a talented {job.title} to join our growing {job.department} team at {company.name}.</p>
                )}
              </div>
            </div>

            {/* Required Skills & Qualifications */}
            {requirementsList.length > 0 && (
              <div className="bg-white/[0.025] backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
                <h2 className="font-outfit text-xl font-bold text-[var(--brand-text,#f8fafc)] m-0 mb-6 flex items-center gap-3">
                  <span className="text-xl">⚡</span>
                  Required Skills & Qualifications
                </h2>
                <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
                  {requirementsList.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 font-sans text-sm leading-relaxed text-slate-300">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-400/20 text-[var(--brand-accent,#38bdf8)] font-bold text-xs shrink-0 mt-0.5">✓</span>
                      <span>{req.replace(/^[•\-\*]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 lg:sticky lg:top-8">
              <h3 className="font-outfit text-xl font-bold text-[var(--brand-text,#f8fafc)] m-0 mb-3">About {company.name}</h3>
              <p className="font-sans text-sm leading-relaxed text-slate-400 m-0 mb-6">
                {company.description || `${company.name} is building the future of innovation.`}
              </p>

              <div className="flex flex-col gap-3.5 border-t border-white/10 pt-5">
                {company.websiteUrl && (
                  <div className="flex items-center justify-between font-sans text-xs text-slate-400">
                    <span>Website:</span>
                    <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-accent,#38bdf8)] no-underline font-semibold">
                      {company.websiteUrl.replace(/^https?:\/\//, '')} ↗
                    </a>
                  </div>
                )}
                {job.department && (
                  <div className="flex items-center justify-between font-sans text-xs text-slate-400">
                    <span>Department:</span>
                    <strong className="text-slate-200">{job.department}</strong>
                  </div>
                )}
                {job.experience_level && (
                  <div className="flex items-center justify-between font-sans text-xs text-slate-400">
                    <span>Level:</span>
                    <strong className="text-slate-200">{job.experience_level}</strong>
                  </div>
                )}
              </div>

              {job.apply_url && (
                <div className="mt-6">
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3.5 px-5 text-center rounded-xl bg-[var(--brand-primary,#6366f1)] text-white font-sans text-sm font-semibold no-underline hover:opacity-90 hover:-translate-y-0.5 transition-all"
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
