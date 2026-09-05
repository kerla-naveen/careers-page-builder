import React, { useState } from 'react';

const CATEGORIES = ['All', 'Header', 'Company Info', 'Careers & Culture', 'Media & Proof', 'Conversion'];

const SECTION_TEMPLATES = [
  {
    type: 'HERO',
    category: 'Header',
    name: 'Hero Banner',
    icon: '🏠',
    description: 'High-impact headline, subtitle, key company stats, badge tag & primary job search CTA.',
    previewImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'ABOUT',
    category: 'Company Info',
    name: 'Mission & Story',
    icon: 'ℹ️',
    description: 'Company story, video embed URL, founding year, employee count & website link.',
    previewImg: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'CULTURE',
    category: 'Careers & Culture',
    name: 'Culture & Values',
    icon: '🎭',
    description: 'Grid of core company values with custom icons, titles, and descriptions.',
    previewImg: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'PERKS',
    category: 'Careers & Culture',
    name: 'Perks & Benefits',
    icon: '🎁',
    description: 'Highlight medical coverage, remote stipends, equity, learning allowances & retreats.',
    previewImg: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'JOBS',
    category: 'Careers & Culture',
    name: 'Open Opportunities',
    icon: '💼',
    description: 'Interactive job board grid with live category filters, search bar & application links.',
    previewImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'TEAM',
    category: 'Company Info',
    name: 'Leadership Team',
    icon: '👥',
    description: 'Grid of team members & leaders with photos, role titles, and short bios.',
    previewImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'TESTIMONIALS',
    category: 'Media & Proof',
    name: 'Employee Testimonials',
    icon: '💬',
    description: 'Quotes and testimonials from team members sharing their workplace experience.',
    previewImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'FAQ',
    category: 'Company Info',
    name: 'Candidate FAQ',
    icon: '❓',
    description: 'Answers to common questions about interviewing, remote policy, and benefits.',
    previewImg: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'CTA',
    category: 'Conversion',
    name: 'Call to Action',
    icon: '📢',
    description: 'Conversion section inviting candidates to join your talent network.',
    previewImg: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'GALLERY',
    category: 'Media & Proof',
    name: 'Photo Gallery',
    icon: '🖼️',
    description: 'Photo grid showcasing team events, office spaces, retreats, and culture moments.',
    previewImg: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=60',
  },
];

export default function AddSectionModal({ isOpen, onClose, onAddSection }) {
  const [activeCategory, setActiveCategory] = useState('All');

  if (!isOpen) return null;

  const filteredSections = activeCategory === 'All'
    ? SECTION_TEMPLATES
    : SECTION_TEMPLATES.filter((s) => s.category === activeCategory);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '840px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              Add Section to Careers Page
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Choose a section block to customize your company's careers site
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#e2e8f0',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              color: '#475569',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          background: '#ffffff',
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeCategory === cat ? '#2563eb' : '#f1f5f9',
                color: activeCategory === cat ? '#ffffff' : '#64748b',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
          background: '#f8fafc',
        }}>
          {filteredSections.map((item) => (
            <div
              key={item.type}
              onClick={() => {
                onAddSection(item.type);
                onClose();
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ height: '110px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={item.previewImg}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}>
                  {item.icon}
                </span>
              </div>
              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                    {item.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                </div>
                <div style={{
                  marginTop: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  + Add Section →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
