import React from 'react';
import styles from './Footer.module.css';

function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.49 1.49 0 1 0 0 2.98 1.49 1.49 0 0 0 0-2.98z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export default function Footer({ company }) {
  const currentYear = new Date().getFullYear();
  const websiteUrl = normalizeUrl(company.website);
  const linkedinUrl = normalizeUrl(company.socialLinks?.linkedin);
  const twitterUrl = normalizeUrl(company.socialLinks?.twitter);
  const githubUrl = normalizeUrl(company.socialLinks?.github);
  const glassdoorUrl = normalizeUrl(company.socialLinks?.glassdoor);
  const instagramUrl = normalizeUrl(company.socialLinks?.instagram);

  return (
    <footer className={styles.footer} id="company-footer">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brandInfo}>
            <span className={styles.brandName}>{company.name}</span>
            <p className={styles.tagline}>
              {company.description || 'Join us and build the future.'}
            </p>
          </div>

          <div className={styles.links}>
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Official Website">
                <GlobeIcon />
                <span>Website</span>
              </a>
            )}

            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="LinkedIn">
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
            )}

            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Twitter / X">
                <TwitterIcon />
                <span>Twitter</span>
              </a>
            )}

            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="GitHub">
                <GitHubIcon />
                <span>GitHub</span>
              </a>
            )}

            {glassdoorUrl && (
              <a href={glassdoorUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Glassdoor">
                <GlobeIcon />
                <span>Glassdoor</span>
              </a>
            )}

            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Instagram">
                <GlobeIcon />
                <span>Instagram</span>
              </a>
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
