import React, { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';

export default function HeroSection({ content, bannerUrl }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.classList.add(styles.visible);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      style={{ backgroundImage: `url(${bannerUrl})` }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.grain}></div>

      <div className={styles.container}>
        <div className={styles.contentBox}>
          {content?.badgeText && (
            <div className={styles.badge}>
              <span className={styles.badgePulse}></span>
              {content.badgeText}
            </div>
          )}

          <h1 className={styles.headline}>
            {content?.headline || 'Build Your Career With Us'}
          </h1>

          <p className={styles.tagline}>
            {content?.tagline || 'Join our team and shape the future.'}
          </p>

          {content?.ctaText && (
            <button
              className={styles.ctaButton}
              onClick={() => {
                document
                  .getElementById('jobs-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {content.ctaText}
              <span className={styles.ctaArrow}>→</span>
            </button>
          )}

          {content?.stats && content.stats.length > 0 && (
            <div className={styles.statsRow}>
              {content.stats.map((stat, idx) => (
                <div key={idx} className={styles.statCard} style={{ animationDelay: `${0.6 + idx * 0.15}s` }}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
