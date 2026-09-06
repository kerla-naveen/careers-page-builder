import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
  UilPalette,
  UilBriefcase,
  UilRocket,
  UilCopy,
  UilExternalLinkAlt,
  UilSignOutAlt,
  UilLayers,
} from '@iconscout/react-unicons';

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

export default function EditorTopBar({
  company,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  viewportMode,
  onViewportChange,
  mobileWidth = '390px',
  onMobileWidthChange,
  onToggleMobileSidebar,
  onOpenJobManager,
  onSave,
  onPublish,
  onCopyPublicLink,
  isSaving,
  hasUnsavedChanges,
  lastSavedAt
}) {
  const [saveStatusText, setSaveStatusText] = useState('');
  const { user, logout } = useAuth();

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
    const interval = setInterval(updateSaveStatus, 60000);
    return () => clearInterval(interval);
  }, [isSaving, hasUnsavedChanges, lastSavedAt]);

  const saveStatusClass = hasUnsavedChanges ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded' : 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded';

  return (
    <header className="h-[54px] flex flex-row justify-between items-center bg-white border-b border-slate-200 px-5 z-[100] shadow-xs">
      <div className="flex flex-row items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            className="flex md:hidden items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg font-semibold text-xs cursor-pointer hover:bg-blue-100 transition-all"
            onClick={onToggleMobileSidebar}
            title="Toggle Sections & Branding drawer"
            aria-label="Toggle Sections Drawer"
          >
            <UilLayers size={16} /> Sections
          </button>
        )}
        <div className="text-xs font-semibold text-slate-900 whitespace-nowrap tracking-tight flex items-center gap-1.5">
          <EditorIcon />
          <span className="font-bold text-slate-900">{company?.name || 'Careers Editor'}</span>
        </div>
        <div className="w-[1px] h-5 bg-slate-200 mx-1"></div>
        <nav className="flex gap-1">
          <Link
            href={company?.slug ? `/editor/${company.slug}` : "/editor"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-all"
          >
            <UilPalette size={16} /> Careers Page
          </Link>
          <Link
            href={company?.slug ? `/${company.slug}/jobs` : "/jobs"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            <UilBriefcase size={16} /> Jobs
          </Link>
        </nav>
      </div>

      <div className="flex flex-row items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
        <button 
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white/60 transition-all cursor-pointer border-0"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo"
        >
          <UndoIcon />
        </button>
        <button 
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white/60 transition-all cursor-pointer border-0"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo"
        >
          <RedoIcon />
        </button>
        
        <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
        
        <button 
          className={`p-1.5 rounded-md transition-all cursor-pointer border-0 ${viewportMode === 'desktop' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
          onClick={() => onViewportChange('desktop')}
          aria-label="Desktop view"
          title="Desktop view"
        >
          <DesktopIcon />
        </button>
        <button 
          className={`p-1.5 rounded-md transition-all cursor-pointer border-0 ${viewportMode === 'tablet' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
          onClick={() => onViewportChange('tablet')}
          aria-label="Tablet view"
          title="Tablet view"
        >
          <TabletIcon />
        </button>
        <button 
          className={`p-1.5 rounded-md transition-all cursor-pointer border-0 ${viewportMode === 'mobile' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
          onClick={() => onViewportChange('mobile')}
          aria-label="Mobile view"
          title="Mobile view"
        >
          <MobileIcon />
        </button>
      </div>

      <div className="flex flex-row items-center gap-2.5">
        {saveStatusText && (
          <span className={`text-xs font-medium ${saveStatusClass}`}>
            {saveStatusText}
          </span>
        )}
        
        <button 
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSave}
          disabled={isSaving || (!hasUnsavedChanges && !!lastSavedAt)}
          aria-label="Save changes"
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>

        <button 
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 cursor-pointer border-0"
          onClick={onPublish}
          disabled={isSaving}
          aria-label="Publish page live"
          title="Publish live to candidate site"
        >
          <UilRocket size={16} /> Publish Live
        </button>
        
        {company?.slug && (
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-all"
              onClick={() => {
                const publicUrl = `${window.location.origin}/companies/${company.slug}/careers`;
                navigator.clipboard.writeText(publicUrl);
                if (onCopyPublicLink) onCopyPublicLink(publicUrl);
              }}
              title="Copy public careers page link"
              aria-label="Copy public careers page link"
            >
              <UilCopy size={16} /> Copy Link
            </button>
            <a
              href={`/companies/${company.slug}/careers`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all no-underline"
              aria-label="Open Live Careers Page"
              title="Open Live Careers Page"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Live Page <UilExternalLinkAlt size={14} />
            </a>
          </div>
        )}

        <div className="w-[1px] h-5 bg-slate-200 mx-1"></div>

        {/* User Account / Logout */}
        {user && (
          <div className="flex items-center gap-2 ml-1">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
              {user.name ? user.name[0] : 'R'}
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent transition-all cursor-pointer"
              title={`Logged in as ${user.email}. Click to log out.`}
              aria-label="Log out"
            >
              <UilSignOutAlt size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

