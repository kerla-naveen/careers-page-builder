import React from 'react';
import styles from './GallerySection.module.css';

export default function GallerySection({ title, subtitle, content }) {
  const images = content?.images || [
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      caption: 'Team hackathon and collaboration space',
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
      caption: 'Annual engineering retreat',
    },
    {
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
      caption: 'Design thinking workshop',
    },
  ];

  return (
    <section className={styles.gallerySection} id="gallery-section">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title || 'Life at the Office & Remote'}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        <div className={styles.grid}>
          {images.map((img, index) => (
            <div key={index} className={styles.card}>
              <img src={img.url} alt={img.caption || 'Gallery photo'} className={styles.image} />
              {img.caption && <div className={styles.caption}>{img.caption}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
