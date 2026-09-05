import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Header.module.css';

export default function Header({ company, showRecruiterLink = false }) {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewJobsClick = () => {
    const el = document.getElementById('jobs-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/companies/${company.slug || 'workable'}#jobs-section`);
    }
  };

  const websiteUrl = company.websiteUrl || company.website;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href={`/companies/${company.slug || 'workable'}`} className={styles.logoLink}>
          <div className={styles.logoContainer}>
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={`${company.name} logo`} className={styles.logoImage} />
            ) : (
              <span className={styles.logoText}>{company.name}</span>
            )}
          </div>
        </Link>

        <nav className={styles.nav}>
          {showRecruiterLink && (
            <Link href={`/dashboard/${company.slug || 'workable'}`} className={styles.navLink} style={{ color: 'var(--brand-accent)' }}>
              ⚙️ Studio
            </Link>
          )}

          {websiteUrl && (
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className={styles.navLink}>
              Company Site ↗
            </a>
          )}

          <button className={styles.navButton} onClick={handleViewJobsClick}>
            View All Openings
          </button>
        </nav>
      </div>
    </header>
  );
}
