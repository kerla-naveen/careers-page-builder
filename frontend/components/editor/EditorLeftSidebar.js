import React, { useState } from 'react';
import { createNewSection } from '../../utils/sectionTemplates';
import { THEME_PRESETS } from '../../utils/themePresets';
import AddSectionModal from './AddSectionModal';
import {
  UilBars,
  UilArrowUp,
  UilArrowDown,
  UilCopy,
  UilEye,
  UilEyeSlash,
  UilTrashAlt,
  UilPlus,
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

const SECTION_ICONS = {
  HERO: <UilEstate size={16} />,
  ABOUT: <UilInfoCircle size={16} />,
  CULTURE: <UilSmile size={16} />,
  PERKS: <UilGift size={16} />,
  JOBS: <UilBriefcase size={16} />,
  TEAM: <UilUsersAlt size={16} />,
  TESTIMONIALS: <UilCommentDots size={16} />,
  FAQ: <UilQuestionCircle size={16} />,
  CTA: <UilMegaphone size={16} />,
  GALLERY: <UilImage size={16} />,
};

const FONTS = [
  'Inter', 'Outfit', 'Poppins', 'Roboto', 'Plus Jakarta Sans', 'Playfair Display'
];

export default function EditorLeftSidebar({
  company,
  sections,
  selectedSectionId,
  onSelectSection,
  activeTab,
  onTabChange,
  updateCompany,
  onFocusBrandingArea,
  isMobileOpen,
}) {
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleVisibilityToggle = (e, index) => {
    e.stopPropagation();
    updateCompany((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = {
        ...newSections[index],
        isVisible: !newSections[index].isVisible,
      };
      return { ...prev, sections: newSections };
    });
  };

  const handleDuplicateSection = (e, index) => {
    e.stopPropagation();
    updateCompany((prev) => {
      const newSections = [...prev.sections];
      const target = newSections[index];
      const clone = {
        ...JSON.parse(JSON.stringify(target)),
        _id: 'sec_' + Math.random().toString(36).substr(2, 9),
        title: `${target.title} (Copy)`,
      };
      newSections.splice(index + 1, 0, clone);
      return {
        ...prev,
        sections: newSections.map((sec, idx) => ({ ...sec, orderIndex: idx })),
      };
    });
  };

  const handleDeleteSection = (e, index) => {
    e.stopPropagation();
    if (sections.length <= 1) {
      alert('Careers page must have at least 1 section.');
      return;
    }
    updateCompany((prev) => {
      const newSections = [...prev.sections];
      newSections.splice(index, 1);
      return {
        ...prev,
        sections: newSections.map((sec, idx) => ({ ...sec, orderIndex: idx })),
      };
    });
  };

  const handleMoveUp = (e, index) => {
    e.stopPropagation();
    if (index === 0) return;
    updateCompany((prev) => {
      const newSections = [...prev.sections];
      const temp = newSections[index - 1];
      newSections[index - 1] = newSections[index];
      newSections[index] = temp;
      return {
        ...prev,
        sections: newSections.map((sec, idx) => ({ ...sec, orderIndex: idx })),
      };
    });
  };

  const handleMoveDown = (e, index) => {
    e.stopPropagation();
    if (index === sections.length - 1) return;
    updateCompany((prev) => {
      const newSections = [...prev.sections];
      const temp = newSections[index + 1];
      newSections[index + 1] = newSections[index];
      newSections[index] = temp;
      return {
        ...prev,
        sections: newSections.map((sec, idx) => ({ ...sec, orderIndex: idx })),
      };
    });
  };

  const handleAddSection = (type) => {
    const newSec = createNewSection(type, sections?.length || 0);
    if (!newSec) return;
    newSec._id = 'sec_' + Math.random().toString(36).substr(2, 9);

    updateCompany((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSec],
    }));

    onSelectSection(newSec._id);
    setShowSectionPicker(false);
  };

  // Drag & Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      updateCompany((prev) => {
        const newSections = [...prev.sections];
        const [draggedItem] = newSections.splice(draggedIndex, 1);
        newSections.splice(targetIndex, 0, draggedItem);
        return {
          ...prev,
          sections: newSections.map((sec, idx) => ({ ...sec, orderIndex: idx })),
        };
      });
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDesignChange = (field, value) => {
    updateCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBrandingChange = (field, value) => {
    updateCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (network, value) => {
    updateCompany((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || {}),
        [network]: value,
      },
    }));
  };

  return (
    <div
      className={`w-72 bg-white border-r border-slate-200 flex flex-col h-full z-40 transition-transform duration-300 md:translate-x-0 ${
        isMobileOpen ? 'translate-x-0 fixed inset-y-0 left-0 shadow-2xl' : '-translate-x-full md:relative'
      }`}
    >
      {/* Sidebar Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          className={`flex-1 py-3 text-xs font-semibold text-center cursor-pointer border-b-2 transition-colors border-transparent text-slate-500 hover:text-slate-900 bg-transparent ${
            activeTab === 'sections' ? 'border-blue-600 text-blue-600 bg-white font-bold' : ''
          }`}
          onClick={() => onTabChange('sections')}
        >
          Sections
        </button>
        <button
          className={`flex-1 py-3 text-xs font-semibold text-center cursor-pointer border-b-2 transition-colors border-transparent text-slate-500 hover:text-slate-900 bg-transparent ${
            activeTab === 'design' ? 'border-blue-600 text-blue-600 bg-white font-bold' : ''
          }`}
          onClick={() => onTabChange('design')}
        >
          Design
        </button>
        <button
          className={`flex-1 py-3 text-xs font-semibold text-center cursor-pointer border-b-2 transition-colors border-transparent text-slate-500 hover:text-slate-900 bg-transparent ${
            activeTab === 'branding' ? 'border-blue-600 text-blue-600 bg-white font-bold' : ''
          }`}
          onClick={() => onTabChange('branding')}
        >
          Branding
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 font-inter">
        {/* SECTIONS TAB */}
        {activeTab === 'sections' && (
          <>
            <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
              <span>PAGE STRUCTURE</span>
              <span className="text-[10px] text-slate-400">{sections?.length || 0} Sections</span>
            </div>

            <div className="space-y-1.5">
              {sections?.map((section, index) => {
                const isSelected = selectedSectionId === section._id;
                const isDragging = index === draggedIndex;

                return (
                  <div
                    key={section._id || index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`group flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50/50 text-blue-900 shadow-xs' : ''
                    } ${!section.isVisible ? 'opacity-50' : ''} ${isDragging ? 'opacity-30' : ''}`}
                    onClick={() => onSelectSection(section._id)}
                  >
                    <div className="text-slate-400 cursor-grab hover:text-slate-600 pr-1" title="Drag to reorder section">
                      <UilBars size={14} />
                    </div>

                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="text-blue-600">
                        {SECTION_ICONS[section.type] || <UilEstate size={16} />}
                      </span>
                      <span className="truncate font-medium text-slate-800" title={section.title || section.type}>
                        {section.title || section.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={(e) => handleMoveUp(e, index)}
                        title="Move Up"
                        disabled={index === 0}
                      >
                        <UilArrowUp size={12} />
                      </button>
                      <button
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={(e) => handleMoveDown(e, index)}
                        title="Move Down"
                        disabled={index === sections.length - 1}
                      >
                        <UilArrowDown size={12} />
                      </button>
                      <button
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors bg-transparent border-0 cursor-pointer"
                        onClick={(e) => handleDuplicateSection(e, index)}
                        title="Duplicate Section"
                      >
                        <UilCopy size={12} />
                      </button>
                      <button
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors bg-transparent border-0 cursor-pointer"
                        onClick={(e) => handleVisibilityToggle(e, index)}
                        title="Toggle Visibility"
                      >
                        {section.isVisible ? <UilEye size={12} /> : <UilEyeSlash size={12} />}
                      </button>
                      <button
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-200 rounded transition-colors bg-transparent border-0 cursor-pointer"
                        onClick={(e) => handleDeleteSection(e, index)}
                        title="Delete Section"
                      >
                        <UilTrashAlt size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-blue-500 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-transparent mt-4"
              onClick={() => setShowSectionPicker(true)}
            >
              <UilPlus size={14} /> Add section
            </button>

            {/* Add Section Modal */}
            <AddSectionModal
              isOpen={showSectionPicker}
              onClose={() => setShowSectionPicker(false)}
              onAddSection={handleAddSection}
            />
          </>
        )}

        {/* DESIGN TAB */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Theme Presets</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      updateCompany((prev) => ({
                        ...prev,
                        primaryColor: preset.primaryColor,
                        accentColor: preset.accentColor,
                        backgroundColor: preset.backgroundColor,
                        textColor: preset.textColor,
                        fontFamily: preset.fontFamily,
                        borderRadius: preset.borderRadius,
                      }));
                    }}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-2 cursor-pointer text-left transition-all"
                  >
                    <div className="text-[11px] font-semibold" style={{ color: preset.primaryColor }}>{preset.badge}</div>
                    <div className="text-xs font-semibold text-slate-900 mt-0.5">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Color Tokens</div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0 overflow-hidden shrink-0"
                  value={company?.primaryColor || '#2563eb'}
                  onChange={(e) => handleDesignChange('primaryColor', e.target.value)}
                />
                <span className="flex-1 text-xs font-medium text-slate-700">Primary Color</span>
                <input
                  type="text"
                  className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-mono text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.primaryColor || '#2563eb'}
                  onChange={(e) => handleDesignChange('primaryColor', e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0 overflow-hidden shrink-0"
                  value={company?.accentColor || '#3b82f6'}
                  onChange={(e) => handleDesignChange('accentColor', e.target.value)}
                />
                <span className="flex-1 text-xs font-medium text-slate-700">Accent Color</span>
                <input
                  type="text"
                  className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-mono text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.accentColor || '#3b82f6'}
                  onChange={(e) => handleDesignChange('accentColor', e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0 overflow-hidden shrink-0"
                  value={company?.backgroundColor || '#0f172a'}
                  onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
                />
                <span className="flex-1 text-xs font-medium text-slate-700">Background</span>
                <input
                  type="text"
                  className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-mono text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.backgroundColor || '#0f172a'}
                  onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0 overflow-hidden shrink-0"
                  value={company?.textColor || '#f8fafc'}
                  onChange={(e) => handleDesignChange('textColor', e.target.value)}
                />
                <span className="flex-1 text-xs font-medium text-slate-700">Text Color</span>
                <input
                  type="text"
                  className="w-24 px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-mono text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.textColor || '#f8fafc'}
                  onChange={(e) => handleDesignChange('textColor', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Typography</div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Heading & Body Font</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.fontFamily || 'Outfit'}
                  onChange={(e) => handleDesignChange('fontFamily', e.target.value)}
                >
                  {FONTS.map((font) => (
                    <option key={font} value={font} className="bg-white text-slate-900">
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Button Shape</div>
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                <button
                  type="button"
                  onClick={() => handleDesignChange('borderRadius', '16px')}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                    company?.borderRadius === '16px' || !company?.borderRadius
                      ? 'border-blue-600 bg-blue-50 text-blue-700 border-2'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  Rounded
                </button>
                <button
                  type="button"
                  onClick={() => handleDesignChange('borderRadius', '4px')}
                  className={`py-2 px-1 rounded-md text-xs font-semibold cursor-pointer border ${
                    company?.borderRadius === '4px'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 border-2'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  Square
                </button>
                <button
                  type="button"
                  onClick={() => handleDesignChange('borderRadius', '9999px')}
                  className={`py-2 px-1 rounded-full text-xs font-semibold cursor-pointer border ${
                    company?.borderRadius === '9999px'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 border-2'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  Pill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BRANDING TAB */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Company Identity</div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Company Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.name || ''}
                  onChange={(e) => handleBrandingChange('name', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('logo')}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Company Logo</label>
                {company?.logoUrl && (
                  <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
                    <img src={company.logoUrl} alt="Logo preview" className="h-8 max-w-[80px] object-contain" />
                    <span className="text-[11px] text-slate-500 font-medium">Live logo preview</span>
                  </div>
                )}
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.logoUrl || ''}
                  onChange={(e) => handleBrandingChange('logoUrl', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('logo')}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Hero / Banner Image</label>
                {company?.bannerUrl && (
                  <div className="mb-2 rounded-lg overflow-hidden h-14 border border-slate-200">
                    <img src={company.bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.bannerUrl || ''}
                  onChange={(e) => handleBrandingChange('bannerUrl', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('banner')}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Culture Video Embed URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.videoUrl || ''}
                  onChange={(e) => handleBrandingChange('videoUrl', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('about')}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Company Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.description || ''}
                  onChange={(e) => handleBrandingChange('description', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('about')}
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Official Website URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.website || ''}
                  onChange={(e) => handleBrandingChange('website', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('about')}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Social Profiles</div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">LinkedIn URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.socialLinks?.linkedin || ''}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('footer')}
                  placeholder="linkedin.com/in/username"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Twitter / X URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.socialLinks?.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('footer')}
                  placeholder="x.com/username"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">GitHub URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  value={company?.socialLinks?.github || ''}
                  onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('footer')}
                  placeholder="github.com/username"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

