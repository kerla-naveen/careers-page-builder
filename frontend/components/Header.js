import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCompanyWebsiteUrl } from '../utils/urlHelper';

import CompanyLogoIcon from './CompanyLogoIcon';

export default function Header({ company, showRecruiterLink = false }) {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewJobsClick = () => {
    const el = document.getElementById('jobs-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/companies/${company?.slug || 'workable'}#jobs-section`);
    }
  };

  const websiteUrl = getCompanyWebsiteUrl(company);

  return (
    <header
      className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 bg-transparent ${
        scrolled
          ? 'py-3.5 bg-[color-mix(in_srgb,var(--brand-bg,#0b0f19)_85%,transparent)] backdrop-blur-xl border-b border-[color-mix(in_srgb,var(--brand-text,#f8fafc)_12%,transparent)] shadow-2xl'
          : 'py-5'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
        <Link
          href={`/companies/${company?.slug || 'workable'}`}
          className="no-underline flex items-center transition-opacity hover:opacity-90"
        >
          <div className="flex items-center gap-3">
            <CompanyLogoIcon company={company} size="md" />
            <span className="font-outfit font-extrabold text-xl text-[var(--brand-text,#f8fafc)] tracking-tight">
              {company?.name}
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          {showRecruiterLink && (
            <Link
              href={`/dashboard/${company.slug || 'workable'}`}
              className="hidden sm:inline-flex font-inter text-sm font-medium text-[var(--brand-accent,#38bdf8)] hover:opacity-100 transition-all"
            >
              ⚙️ Studio
            </Link>
          )}

          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex font-inter text-sm font-medium text-[var(--brand-text,#f8fafc)] opacity-85 hover:opacity-100 hover:text-[var(--brand-accent,#38bdf8)] transition-all"
            >
              Company Site ↗
            </a>
          )}

          <button
            className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-inter font-semibold text-white bg-[var(--brand-primary,#6366f1)] border border-white/20 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 hover:brightness-110 shadow-md"
            onClick={handleViewJobsClick}
          >
            View All Openings
          </button>
        </nav>
      </div>
    </header>
  );
}

