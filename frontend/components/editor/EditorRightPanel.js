import React, { useState } from 'react';
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
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full z-40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5 font-inter">
          {SECTION_ICONS[selectedSection.type] || '📄'} {selectedSection.type}
        </div>
        <button className="text-slate-400 hover:text-slate-700 text-lg bg-transparent border-0 cursor-pointer p-1" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 font-inter">
        {/* COMMON SECTION HEADERS */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Header Content</div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Section Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
              value={selectedSection.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Subtitle / Description</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
              value={selectedSection.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* HERO SECTION PROPS */}
        {selectedSection.type === 'HERO' && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Hero Fields</div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Headline</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                value={content.headline || ''}
                onChange={(e) => handleContentChange('headline', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Tagline</label>
              <textarea
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                value={content.tagline || ''}
                onChange={(e) => handleContentChange('tagline', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Badge Text</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                value={content.badgeText || ''}
                onChange={(e) => handleContentChange('badgeText', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Primary CTA Text</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                value={content.ctaText || ''}
                onChange={(e) => handleContentChange('ctaText', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ABOUT SECTION PROPS */}
        {selectedSection.type === 'ABOUT' && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">About Fields</div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Story Content</label>
              <textarea
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                value={content.story || ''}
                onChange={(e) => handleContentChange('story', e.target.value)}
                rows={5}
              />
            </div>
          </div>
        )}

        {/* CULTURE SECTION PROPS */}
        {selectedSection.type === 'CULTURE' && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Culture Values</div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Culture Description</label>
              <textarea
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                value={content.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="mt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="block text-xs font-semibold text-slate-700">Core Values ({content.values?.length || 0})</span>
                <button
                  onClick={() => handleAddArrayItem('values', { icon: '✨', name: 'New Value', description: 'Value description...' })}
                  className="bg-blue-50 border border-blue-200 text-blue-600 rounded px-2 py-0.5 text-[11px] font-semibold cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {content.values?.map((val, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 space-y-2">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIconPickerTarget({ arrayName: 'values', itemIndex: idx })}
                      title="Click to pick an icon"
                      className="w-9.5 h-9.5 text-lg flex items-center justify-center bg-white border border-slate-300 rounded-md cursor-pointer shrink-0"
                    >
                      {val.icon || '✨'}
                    </button>
                    <input
                      type="text"
                      className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                      value={val.name || ''}
                      onChange={(e) => handleArrayItemChange('values', idx, 'name', e.target.value)}
                    />
                    <button onClick={() => handleRemoveArrayItem('values', idx)} className="bg-transparent border-0 text-rose-500 text-base cursor-pointer px-1">×</button>
                  </div>
                  <textarea
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-[11px] font-medium text-slate-800 bg-white outline-none focus:border-blue-500 min-h-[40px]"
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
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Perks List</div>

            <div className="flex justify-between items-center mb-2">
              <span className="block text-xs font-semibold text-slate-700">Perks ({content.perks?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('perks', { icon: '🎁', title: 'New Perk', description: 'Perk description...' })}
                className="bg-blue-50 border border-blue-200 text-blue-600 rounded px-2 py-0.5 text-[11px] font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>

            {content.perks?.map((perk, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 space-y-2">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIconPickerTarget({ arrayName: 'perks', itemIndex: idx })}
                    title="Click to pick an icon"
                    className="w-9.5 h-9.5 text-lg flex items-center justify-center bg-white border border-slate-300 rounded-md cursor-pointer shrink-0"
                  >
                    {perk.icon || '🎁'}
                  </button>
                  <input
                    type="text"
                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                    value={perk.title || ''}
                    onChange={(e) => handleArrayItemChange('perks', idx, 'title', e.target.value)}
                  />
                  <button onClick={() => handleRemoveArrayItem('perks', idx)} className="bg-transparent border-0 text-rose-500 text-base cursor-pointer px-1">×</button>
                </div>
                <textarea
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-[11px] font-medium text-slate-800 bg-white outline-none focus:border-blue-500 min-h-[40px]"
                  value={perk.description || ''}
                  onChange={(e) => handleArrayItemChange('perks', idx, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {/* TEAM SECTION PROPS */}
        {selectedSection.type === 'TEAM' && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Team Members</div>

            <div className="flex justify-between items-center mb-2">
              <span className="block text-xs font-semibold text-slate-700">Members ({content.members?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('members', { name: 'New Member', role: 'Role Title', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', bio: 'Short bio' })}
                className="bg-blue-50 border border-blue-200 text-blue-600 rounded px-2 py-0.5 text-[11px] font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>

            {content.members?.map((mem, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-slate-700">Member #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('members', idx)} className="bg-transparent border-0 text-rose-500 text-base cursor-pointer">×</button>
                </div>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  placeholder="Name"
                  value={mem.name || ''}
                  onChange={(e) => handleArrayItemChange('members', idx, 'name', e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  placeholder="Role"
                  value={mem.role || ''}
                  onChange={(e) => handleArrayItemChange('members', idx, 'role', e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
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
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Testimonials</div>

            <div className="flex justify-between items-center mb-2">
              <span className="block text-xs font-semibold text-slate-700">Quotes ({content.testimonials?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('testimonials', { quote: 'Great working here!', author: 'Author Name', role: 'Role', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' })}
                className="bg-blue-50 border border-blue-200 text-blue-600 rounded px-2 py-0.5 text-[11px] font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>

            {content.testimonials?.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-slate-700">Quote #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('testimonials', idx)} className="bg-transparent border-0 text-rose-500 text-base cursor-pointer">×</button>
                </div>
                <textarea
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  placeholder="Quote text..."
                  value={item.quote || ''}
                  onChange={(e) => handleArrayItemChange('testimonials', idx, 'quote', e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  placeholder="Author Name"
                  value={item.author || ''}
                  onChange={(e) => handleArrayItemChange('testimonials', idx, 'author', e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
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
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">FAQ Items</div>

            <div className="flex justify-between items-center mb-2">
              <span className="block text-xs font-semibold text-slate-700">Questions ({content.faqs?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('faqs', { question: 'Question text?', answer: 'Answer details...' })}
                className="bg-blue-50 border border-blue-200 text-blue-600 rounded px-2 py-0.5 text-[11px] font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>

            {content.faqs?.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-slate-700">Q#{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('faqs', idx)} className="bg-transparent border-0 text-rose-500 text-base cursor-pointer">×</button>
                </div>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  placeholder="Question"
                  value={faq.question || ''}
                  onChange={(e) => handleArrayItemChange('faqs', idx, 'question', e.target.value)}
                />
                <textarea
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
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
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Call to Action Fields</div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Button Text</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                value={content.buttonText || ''}
                onChange={(e) => handleContentChange('buttonText', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Button Link</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                value={content.buttonLink || ''}
                onChange={(e) => handleContentChange('buttonLink', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* GALLERY PROPS */}
        {selectedSection.type === 'GALLERY' && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5">Gallery Images</div>

            <div className="flex justify-between items-center mb-2">
              <span className="block text-xs font-semibold text-slate-700">Images ({content.images?.length || 0})</span>
              <button
                onClick={() => handleAddArrayItem('images', { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600', caption: 'Office space' })}
                className="bg-blue-50 border border-blue-200 text-blue-600 rounded px-2 py-0.5 text-[11px] font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>

            {content.images?.map((img, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-slate-700">Image #{idx + 1}</span>
                  <button onClick={() => handleRemoveArrayItem('images', idx)} className="bg-transparent border-0 text-rose-500 text-base cursor-pointer">×</button>
                </div>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
                  placeholder="Image URL"
                  value={img.url || ''}
                  onChange={(e) => handleArrayItemChange('images', idx, 'url', e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-800 bg-white outline-none focus:border-blue-500"
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

