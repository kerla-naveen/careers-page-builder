import React, { useEffect, useRef, useState } from 'react';

export default function PerksSection({ content, title, subtitle }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!content?.perks || content.perks.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-[var(--brand-bg,#0f172a)] to-[color-mix(in_srgb,var(--brand-bg,#0f172a)_95%,black)] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-14 transition-all duration-600 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {subtitle && (
            <span className="inline-block font-inter text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--brand-accent,#38bdf8)] mb-2">
              {subtitle}
            </span>
          )}
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-text,#f8fafc)] m-0 leading-tight">
            {title || 'Perks & Benefits'}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[var(--brand-primary,#6366f1)] to-[var(--brand-accent,#38bdf8)] rounded-full mx-auto mt-4"></div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {content.perks.map((perk, idx) => (
            <div
              key={idx}
              className={`group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 transition-all duration-500 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--brand-primary,#6366f1)_40%,transparent)] hover:shadow-2xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
              }`}
              style={{ transitionDelay: `${0.05 + idx * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[color-mix(in_srgb,var(--brand-primary,#6366f1)_25%,transparent)] to-[color-mix(in_srgb,var(--brand-accent,#38bdf8)_15%,transparent)] border border-[color-mix(in_srgb,var(--brand-primary,#6366f1)_30%,transparent)] flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="flex items-center justify-center">{perk.icon}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-outfit text-xl font-semibold text-[var(--brand-text,#f8fafc)] m-0">{perk.title}</h3>
                <p className="font-inter text-sm leading-relaxed text-[color-mix(in_srgb,var(--brand-text,#f8fafc)_75%,transparent)] m-0">{perk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

