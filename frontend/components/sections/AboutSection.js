import React, { useEffect, useRef, useState } from 'react';
import { extractYouTubeId } from '../../utils/videoHelper';

function AnimatedCounter({ value, duration = 1500 }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numMatch = value.match(/[\d,.]+/);
          if (numMatch) {
            const numStr = numMatch[0].replace(/,/g, '');
            const target = parseFloat(numStr);
            const prefix = value.slice(0, value.indexOf(numMatch[0]));
            const suffix = value.slice(value.indexOf(numMatch[0]) + numMatch[0].length);
            const hasComma = numMatch[0].includes(',');
            const startTime = performance.now();

            const animate = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(target * eased);
              const formatted = hasComma ? current.toLocaleString() : current.toString();
              setDisplay(`${prefix}${formatted}${suffix}`);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplay(value);
              }
            };
            requestAnimationFrame(animate);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function AboutSection({ content, title, subtitle, videoUrl, website }) {
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!content?.story) return null;

  const paragraphs = content.story.split('\n').filter((p) => p.trim());
  const youtubeId = extractYouTubeId(videoUrl);
  const hasMedia = !!youtubeId;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 md:px-8 bg-[var(--brand-bg)] flex justify-center">
      <div className="max-w-[1100px] w-full mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-10 md:mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {subtitle && (
            <span className="block text-sm font-semibold text-[var(--brand-primary)] uppercase tracking-widest mb-3">
              {subtitle}
            </span>
          )}
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-text)] tracking-tight">
            {title || 'Who We Are'}
          </h2>
        </div>

        {/* Main content area */}
        <div
          className={`flex flex-col-reverse md:flex-row gap-8 md:gap-12 mb-16 transition-all duration-700 ease-out delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          } ${hasMedia ? '' : 'max-w-[800px] mx-auto'}`}
        >
          {/* Story column */}
          <div className="flex-1 flex gap-4 md:gap-6 min-w-0">
            <div className="hidden md:block shrink-0 w-1 rounded bg-gradient-to-b from-[var(--brand-primary)] via-[var(--brand-accent)] to-transparent"></div>
            <div className="flex-1">
              {paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'text-lg md:text-xl leading-relaxed text-[var(--brand-text)] mb-6 font-medium'
                      : 'text-base leading-relaxed text-[var(--brand-text)] opacity-80 mb-6'
                  }
                >
                  {paragraph}
                </p>
              ))}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] py-2 transition-all hover:gap-3"
                >
                  Visit our website
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
              )}
            </div>
          </div>

          {/* Media column */}
          {hasMedia && (
            <div className="flex-1 flex items-start min-w-0">
              <div className="w-full relative pb-[56.25%] rounded-2xl overflow-hidden shadow-xl border border-black/5">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  title="Company video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        {content.stats && content.stats.length > 0 && (
          <div
            className={`flex flex-col md:flex-row justify-center gap-4 md:gap-8 transition-all duration-700 ease-out delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            {content.stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex-1 md:max-w-[220px] text-left md:text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-0"
              >
                <span className="block font-outfit text-2xl md:text-4xl font-bold text-[var(--brand-primary)] tracking-tight leading-tight">
                  <AnimatedCounter value={stat.value} />
                </span>
                <span className="block text-xs text-[var(--brand-text)] opacity-60 uppercase tracking-widest mt-0 md:mt-2 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

