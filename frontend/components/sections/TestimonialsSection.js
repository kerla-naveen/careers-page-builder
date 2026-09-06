import React from 'react';

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
    <section className="py-20 px-6 sm:px-8 bg-white/[0.015] text-[var(--brand-text,#f8fafc)]" id="testimonials-section">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto mb-14">
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold mb-3 text-[var(--brand-text,#f8fafc)] tracking-tight">
            {title || 'What Our Team Says'}
          </h2>
          {subtitle && <p className="font-inter text-base sm:text-lg text-slate-400 leading-relaxed">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary,#6366f1)]">
              <div className="text-5xl leading-none text-[var(--brand-primary,#6366f1)] opacity-30 -mb-4 font-serif">“</div>
              <p className="font-inter text-base text-slate-200 leading-relaxed italic mb-6 relative z-10">{item.quote}</p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                <img
                  src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-outfit text-sm font-semibold text-[var(--brand-text,#f8fafc)]">{item.author}</span>
                  <span className="font-inter text-xs text-slate-400">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

