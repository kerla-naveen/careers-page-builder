import React from 'react';

export default function CtaSection({ title, subtitle, content }) {
  const ctaText = content?.buttonText || 'Explore Open Roles';
  const ctaLink = content?.buttonLink || '#jobs-section';

  return (
    <section className="py-24 px-6 sm:px-8 bg-gradient-to-br from-indigo-500/15 to-indigo-700/5 border-y border-indigo-500/20 text-[var(--brand-text,#f8fafc)] text-center" id="cta-section">
      <div className="max-w-[800px] mx-auto">
        <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-[var(--brand-text,#f8fafc)] tracking-tight">
          {title || 'Ready to Shape the Future with Us?'}
        </h2>
        <p className="font-inter text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
          {subtitle || 'Discover your next career milestone and join a team that values your growth and impact.'}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href={ctaLink} className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--brand-primary,#6366f1)] to-[var(--brand-accent,#4f46e5)] text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/50 no-underline">
            {ctaText} 🚀
          </a>
        </div>
      </div>
    </section>
  );
}

