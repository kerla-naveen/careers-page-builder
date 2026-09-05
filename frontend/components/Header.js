import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';

export default function Header({ company }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={`${company.name} logo`} className={styles.logoImage} />
          ) : (
            <span className={styles.logoText}>{company.name}</span>
          )}
        </div>
        <nav className={styles.nav}>
          <a href={company.website} target="_blank" rel="noopener noreferrer" className={styles.navLink}>
            Company Website
          </a>
          <button className={styles.navButton} onClick={() => {
            document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            View Jobs
          </button>
        </nav>
      </div>
    </header>
  );
}
