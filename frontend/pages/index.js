import React from 'react';
import Head from 'next/head';
import { API_BASE } from '../utils/apiConfig';
import Link from 'next/link';
import CompanyLogoIcon from '../components/CompanyLogoIcon';

export default function HomePage({ companies }) {
  const pageTitle = 'Career Page Builder — Build & Showcase Company Careers';
  const metaDesc = 'Create, customize, and showcase your open job positions with custom employer branding, real-time editing, and SEO optimization.';

  return (
    <div className="bg-[#FAFAF9] text-[#18181B] min-h-screen font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Head>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E4E4E7] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#18181B] text-white flex items-center justify-center font-bold text-xs">
              ✦
            </div>
            <span className="font-outfit font-bold text-base tracking-tight text-[#18181B]">
              Career Page Builder
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#71717A] hover:text-[#18181B] px-3.5 py-2 transition-colors no-underline"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-all no-underline shadow-sm"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-5">
            CAREER PAGE BUILDER
          </span>

          <h1 className="font-outfit text-4xl sm:text-5xl font-extrabold text-[#18181B] tracking-tight leading-[1.15] mb-5">
            Build a careers page that represents your company.
          </h1>

          <p className="font-inter text-base text-[#71717A] leading-relaxed mb-8 max-w-xl mx-auto">
            Create, customize, and showcase your open positions in one place. Real-time visual editing, job status management, and custom employer branding.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all no-underline shadow-sm hover:shadow-md"
            >
              Create Career Page →
            </Link>
            <Link
              href="/workable/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#18181B] bg-white border border-[#E4E4E7] hover:bg-zinc-50 px-5 py-3 rounded-lg transition-all no-underline shadow-xs"
            >
              Manage Jobs Portal
            </Link>
          </div>
        </div>

        {/* Product Preview Window Frame */}
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl border border-[#E4E4E7] shadow-xl overflow-hidden mb-24">
          {/* Mac-style Window Bar */}
          <div className="bg-[#F4F4F5] border-b border-[#E4E4E7] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444] opacity-80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B] opacity-80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#10B981] opacity-80 inline-block" />
            </div>
            <div className="bg-white border border-[#E4E4E7] rounded-md px-4 py-1 text-[11px] font-mono text-[#71717A] flex items-center gap-1.5 shadow-xs">
              <span className="text-zinc-400">https://</span>careers.yourcompany.com
            </div>
            <div className="w-12" />
          </div>

          {/* Realistic Product Interface Mockup */}
          <div className="p-8 bg-[#FAFAF9]">
            <div className="bg-white rounded-lg border border-[#E4E4E7] p-6 shadow-xs mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-base">
                    W
                  </div>
                  <div>
                    <h3 className="font-outfit text-base font-bold text-[#18181B]">Workable Careers</h3>
                    <p className="text-xs text-[#71717A]">Building modern recruitment software & HR tech.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Preview
                </span>
              </div>
            </div>

            {/* Preview Job Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Senior Backend Engineer', dept: 'Engineering', loc: 'Remote', type: 'Full-time' },
                { title: 'Product Designer', dept: 'Design', loc: 'San Francisco, CA', type: 'Full-time' },
                { title: 'Technical Recruiter', dept: 'People', loc: 'New York, NY', type: 'Full-time' },
              ].map((job, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-[#E4E4E7] p-4 text-left shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {job.dept}
                  </span>
                  <h4 className="font-outfit text-sm font-bold text-[#18181B] mt-2.5 mb-2">
                    {job.title}
                  </h4>
                  <div className="text-[11px] text-[#71717A] flex items-center gap-2">
                    <span>📍 {job.loc}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Presentation (01, 02, 03) */}
        <div className="border-t border-[#E4E4E7] pt-16 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div>
              <span className="font-mono text-xs font-bold text-blue-600 block mb-2">01</span>
              <h3 className="font-outfit text-base font-bold text-[#18181B] mb-2">
                Customize Branding
              </h3>
              <p className="font-inter text-sm text-[#71717A] leading-relaxed">
                Match your company brand colors, typography, header logo, and hero banner in real-time.
              </p>
            </div>

            <div>
              <span className="font-mono text-xs font-bold text-blue-600 block mb-2">02</span>
              <h3 className="font-outfit text-base font-bold text-[#18181B] mb-2">
                Manage Job Postings
              </h3>
              <p className="font-inter text-sm text-[#71717A] leading-relaxed">
                Create, status-track (Draft, Published, Closed), search, and filter open roles easily.
              </p>
            </div>

            <div>
              <span className="font-mono text-xs font-bold text-blue-600 block mb-2">03</span>
              <h3 className="font-outfit text-base font-bold text-[#18181B] mb-2">
                Instant Preview & Publish
              </h3>
              <p className="font-inter text-sm text-[#71717A] leading-relaxed">
                Test responsive desktop, tablet, and mobile views before publishing live to candidates.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Companies Quick Access Section */}
        {companies && companies.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E4E4E7] p-8 mb-20 text-left shadow-xs">
            <h3 className="font-outfit text-base font-bold text-[#18181B] mb-1">
              Explore Demo Portals
            </h3>
            <p className="text-xs text-[#71717A] mb-6">
              Select a pre-configured company portal to test the careers builder:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {companies.map((c) => (
                <div key={c.slug} className="border border-[#E4E4E7] rounded-lg p-4 flex flex-col justify-between bg-[#FAFAF9]">
                  <div className="flex items-center gap-3 mb-4">
                    <CompanyLogoIcon company={c} size="md" />
                    <div>
                      <h4 className="font-outfit text-sm font-bold text-[#18181B]">{c.name}</h4>
                      <p className="text-[11px] text-[#71717A] truncate max-w-[160px]">{c.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <Link
                      href={`/editor/${c.slug}`}
                      className="flex-1 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg transition-colors no-underline shadow-xs"
                    >
                      Open Editor
                    </Link>
                    <Link
                      href={`/companies/${c.slug}/careers`}
                      className="flex-1 text-center text-sm font-semibold text-[#18181B] bg-white border border-[#E4E4E7] hover:bg-zinc-100 py-2.5 rounded-lg transition-colors no-underline shadow-xs"
                    >
                      View Live Site
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Box */}
        <div className="text-center bg-white rounded-xl border border-[#E4E4E7] p-12 shadow-xs">
          <h2 className="font-outfit text-2xl font-bold text-[#18181B] mb-3">
            Ready to build your company careers page?
          </h2>
          <p className="text-sm text-[#71717A] max-w-md mx-auto mb-6">
            Get started in seconds with our recruiter portal.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all no-underline shadow-xs"
          >
            Create Your Career Page →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4E4E7] py-8 text-center text-xs text-[#71717A]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Career Page Builder. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-[#18181B] transition-colors no-underline">Recruiter Login</Link>
            <Link href="/workable/jobs" className="hover:text-[#18181B] transition-colors no-underline">Jobs Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const slugs = ['workable', 'ashby', 'whitecarrot'];
    const companies = [];

    for (const slug of slugs) {
      const res = await fetch(`${API_BASE}/companies/${slug}`);
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
