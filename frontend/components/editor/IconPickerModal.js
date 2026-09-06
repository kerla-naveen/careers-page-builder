import React, { useState } from 'react';

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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="m-0 text-base font-semibold text-slate-900">
            Choose an Icon
          </h3>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full w-7 h-7 text-base cursor-pointer flex items-center justify-center border-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {Object.keys(ICON_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border-none text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-6 gap-2.5 max-h-64 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
          {filteredIcons.map((icon, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectIcon(icon);
                onClose();
              }}
              className="text-2xl h-12 flex items-center justify-center bg-white border border-slate-300 rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-600 hover:scale-110"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
