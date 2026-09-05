import React from 'react';
import styles from './FaqSection.module.css';

export default function FaqSection({ title, subtitle, content }) {
  const faqs = content?.faqs || [
    {
      question: 'What is your interviewing process like?',
      answer: 'Our process typically consists of an initial recruiter chat, a technical/role assessment, a virtual onsite interview, and a final team match session.',
    },
    {
      question: 'Do you support fully remote work?',
      answer: 'Yes! We are a remote-first organization with flexible working hours and home office stipends for team members across regions.',
    },
    {
      question: 'What benefits and health coverage do you offer?',
      answer: 'We provide comprehensive health, dental, and vision insurance, 401(k) matching, wellness stipends, and generous paid time off.',
    },
  ];

  return (
    <section className={styles.faqSection} id="faq-section">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title || 'Frequently Asked Questions'}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        <div className={styles.list}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.item}>
              <h3 className={styles.question}>
                <span className={styles.qIcon}>❓</span>
                {faq.question}
              </h3>
              <p className={styles.answer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
