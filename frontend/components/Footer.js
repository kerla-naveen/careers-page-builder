import React from 'react';
import styles from './Footer.module.css';

export default function Footer({ company }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brandInfo}>
            <span className={styles.brandName}>{company.name}</span>
            <p className={styles.tagline}>
              {company.description || 'Join us and build the future.'}
            </p>
          </div>
          <div className={styles.links}>
            <a href={company.website} target="_blank" rel="noopener noreferrer">Company Website</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} {company.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
