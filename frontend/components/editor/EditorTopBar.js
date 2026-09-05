import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Editor.module.css';

function formatRelativeTime(date) {
  if (!date) return '';
  const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  return 'a while ago';
}

const EditorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const UndoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3l-3 2.7" />
  </svg>
);

const RedoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
  </svg>
);

const DesktopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const TabletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const MobileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default function EditorTopBar({
  company,
  companiesList = [],
  onCompanyChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  viewportMode,
  onViewportChange,
  onSave,
  onPublish,
  onCopyPublicLink,
  isSaving,
  hasUnsavedChanges,
  lastSavedAt
}) {
  const [saveStatusText, setSaveStatusText] = useState('');

  useEffect(() => {
    const updateSaveStatus = () => {
      if (isSaving) {
        setSaveStatusText('Saving...');
      } else if (hasUnsavedChanges) {
        setSaveStatusText('Unsaved changes');
      } else if (lastSavedAt) {
        setSaveStatusText(`Saved ${formatRelativeTime(lastSavedAt)}`);
      } else {
        setSaveStatusText('');
      }
    };

    updateSaveStatus();
    // Update every minute for relative time if we're showing "last saved"
    const interval = setInterval(updateSaveStatus, 60000);
    
    return () => clearInterval(interval);
  }, [isSaving, hasUnsavedChanges, lastSavedAt]);

  const saveStatusClass = hasUnsavedChanges ? styles.unsaved : (lastSavedAt && !isSaving ? styles.saved : '');

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className={styles.editorTitle}>
          <EditorIcon />
          <span>{company?.name || 'Editor'}</span>
        </div>
        
        <div className={styles.divider}></div>
        
        {companiesList && companiesList.length > 0 && (
          <select 
            className={styles.companySelector}
            value={company?.slug || ''}
            onChange={(e) => onCompanyChange && onCompanyChange(e.target.value)}
            aria-label="Switch Company"
          >
            {companiesList.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.topBarCenter}>
        <button 
          className={`${styles.topBarBtn} ${!canUndo ? styles.disabled : ''}`}
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo"
        >
          <UndoIcon />
        </button>
        <button 
          className={`${styles.topBarBtn} ${!canRedo ? styles.disabled : ''}`}
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo"
        >
          <RedoIcon />
        </button>
        
        <div className={styles.divider}></div>
        
        <button 
          className={`${styles.topBarBtn} ${styles.deviceBtn} ${viewportMode === 'desktop' ? styles.active : ''}`}
          onClick={() => onViewportChange('desktop')}
          aria-label="Desktop view"
          title="Desktop view"
        >
          <DesktopIcon />
        </button>
        <button 
          className={`${styles.topBarBtn} ${styles.deviceBtn} ${viewportMode === 'tablet' ? styles.active : ''}`}
          onClick={() => onViewportChange('tablet')}
          aria-label="Tablet view"
          title="Tablet view"
        >
          <TabletIcon />
        </button>
        <button 
          className={`${styles.topBarBtn} ${styles.deviceBtn} ${viewportMode === 'mobile' ? styles.active : ''}`}
          onClick={() => onViewportChange('mobile')}
          aria-label="Mobile view"
          title="Mobile view"
        >
          <MobileIcon />
        </button>
      </div>

      <div className={styles.topBarRight}>
        {saveStatusText && (
          <span className={`${styles.saveStatus} ${saveStatusClass}`}>
            {saveStatusText}
          </span>
        )}
        
        <button 
          className={styles.saveBtn}
          onClick={onSave}
          disabled={isSaving || (!hasUnsavedChanges && !!lastSavedAt)}
          aria-label="Save changes"
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>

        <button 
          className={styles.publishBtn}
          onClick={onPublish}
          disabled={isSaving}
          aria-label="Publish page live"
          title="Publish live to candidate site"
        >
          🚀 Publish Live
        </button>
        
        {company?.slug && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className={styles.topBarBtn}
              onClick={() => {
                const publicUrl = `${window.location.origin}/companies/${company.slug}`;
                navigator.clipboard.writeText(publicUrl);
                if (onCopyPublicLink) onCopyPublicLink(publicUrl);
              }}
              title="Copy public careers page link"
              aria-label="Copy public careers page link"
            >
              📋 Copy Link
            </button>
            <Link
              href={`/companies/${company.slug}`}
              className={styles.topBarBtn}
              aria-label="Open Live Careers Page"
              title="Open Live Careers Page"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Live Page ↗
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
