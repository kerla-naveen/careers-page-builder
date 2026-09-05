import React from 'react';
import styles from './TeamSection.module.css';

export default function TeamSection({ title, subtitle, content }) {
  const members = content?.members || [
    {
      name: 'Sarah Jenkins',
      role: 'Head of People & Culture',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      bio: 'Passionate about building inclusive, high-performing teams.',
    },
    {
      name: 'David Chen',
      role: 'VP of Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Scaling engineering teams and robust cloud architectures.',
    },
    {
      name: 'Elena Rostova',
      role: 'Lead Product Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Creating intuitive user experiences and design systems.',
    },
  ];

  return (
    <section className={styles.teamSection} id="team-section">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title || 'Meet the Leadership Team'}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        <div className={styles.grid}>
          {members.map((member, index) => (
            <div key={index} className={styles.card}>
              <img
                src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                alt={member.name}
                className={styles.avatar}
              />
              <h3 className={styles.name}>{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
              {member.bio && <p className={styles.bio}>{member.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
