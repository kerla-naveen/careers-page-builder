import React, { useState } from 'react';
import styles from './Editor.module.css';
import IconPickerModal from './IconPickerModal';

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

export default function EditorRightPanel({
  selectedSection,
  selectedSectionIndex,
  onClose,
  updateCompany,
}) {
  const [iconPickerTarget, setIconPickerTarget] = useState(null); // { arrayName, itemIndex }
  const handleFieldChange = (field, value) => {
    if (selectedSectionIndex === -1) return;
    updateCompany((prev) => {
      const sections = [...prev.sections];
      sections[selectedSectionIndex] = {
        ...sections[selectedSectionIndex],
        [field]: value,
      };
      return { ...prev, sections };
    });
  };

  const handleContentChange = (contentField, value) => {
    if (selectedSectionIndex === -1) return;
    updateCompany((prev) => {
      const sections = [...prev.sections];
      const currentContent = sections[selectedSectionIndex].content || {};
      sections[selectedSectionIndex] = {
        ...sections[selectedSectionIndex],
        content: {
          ...currentContent,
          [contentField]: value,
        },
      };
      return { ...prev, sections };
    });
  };

  const handleArrayItemChange = (arrayName, itemIndex, itemField, value) => {
    if (selectedSectionIndex === -1) return;
    updateCompany((prev) => {
      const sections = [...prev.sections];
      const currentContent = sections[selectedSectionIndex].content || {};
      const currentArray = [...(currentContent[arrayName] || [])];
      currentArray[itemIndex] = {
        ...currentArray[itemIndex],
        [itemField]: value,
      };
      sections[selectedSectionIndex] = {
        ...sections[selectedSectionIndex],
        content: {
          ...currentContent,
          [arrayName]: currentArray,
        },
      };
      return { ...prev, sections };
    });
  };

  const handleAddArrayItem = (arrayName, defaultObj) => {
    if (selectedSectionIndex === -1) return;
    updateCompany((prev) => {
      const sections = [...prev.sections];
      const currentContent = sections[selectedSectionIndex].content || {};
      const currentArray = [...(currentContent[arrayName] || [])];
      currentArray.push(defaultObj);
      sections[selectedSectionIndex] = {
        ...sections[selectedSectionIndex],
        content: {
          ...currentContent,
          [arrayName]: currentArray,
        },
      };
      return { ...prev, sections };
    });
  };

  const handleRemoveArrayItem = (arrayName, itemIndex) => {
    if (selectedSectionIndex === -1) return;
    updateCompany((prev) => {
      const sections = [...prev.sections];
      const currentContent = sections[selectedSectionIndex].content || {};
      const currentArray = [...(currentContent[arrayName] || [])];
      currentArray.splice(itemIndex, 1);
      sections[selectedSectionIndex] = {
        ...sections[selectedSectionIndex],
        content: {
          ...currentContent,
          [arrayName]: currentArray,
        },
      };
      return { ...prev, sections };
    });
  };

  if (!selectedSection) {
    return null;
  }

  const content = selectedSection.content || {};

  return (
    <div className={styles.rightPanel}>
      <div className={styles.rightPanelHeader}>
        <div className={styles.rightPanelTitle}>
          {SECTION_ICONS[selectedSection.type] || '📄'} {selectedSection.type}
        </div>
        <button className={styles.rightPanelClose} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.rightPanelContent}>
        {/* COMMON SECTION HEADERS */}
        <div className={styles.propGroup}>
          <div className={styles.propGroupTitle}>Header Content</div>

          <div className={styles.propRow}>
            <label className={styles.propLabel}>Section Title</label>
            <input
              type="text"
              className={styles.inputField}
              value={selectedSection.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
          </div>

          <div className={styles.propRow}>
            <label className={styles.propLabel}>Subtitle / Description</label>
            <textarea
              className={styles.textareaField}
              value={selectedSection.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* HERO SECTION PROPS */}
        {selectedSection.type === 'HERO' && (
          <div className={styles.propGroup}>
            <div className={styles.propGroupTitle}>Hero Fields</div>

            <div className={styles.propRow}>
              <label className={styles.propLabel}>Headline</label>
              <input
                type="text"
                className={styles.inputField}
                value={content.headline || ''}
                onChange={(e) => handleContentChange('headline', e.target.value)}
              />
            </div>

            <div className={styles.propRow}>
              <label className={styles.propLabel}>Tagline</label>
              <textarea
                className={styles.textareaField}
                value={content.tagline || ''}
                onChange={(e) => handleContentChange('tagline', e.target.value)}
                rows={2}
              />
            </div>

            <div className={styles.propRow}>
              <label className={styles.propLabel}>Badge Text</label>
              <input
                type="text"
                className={styles.inputField}
                value={content.badgeText || ''}
                onChange={(e) => handleContentChange('badgeText', e.target.value)}
              />
            </div>

            <div className={styles.propRow}>
              <label className={styles.propLabel}>Primary CTA Text</label>
              <input
                type="text"
                className={styles.inputField}
                value={content.ctaText || ''}
                onChange={(e) => handleContentChange('ctaText', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ABOUT SECTION PROPS */}
        {selectedSection.type === 'ABOUT' && (
          <div className={styles.propGroup}>
            <div className={styles.propGroupTitle}>About Fields</div>
            <div className={styles.propRow}>
              <label className={styles.propLabel}>Story Content</label>
              <textarea
                className={styles.textareaField}
                value={content.story || ''}
                onChange={(e) => handleContentChange('story', e.target.value)}
                rows={5}
              />
            </div>
          </div>
        )}

        {/* CULTURE SECTION PROPS */}
        {selectedSection.type === 'CULTURE' && (
          <div className={styles.propGroup}>
            <div className={styles.propGroupTitle}>Culture Values</div>

            <div className={styles.propRow}>
              <label className={styles.propLabel}>Culture Description</label>
              <textarea
                className={styles.textareaField}
                value={content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={styles.propLabel}>Core Values ({content.values?.length || 0})</span>
                <button
                  onClick={() => handleAddArrayItem('values', { icon: '✨', name: 'New Value', description: 'Value description...' })}
                  style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  + Add
                </button>
              </div>

              {content.values?.map((val, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setIconPickerTarget({ arrayName: 'values', itemIndex: idx })}
                      title="Click to pick an icon"
                      style={{
                        width: '38px',
                        height: '38px',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      {val.icon || '✨'}
                    </button>
                    <input
                      type="text"
                      className={styles.inputField}
                      style={{ flex: 1 }}
                      value={val.name || ''}
                      onChange={(e) => handleArrayItemChange('values', idx, 'name', e.target.value)}
                    />
                    <button onClick={() => handleRemoveArrayItem('values', idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer' }}>×</button>
                  </div>
                  <textarea
                    className={styles.textareaField}
                    style={{ minHeight: '40px', fontSize: '11px' }}
                    value={val.description || ''}
                    onChange={(e) => handleArrayItemChange('values', idx, 'description', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PERKS SECTION PROPS */}
        {selectedSection.type === 'PERKS' && (
          <div className={styles.propGroup}>
            <div className={styles.propGroupTitle}>Perks List</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className={styles.propLabel}>Perks ({content.perks?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('perks', { icon: '🎁', title: 'New Perk', description: 'Perk description...' })}
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>

            {content.perks?.map((perk, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIconPickerTarget({ arrayName: 'perks', itemIndex: idx })}
                    title="Click to pick an icon"
                    style={{
                      width: '38px',
                      height: '38px',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {perk.icon || '🎁'}
                  </button>
                  <input
                    type="text"
                    className={styles.inputField}
                    style={{ flex: 1 }}
                    value={perk.title || ''}
                    onChange={(e) => handleArrayItemChange('perks', idx, 'title', e.target.value)}
                  />
                  <button onClick={() => handleRemoveArrayItem('perks', idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer' }}>×</button>
                </div>
                <textarea
                  className={styles.textareaField}
                  style={{ minHeight: '40px', fontSize: '11px' }}
                  value={perk.description || ''}
                  onChange={(e) => handleArrayItemChange('perks', idx, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* TEAM SECTION PROPS */}
        {selectedSection.type === 'TEAM' && (
          <div className={styles.propGroup}>
            <div className={styles.propGroupTitle}>Team Members</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className={styles.propLabel}>Members ({content.members?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('members', { name: 'New Member', role: 'Role Title', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', bio: 'Short bio' })}
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>

            {content.members?.map((mem, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Member #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('members', idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer' }}>×</button>
                </div>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Name"
                  value={mem.name || ''}
                  onChange={(e) => handleArrayItemChange('members', idx, 'name', e.target.value)}
                  style={{ marginBottom: '4px' }}
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Role"
                  value={mem.role || ''}
                  onChange={(e) => handleArrayItemChange('members', idx, 'role', e.target.value)}
                  style={{ marginBottom: '4px' }}
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Avatar Image URL"
                  value={mem.avatar || ''}
                  onChange={(e) => handleArrayItemChange('members', idx, 'avatar', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* TESTIMONIALS PROPS */}
        {selectedSection.type === 'TESTIMONIALS' && (
          <div className={styles.propGroup}>
            <div className={styles.propGroupTitle}>Testimonials</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className={styles.propLabel}>Quotes ({content.testimonials?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('testimonials', { quote: 'Great working here!', author: 'Author Name', role: 'Role', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' })}
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>

            {content.testimonials?.map((item, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Quote #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('testimonials', idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer' }}>×</button>
                </div>
                <textarea
                  className={styles.textareaField}
                  placeholder="Quote text..."
                  value={item.quote || ''}
                  onChange={(e) => handleArrayItemChange('testimonials', idx, 'quote', e.target.value)}
                  style={{ marginBottom: '4px' }}
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Author Name"
                  value={item.author || ''}
                  onChange={(e) => handleArrayItemChange('testimonials', idx, 'author', e.target.value)}
                  style={{ marginBottom: '4px' }}
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Author Role"
                  value={item.role || ''}
                  onChange={(e) => handleArrayItemChange('testimonials', idx, 'role', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* FAQ PROPS */}
        {selectedSection.type === 'FAQ' && (
          <div className={styles.propGroup}>
            <div className={styles.propGroupTitle}>FAQ Items</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className={styles.propLabel}>Questions ({content.faqs?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('faqs', { question: 'Question text?', answer: 'Answer details...' })}
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>

            {content.faqs?.map((faq, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Q#{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('faqs', idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer' }}>×</button>
                </div>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Question"
                  value={faq.question || ''}
                  onChange={(e) => handleArrayItemChange('faqs', idx, 'question', e.target.value)}
                  style={{ marginBottom: '4px' }}
                />
                <textarea
                  className={styles.textareaField}
                  placeholder="Answer..."
                  value={faq.answer || ''}
                  onChange={(e) => handleArrayItemChange('faqs', idx, 'answer', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA PROPS */}
        {selectedSection.type === 'CTA' && (
          <div className={styles.propGroup}>
            <div className={styles.propGroupTitle}>Call to Action Fields</div>

            <div className={styles.propRow}>
              <label className={styles.propLabel}>Button Text</label>
              <input
                type="text"
                className={styles.inputField}
                value={content.buttonText || ''}
                onChange={(e) => handleContentChange('buttonText', e.target.value)}
              />
            </div>

            <div className={styles.propRow}>
              <label className={styles.propLabel}>Button Link</label>
              <input
                type="text"
                className={styles.inputField}
                value={content.buttonLink || ''}
                onChange={(e) => handleContentChange('buttonLink', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* GALLERY PROPS */}
        {selectedSection.type === 'GALLERY' && (
          <div className={styles.propGroup}>
            <div className={styles.propGroupTitle}>Gallery Images</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className={styles.propLabel}>Images ({content.images?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('images', { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600', caption: 'Office space' })}
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>

            {content.images?.map((img, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Image #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('images', idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer' }}>×</button>
                </div>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Image URL"
                  value={img.url || ''}
                  onChange={(e) => handleArrayItemChange('images', idx, 'url', e.target.value)}
                  style={{ marginBottom: '4px' }}
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Caption"
                  value={img.caption || ''}
                  onChange={(e) => handleArrayItemChange('images', idx, 'caption', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={!!iconPickerTarget}
        onClose={() => setIconPickerTarget(null)}
        onSelectIcon={(selectedIcon) => {
          if (iconPickerTarget) {
            handleArrayItemChange(
              iconPickerTarget.arrayName,
              iconPickerTarget.itemIndex,
              'icon',
              selectedIcon
            );
          }
        }}
      />
    </div>
  );
}
