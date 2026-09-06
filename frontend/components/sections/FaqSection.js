import React from 'react';

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
    <section className="py-20 px-6 sm:px-8 bg-transparent text-[var(--brand-text,#f8fafc)]" id="faq-section">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold mb-3 text-[var(--brand-text,#f8fafc)] tracking-tight">
            {title || 'Frequently Asked Questions'}
          </h2>
          {subtitle && <p className="font-inter text-base sm:text-lg text-slate-400 leading-relaxed">{subtitle}</p>}
        </div>

        <div className="flex flex-col gap-5">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 transition-colors duration-200 hover:border-[var(--brand-primary,#6366f1)]/30">
              <h3 className="font-outfit text-lg font-semibold text-[var(--brand-text,#f8fafc)] mb-3 flex items-center gap-3">
                <span className="text-[var(--brand-primary,#6366f1)] text-xl">❓</span>
                {faq.question}
              </h3>
              <p className="font-inter text-sm sm:text-base text-slate-400 leading-relaxed pl-8">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

