import React, { useEffect, useRef, useState } from 'react';

export default function CultureSection({ content, title, subtitle }) {
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

  if (!content?.values || content.values.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 md:px-8 bg-gradient-to-b from-white/5 to-[var(--brand-bg)] flex justify-center">
      <div className="max-w-[1100px] w-full mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-10 md:mb-16 max-w-[680px] mx-auto transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {subtitle && (
            <span className="block text-sm font-semibold text-[var(--brand-primary)] uppercase tracking-widest mb-3">
              {subtitle}
            </span>
          )}
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-text)] tracking-tight mb-6">
            {title || 'Our Culture & Values'}
          </h2>
          {content.description && (
            <p className="text-base sm:text-lg leading-relaxed text-[var(--brand-text)] opacity-75 font-inter">
              {content.description}
            </p>
          )}
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {content.values.map((value, idx) => (
            <div
              key={idx}
              className={`p-6 md:p-8 bg-white/85 backdrop-blur-md border border-black/5 rounded-2xl shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg hover:border-l-4 hover:border-l-[var(--brand-primary)] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${0.1 + idx * 0.08}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] mb-5">
                <span className="text-2xl leading-none">{value.icon}</span>
              </div>
              <h3 className="font-outfit text-lg md:text-xl font-semibold text-[var(--brand-text)] mb-3 tracking-tight">
                {value.name}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--brand-text)] opacity-70 m-0 font-inter">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

