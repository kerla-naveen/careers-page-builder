import React, { useEffect, useState } from 'react';

export default function HeroSection({ content, bannerUrl }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative w-full min-h-[80vh] md:min-h-[90vh] bg-cover bg-center md:bg-fixed flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${bannerUrl})` }}
    >
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-black/70 via-black/40 to-[color-mix(in_srgb,var(--brand-primary)_30%,transparent)]"></div>
      <div
        className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-[3] w-full max-w-[1200px] mx-auto px-4 sm:px-8 flex justify-start py-12">
        <div
          className={`max-w-[640px] w-full p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-[20px] bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          {content?.badgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] text-white rounded-full text-xs font-semibold mb-6 uppercase tracking-wider shadow-lg">
              <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"></span>
              {content.badgeText}
            </div>
          )}

          <h1 className="font-outfit text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight break-words">
            {content?.headline || 'Build Your Career With Us'}
          </h1>

          <p className="text-sm sm:text-lg text-white/85 mb-8 max-w-[520px] leading-relaxed font-inter">
            {content?.tagline || 'Join our team and shape the future.'}
          </p>

          {content?.ctaText && (
            <button
              className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl overflow-hidden"
              onClick={() => {
                document
                  .getElementById('jobs-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {content.ctaText}
              <span className="transition-transform duration-300 group-hover:translate-x-1 text-lg">→</span>
            </button>
          )}

          {content?.stats && content.stats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
              {content.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex-1 p-3.5 sm:p-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl text-center animate-fade-in-up"
                  style={{ animationDelay: `${0.6 + idx * 0.15}s` }}
                >
                  <span className="block font-outfit text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    {stat.value}
                  </span>
                  <span className="block text-xs text-white/65 uppercase tracking-widest mt-1 font-medium font-inter">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

