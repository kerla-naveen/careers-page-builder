import React, { useEffect, useRef, useState } from 'react';
import styles from './AboutSection.module.css';

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/);
  return match ? match[1] : null;
}

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
          // Extract number from value string
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
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              const current = Math.floor(target * eased);
              const formatted = hasComma ? current.toLocaleString() : current.toString();
              setDisplay(`${prefix}${formatted}${suffix}`);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplay(value); // ensure final value is exact
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
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible);
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
    <section ref={sectionRef} className={styles.about}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          <h2 className={styles.title}>{title || 'Who We Are'}</h2>
        </div>

        {/* Main content area */}
        <div className={`${styles.content} ${hasMedia ? styles.twoColumn : styles.singleColumn}`}>
          {/* Story column */}
          <div className={styles.storyColumn}>
            <div className={styles.accentBar}></div>
            <div className={styles.storyText}>
              {paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={idx === 0 ? styles.leadParagraph : styles.paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
              >
                Visit our website
                <span className={styles.linkArrow}>→</span>
              </a>
            )}
          </div>

          {/* Media column */}
          {hasMedia && (
            <div className={styles.mediaColumn}>
              <div className={styles.videoWrapper}>
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  title="Company video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.videoIframe}
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        {content.stats && content.stats.length > 0 && (
          <div className={styles.statsRow}>
            {content.stats.map((stat, idx) => (
              <div key={idx} className={styles.statItem}>
                <span className={styles.statValue}>
                  <AnimatedCounter value={stat.value} />
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
