import React from 'react';

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
    <section className="py-20 px-6 sm:px-8 bg-transparent text-[var(--brand-text,#f8fafc)]" id="team-section">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto mb-14">
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold mb-3 text-[var(--brand-text,#f8fafc)] tracking-tight">
            {title || 'Meet the Leadership Team'}
          </h2>
          {subtitle && <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-inter">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary,#6366f1)]">
              <img
                src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-5 border-[3px] border-[var(--brand-primary,#6366f1)] shadow-md"
              />
              <h3 className="font-outfit text-xl font-semibold text-[var(--brand-text,#f8fafc)] mb-1">{member.name}</h3>
              <p className="font-inter text-sm text-[var(--brand-primary,#818cf8)] font-medium mb-3">{member.role}</p>
              {member.bio && <p className="font-inter text-sm text-slate-400 leading-relaxed">{member.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

