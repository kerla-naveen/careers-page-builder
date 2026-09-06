import React from 'react';

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
    <section className="py-20 px-6 sm:px-8 bg-transparent text-[var(--brand-text,#f8fafc)]" id="gallery-section">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto mb-14">
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold mb-3 text-[var(--brand-text,#f8fafc)] tracking-tight">
            {title || 'Life at the Office & Remote'}
          </h2>
          {subtitle && <p className="font-inter text-base sm:text-lg text-slate-400 leading-relaxed">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div key={index} className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 shadow-md">
              <img src={img.url} alt={img.caption || 'Gallery photo'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              {img.caption && <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-sm font-medium font-inter">{img.caption}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

