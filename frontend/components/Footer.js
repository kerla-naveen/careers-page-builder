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
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer">Official Website</a>
            )}
            {company.socialLinks?.linkedin && (
              <a href={company.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
            {company.socialLinks?.twitter && (
              <a href={company.socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter / X</a>
            )}
            {company.socialLinks?.github && (
              <a href={company.socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            )}
            {company.socialLinks?.glassdoor && (
              <a href={company.socialLinks.glassdoor} target="_blank" rel="noopener noreferrer">Glassdoor</a>
            )}
            {company.socialLinks?.instagram && (
              <a href={company.socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            )}
          </div>
        </div>
        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} {company.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
