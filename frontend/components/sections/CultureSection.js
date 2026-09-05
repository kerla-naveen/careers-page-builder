import React, { useEffect, useRef } from 'react';
import styles from './CultureSection.module.css';

export default function CultureSection({ content, title, subtitle }) {
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

  if (!content?.values || content.values.length === 0) return null;

  return (
    <section ref={sectionRef} className={styles.culture}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          <h2 className={styles.title}>{title || 'Our Culture & Values'}</h2>
          {content.description && (
            <p className={styles.description}>{content.description}</p>
          )}
        </div>

        {/* Values Grid */}
        <div className={styles.grid}>
          {content.values.map((value, idx) => (
            <div
              key={idx}
              className={styles.card}
              style={{ transitionDelay: `${0.1 + idx * 0.08}s` }}
            >
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{value.icon}</span>
              </div>
              <h3 className={styles.valueName}>{value.name}</h3>
              <p className={styles.valueDesc}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
