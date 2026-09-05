import React, { useState } from 'react';
import styles from './Editor.module.css';

const ICON_CATEGORIES = {
  All: ['🚀', '💼', '🏠', '📚', '🏥', '📈', '🌴', '✈️', '👶', '💻', '💡', '🤝', '🏆', '🌍', '🎯', '🌱', '⭐', '❤️', '🔥', '⚡', '🎨', '🔒', '👥', '💬', '❓', '📢', '🖼️', '🛠️', '🎓', '🎁', '☕', '🍕', '🎉', '🌟', '💪', '🧠', '👑', '🔮', '🧘', '🚲'],
  Work: ['💼', '💻', '📈', '🎯', '🏆', '🛠️', '⚙️', '📊', '📝', '📅'],
  Perks: ['🏠', '📚', '🏥', '🌴', '✈️', '👶', '🎁', '☕', '🍕', '🚲', '💰', '🧘'],
  Values: ['💡', '🤝', '🌍', '🌱', '⭐', '❤️', '🔥', '⚡', '🎨', '🔒', '💪', '🧠'],
  People: ['👥', '👑', '🎓', '💬', '🎉', '🌟', '🙋', '🤝'],
};

export default function IconPickerModal({ isOpen, onClose, onSelectIcon }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const currentIcons = ICON_CATEGORIES[activeCategory] || ICON_CATEGORIES.All;
  const filteredIcons = currentIcons.filter((icon) => icon.includes(searchTerm));

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
      padding: '16px',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        padding: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>
            Choose an Icon
          </h3>
          <button
            onClick={onClose}
            style={{ background: '#e2e8f0', border: 'none', color: '#475569', borderRadius: '50%', width: '28px', height: '28px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ×
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {Object.keys(ICON_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeCategory === cat ? '#2563eb' : '#f1f5f9',
                color: activeCategory === cat ? '#ffffff' : '#64748b',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Icon Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
          maxHeight: '260px',
          overflowY: 'auto',
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          {filteredIcons.map((icon, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectIcon(icon);
                onClose();
              }}
              style={{
                fontSize: '24px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eff6ff';
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
