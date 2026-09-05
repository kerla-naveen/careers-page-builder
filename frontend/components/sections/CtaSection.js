import React from 'react';
import styles from './CtaSection.module.css';

export default function CtaSection({ title, subtitle, content }) {
  const ctaText = content?.buttonText || 'Explore Open Roles';
  const ctaLink = content?.buttonLink || '#jobs-section';

  return (
    <section className={styles.ctaSection} id="cta-section">
      <div className={styles.container}>
        <h2 className={styles.title}>{title || 'Ready to Shape the Future with Us?'}</h2>
        <p className={styles.subtitle}>
          {subtitle || 'Discover your next career milestone and join a team that values your growth and impact.'}
        </p>

        <div className={styles.buttonGroup}>
          <a href={ctaLink} className={styles.primaryBtn}>
            {ctaText} 🚀
          </a>
        </div>
      </div>
    </section>
  );
}
