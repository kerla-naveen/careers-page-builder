import React from 'react';
import styles from './TestimonialsSection.module.css';

export default function TestimonialsSection({ title, subtitle, content }) {
  const testimonials = content?.testimonials || [
    {
      quote: "Joining this company was the best career decision I've made. The culture of autonomy and trust allows everyone to do their best work.",
      author: 'Marcus Vance',
      role: 'Senior Staff Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    {
      quote: 'The emphasis on work-life harmony and continuous learning here is genuine. I have grown immensely both professionally and personally.',
      author: 'Priya Sharma',
      role: 'Principal Product Manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className={styles.testimonialsSection} id="testimonials-section">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title || 'What Our Team Says'}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        <div className={styles.grid}>
          {testimonials.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.quoteMark}>“</div>
              <p className={styles.quote}>{item.quote}</p>
              <div className={styles.author}>
                <img
                  src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                  alt={item.author}
                  className={styles.avatar}
                />
                <div className={styles.authorInfo}>
                  <span className={styles.name}>{item.author}</span>
                  <span className={styles.role}>{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
