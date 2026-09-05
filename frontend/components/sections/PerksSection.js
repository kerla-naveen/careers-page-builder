import React, { useEffect, useRef } from 'react';
import styles from './PerksSection.module.css';

export default function PerksSection({ content, title, subtitle }) {
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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!content?.perks || content.perks.length === 0) return null;

  return (
    <section ref={sectionRef} className={styles.perks}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          <h2 className={styles.title}>{title || 'Perks & Benefits'}</h2>
          <div className={styles.titleAccent}></div>
        </div>

        {/* Perks Grid */}
        <div className={styles.grid}>
          {content.perks.map((perk, idx) => (
            <div
              key={idx}
              className={styles.card}
              style={{ transitionDelay: `${0.05 + idx * 0.05}s` }}
            >
              <div className={styles.iconBox}>
                <span className={styles.icon}>{perk.icon}</span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.perkTitle}>{perk.title}</h3>
                <p className={styles.perkDesc}>{perk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
