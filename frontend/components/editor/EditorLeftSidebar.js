import React, { useState } from 'react';
import styles from './Editor.module.css';
import { createNewSection } from '../../utils/sectionTemplates';
import { THEME_PRESETS } from '../../utils/themePresets';
import AddSectionModal from './AddSectionModal';

const SECTION_ICONS = {
  HERO: '🏠',
  ABOUT: 'ℹ️',
  CULTURE: '🎭',
  PERKS: '🎁',
  JOBS: '💼',
  TEAM: '👥',
  TESTIMONIALS: '💬',
  FAQ: '❓',
  CTA: '📢',
  GALLERY: '🖼️',
};

const AVAILABLE_SECTIONS = [
  { type: 'HERO', label: 'Hero Banner', icon: '🏠', desc: 'Main title, tagline, stats & primary CTA' },
  { type: 'ABOUT', label: 'Mission & Story', icon: 'ℹ️', desc: 'Company history, mission, video & stats' },
  { type: 'CULTURE', label: 'Culture & Values', icon: '🎭', desc: 'Core principles and workplace values' },
  { type: 'PERKS', label: 'Perks & Benefits', icon: '🎁', desc: 'Health, remote stipends, learning budgets' },
  { type: 'JOBS', label: 'Open Positions', icon: '💼', desc: 'Filterable job listings grid' },
  { type: 'TEAM', label: 'Team Leadership', icon: '👥', desc: 'Leadership team member grid' },
  { type: 'TESTIMONIALS', label: 'Testimonials', icon: '💬', desc: 'Employee quotes & testimonials' },
  { type: 'FAQ', label: 'FAQ Accordion', icon: '❓', desc: 'Answers to candidate questions' },
  { type: 'CTA', label: 'Call to Action', icon: '📢', desc: 'Conversion banner to join talent network' },
  { type: 'GALLERY', label: 'Photo Gallery', icon: '🖼️', desc: 'Workspace & culture photo showcase' },
];

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
    <div className={styles.leftSidebar}>
      {/* Sidebar Tabs */}
      <div className={styles.sidebarTabs}>
        <button
          className={`${styles.sidebarTab} ${activeTab === 'sections' ? styles.active : ''}`}
          onClick={() => onTabChange('sections')}
        >
          Sections
        </button>
        <button
          className={`${styles.sidebarTab} ${activeTab === 'design' ? styles.active : ''}`}
          onClick={() => onTabChange('design')}
        >
          Design
        </button>
        <button
          className={`${styles.sidebarTab} ${activeTab === 'branding' ? styles.active : ''}`}
          onClick={() => onTabChange('branding')}
        >
          Branding
        </button>
      </div>

      <div className={styles.sidebarContent}>
        {/* SECTIONS TAB */}
        {activeTab === 'sections' && (
          <>
            <div className={styles.sectionTreeHeader}>
              <span>PAGE STRUCTURE</span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{sections?.length || 0} Sections</span>
            </div>

            <div className={styles.sectionList}>
              {sections?.map((section, index) => {
                const isSelected = selectedSectionId === section._id;
                const isDragging = index === draggedIndex;
                const isDropTarget = index === dragOverIndex;
                const dropClass = isDropTarget
                  ? draggedIndex < index
                    ? styles.dropTargetBottom
                    : styles.dropTargetTop
                  : '';

                return (
                  <div
                    key={section._id || index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`${styles.sectionItem} ${isSelected ? styles.selected : ''} ${
                      !section.isVisible ? styles.hidden : ''
                    } ${isDragging ? styles.dragging : ''} ${dropClass}`}
                    onClick={() => onSelectSection(section._id)}
                  >
                    <div className={styles.sectionDragHandle} title="Drag to reorder section">
                      ☰
                    </div>

                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      <span className={styles.sectionLabel} title={section.title || section.type}>
                        {section.title || section.type}
                      </span>
                    </div>

                    <div className={styles.sectionActions}>
                      <button
                        className={styles.sectionActionBtn}
                        onClick={(e) => handleMoveUp(e, index)}
                        title="Move Up"
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        className={styles.sectionActionBtn}
                        onClick={(e) => handleMoveDown(e, index)}
                        title="Move Down"
                        disabled={index === sections.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        className={styles.sectionActionBtn}
                        onClick={(e) => handleDuplicateSection(e, index)}
                        title="Duplicate Section"
                      >
                        📋
                      </button>
                      <button
                        className={styles.sectionActionBtn}
                        onClick={(e) => handleVisibilityToggle(e, index)}
                        title="Toggle Visibility"
                      >
                        {section.isVisible ? '👁️' : '👁️‍🗨️'}
                      </button>
                      <button
                        className={styles.sectionActionBtn}
                        onClick={(e) => handleDeleteSection(e, index)}
                        title="Delete Section"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className={styles.addSectionBtn}
              onClick={() => setShowSectionPicker(true)}
            >
              + Add section
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
          <div>
            <div className={styles.designGroup}>
              <div className={styles.designGroupTitle}>Theme Presets</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
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
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#0f172a',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 600, color: preset.primaryColor }}>{preset.badge}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.designGroup}>
              <div className={styles.designGroupTitle}>Color Tokens</div>
              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={company?.primaryColor || '#2563eb'}
                  onChange={(e) => handleDesignChange('primaryColor', e.target.value)}
                />
                <span className={styles.colorLabel}>Primary Color</span>
                <input
                  type="text"
                  className={styles.colorInput}
                  value={company?.primaryColor || '#2563eb'}
                  onChange={(e) => handleDesignChange('primaryColor', e.target.value)}
                />
              </div>

              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={company?.accentColor || '#3b82f6'}
                  onChange={(e) => handleDesignChange('accentColor', e.target.value)}
                />
                <span className={styles.colorLabel}>Accent Color</span>
                <input
                  type="text"
                  className={styles.colorInput}
                  value={company?.accentColor || '#3b82f6'}
                  onChange={(e) => handleDesignChange('accentColor', e.target.value)}
                />
              </div>

              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={company?.backgroundColor || '#0f172a'}
                  onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
                />
                <span className={styles.colorLabel}>Background</span>
                <input
                  type="text"
                  className={styles.colorInput}
                  value={company?.backgroundColor || '#0f172a'}
                  onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
                />
              </div>

              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={company?.textColor || '#f8fafc'}
                  onChange={(e) => handleDesignChange('textColor', e.target.value)}
                />
                <span className={styles.colorLabel}>Text Color</span>
                <input
                  type="text"
                  className={styles.colorInput}
                  value={company?.textColor || '#f8fafc'}
                  onChange={(e) => handleDesignChange('textColor', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.designGroup}>
              <div className={styles.designGroupTitle}>Typography</div>
              <div className={styles.propRow}>
                <label className={styles.propLabel}>Heading & Body Font</label>
                <select
                  className={styles.selectField}
                  value={company?.fontFamily || 'Outfit'}
                  onChange={(e) => handleDesignChange('fontFamily', e.target.value)}
                >
                  {FONTS.map((font) => (
                    <option key={font} value={font} style={{ background: '#ffffff', color: '#0f172a' }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.designGroup}>
              <div className={styles.designGroupTitle}>Button Shape</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleDesignChange('borderRadius', '16px')}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: company?.borderRadius === '16px' || !company?.borderRadius ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: company?.borderRadius === '16px' || !company?.borderRadius ? '#eff6ff' : '#ffffff',
                    color: company?.borderRadius === '16px' || !company?.borderRadius ? '#1d4ed8' : '#334155',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Rounded
                </button>
                <button
                  type="button"
                  onClick={() => handleDesignChange('borderRadius', '4px')}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '4px',
                    border: company?.borderRadius === '4px' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: company?.borderRadius === '4px' ? '#eff6ff' : '#ffffff',
                    color: company?.borderRadius === '4px' ? '#1d4ed8' : '#334155',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Square
                </button>
                <button
                  type="button"
                  onClick={() => handleDesignChange('borderRadius', '9999px')}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '9999px',
                    border: company?.borderRadius === '9999px' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: company?.borderRadius === '9999px' ? '#eff6ff' : '#ffffff',
                    color: company?.borderRadius === '9999px' ? '#1d4ed8' : '#334155',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Pill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BRANDING TAB */}
        {activeTab === 'branding' && (
          <div>
            <div className={styles.propGroup}>
              <div className={styles.propGroupTitle}>Company Identity</div>
              <div className={styles.propRow}>
                <label className={styles.propLabel}>Company Name</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={company?.name || ''}
                  onChange={(e) => handleBrandingChange('name', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('logo')}
                />
              </div>

              <div className={styles.propRow}>
                <label className={styles.propLabel}>Company Logo</label>
                {company?.logoUrl && (
                  <div style={{ marginBottom: '8px', padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={company.logoUrl} alt="Logo preview" style={{ height: '32px', maxWidth: '80px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Live logo preview</span>
                  </div>
                )}
                <input
                  type="text"
                  className={styles.inputField}
                  value={company?.logoUrl || ''}
                  onChange={(e) => handleBrandingChange('logoUrl', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('logo')}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.propRow}>
                <label className={styles.propLabel}>Hero / Banner Image</label>
                {company?.bannerUrl && (
                  <div style={{ marginBottom: '8px', borderRadius: '8px', overflow: 'hidden', height: '60px', border: '1px solid #e2e8f0' }}>
                    <img src={company.bannerUrl} alt="Banner preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <input
                  type="text"
                  className={styles.inputField}
                  value={company?.bannerUrl || ''}
                  onChange={(e) => handleBrandingChange('bannerUrl', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('banner')}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.propRow}>
                <label className={styles.propLabel}>Culture Video Embed URL</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={company?.videoUrl || ''}
                  onChange={(e) => handleBrandingChange('videoUrl', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('about')}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              <div className={styles.propRow}>
                <label className={styles.propLabel}>Company Description</label>
                <textarea
                  className={styles.textareaField}
                  value={company?.description || ''}
                  onChange={(e) => handleBrandingChange('description', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('about')}
                  rows={3}
                />
              </div>

              <div className={styles.propRow}>
                <label className={styles.propLabel}>Official Website URL</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={company?.website || ''}
                  onChange={(e) => handleBrandingChange('website', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('about')}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className={styles.propGroup}>
              <div className={styles.propGroupTitle}>Social Profiles</div>
              <div className={styles.propRow}>
                <label className={styles.propLabel}>LinkedIn URL</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={company?.socialLinks?.linkedin || ''}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('footer')}
                  placeholder="linkedin.com/in/username"
                />
                {company?.socialLinks?.linkedin && (
                  <span style={{ fontSize: '11px', color: '#059669', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                    ✓ Auto-formatted profile link
                  </span>
                )}
              </div>

              <div className={styles.propRow}>
                <label className={styles.propLabel}>Twitter / X URL</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={company?.socialLinks?.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('footer')}
                  placeholder="x.com/username"
                />
                {company?.socialLinks?.twitter && (
                  <span style={{ fontSize: '11px', color: '#059669', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                    ✓ Auto-formatted profile link
                  </span>
                )}
              </div>

              <div className={styles.propRow}>
                <label className={styles.propLabel}>GitHub URL</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={company?.socialLinks?.github || ''}
                  onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                  onFocus={() => onFocusBrandingArea && onFocusBrandingArea('footer')}
                  placeholder="github.com/username"
                />
                {company?.socialLinks?.github && (
                  <span style={{ fontSize: '11px', color: '#059669', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                    ✓ Auto-formatted profile link
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
