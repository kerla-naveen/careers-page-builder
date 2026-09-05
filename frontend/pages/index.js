import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function HomePage({ companies }) {
  const pageTitle = 'Careers Page Builder — Modern Employer Branding & Job Portals';
  const metaDesc = 'Build branded, high-converting careers pages and candidate experiences. Explore demo company career portals for Workable, Ashby, and Whitecarrot.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Careers Page Builder',
    url: 'https://careers.example.com',
    description: metaDesc,
  };

  return (
    <div style={{ background: '#0b0f19', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818cf8',
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1.5rem',
          }}
        >
          ✨ Careers Page Builder Platform
        </span>

        <h1
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: '800',
            lineHeight: 1.15,
            margin: '0 0 1.5rem 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          High-Converting Careers Pages for Modern Companies
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 3.5rem', lineHeight: 1.6 }}>
          Explore live demo careers pages with real-time job filtering, rich company culture sections, and Google Job Indexing (JSON-LD) optimization.
        </p>

        {/* Demo Companies Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {companies.map((c) => (
            <div
              key={c.slug}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
              }}
            >
              <div>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <img src={c.logoUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#f8fafc' }}>
                  {c.name}
                </h2>
                <p style={{ fontSize: '0.925rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                  {c.description}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link
                  href={`/companies/${c.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justify: 'center',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    background: c.primaryColor || '#6366f1',
                    color: '#ffffff',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                  }}
                >
                  View Careers Page →
                </Link>
                <Link
                  href={`/companies/${c.slug}/jobs`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justify: 'center',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontWeight: 500,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  All Open Positions Sub-Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const slugs = ['workable', 'ashby', 'whitecarrot'];
    const companies = [];

    for (const slug of slugs) {
      const res = await fetch(`http://127.0.0.1:5000/api/companies/${slug}`);
      const data = await res.json();
      if (data.success) {
        companies.push(data.data);
      }
    }

    return {
      props: {
        companies,
      },
    };
  } catch (err) {
    console.error('Error fetching home page companies:', err);
    return {
      props: {
        companies: [],
      },
    };
  }
}
