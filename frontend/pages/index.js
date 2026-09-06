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
    <div className="bg-slate-950 text-slate-50 min-h-screen font-sans">
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

      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            ⚡
          </div>
          <span className="font-outfit font-bold text-lg text-slate-50">
            Careers Builder
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-slate-400 no-underline text-sm font-medium hover:text-slate-200 transition-colors"
          >
            Recruiter Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white no-underline text-sm font-semibold shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all"
          >
            Register Company Page →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
          ✨ Careers Page Builder Platform
        </span>

        <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          High-Converting Careers Pages for Modern Companies
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed">
          Explore live demo careers pages with real-time job filtering, rich company culture sections, and Google Job Indexing (JSON-LD) optimization.
        </p>

        {/* Demo Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map((c) => (
            <div
              key={c.slug}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-left flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className="w-14 h-14 rounded-xl overflow-hidden mb-5">
                  <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="font-outfit text-2xl font-bold mb-2 text-slate-50">
                  {c.name}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {c.description}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/companies/${c.slug}/careers`}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold no-underline text-sm hover:bg-indigo-700 transition-colors"
                  style={{ backgroundColor: c.primaryColor || '#6366f1' }}
                >
                  View Careers Page →
                </Link>
                <Link
                  href={`/companies/${c.slug}/jobs`}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium no-underline text-xs hover:bg-white/10 transition-colors"
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
