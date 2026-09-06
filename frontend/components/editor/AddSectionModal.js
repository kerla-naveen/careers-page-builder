import React, { useState } from 'react';
import {
  UilEstate,
  UilInfoCircle,
  UilSmile,
  UilGift,
  UilBriefcase,
  UilUsersAlt,
  UilCommentDots,
  UilQuestionCircle,
  UilMegaphone,
  UilImage,
} from '@iconscout/react-unicons';

const CATEGORIES = ['All', 'Header', 'Company Info', 'Careers & Culture', 'Media & Proof', 'Conversion'];

const SECTION_TEMPLATES = [
  {
    type: 'HERO',
    category: 'Header',
    name: 'Hero Banner',
    icon: <UilEstate size={18} />,
    description: 'High-impact headline, subtitle, key company stats, badge tag & primary job search CTA.',
    previewImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'ABOUT',
    category: 'Company Info',
    name: 'Mission & Story',
    icon: <UilInfoCircle size={18} />,
    description: 'Company story, video embed URL, founding year, employee count & website link.',
    previewImg: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'CULTURE',
    category: 'Careers & Culture',
    name: 'Culture & Values',
    icon: <UilSmile size={18} />,
    description: 'Grid of core company values with custom icons, titles, and descriptions.',
    previewImg: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'PERKS',
    category: 'Careers & Culture',
    name: 'Perks & Benefits',
    icon: <UilGift size={18} />,
    description: 'Highlight medical coverage, remote stipends, equity, learning allowances & retreats.',
    previewImg: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'JOBS',
    category: 'Careers & Culture',
    name: 'Open Opportunities',
    icon: <UilBriefcase size={18} />,
    description: 'Interactive job board grid with live category filters, search bar & application links.',
    previewImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'TEAM',
    category: 'Company Info',
    name: 'Leadership Team',
    icon: <UilUsersAlt size={18} />,
    description: 'Grid of team members & leaders with photos, role titles, and short bios.',
    previewImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'TESTIMONIALS',
    category: 'Media & Proof',
    name: 'Employee Testimonials',
    icon: <UilCommentDots size={18} />,
    description: 'Quotes and testimonials from team members sharing their workplace experience.',
    previewImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'FAQ',
    category: 'Company Info',
    name: 'Candidate FAQ',
    icon: <UilQuestionCircle size={18} />,
    description: 'Answers to common questions about interviewing, remote policy, and benefits.',
    previewImg: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'CTA',
    category: 'Conversion',
    name: 'Call to Action',
    icon: <UilMegaphone size={18} />,
    description: 'Conversion section inviting candidates to join your talent network.',
    previewImg: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=60',
  },
  {
    type: 'GALLERY',
    category: 'Media & Proof',
    name: 'Photo Gallery',
    icon: <UilImage size={18} />,
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="m-0 text-lg font-bold text-slate-900">
              Add Section to Careers Page
            </h2>
            <p className="m-0 mt-1 text-xs text-slate-500">
              Choose a section block to customize your company's careers site
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 transition-colors border-none rounded-full w-7 h-7 text-slate-600 text-lg cursor-pointer flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 border-b border-slate-200 flex gap-2 overflow-x-auto bg-white">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg border-none text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50">
          {filteredSections.map((item) => (
            <div
              key={item.type}
              onClick={() => {
                onAddSection(item.type);
                onClose();
              }}
              className="bg-white border border-slate-200 hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-lg rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col"
            >
              <div className="h-28 overflow-hidden relative">
                <img
                  src={item.previewImg}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm shadow-sm flex items-center justify-center">
                  {item.icon}
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="m-0 mb-1 text-sm font-semibold text-slate-900">
                    {item.name}
                  </h4>
                  <p className="m-0 text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1">
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
