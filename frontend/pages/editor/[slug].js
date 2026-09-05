import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../components/editor/Editor.module.css';

import { useAuth } from '../../context/AuthContext';
import { useEditorState } from '../../hooks/useEditorState';
import EditorTopBar from '../../components/editor/EditorTopBar';
import EditorLeftSidebar from '../../components/editor/EditorLeftSidebar';
import EditorCanvas from '../../components/editor/EditorCanvas';
import EditorRightPanel from '../../components/editor/EditorRightPanel';
import JobManagerModal from '../../components/editor/JobManagerModal';

export default function CareersEditorPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [brandingFocusArea, setBrandingFocusArea] = useState(null);
  const [isJobManagerOpen, setIsJobManagerOpen] = useState(false);

  const {
    company,
    jobs,
    isLoading: isCompanyLoading,
    loadError,
    selectedSectionId,
    selectedSection,
    selectedSectionIndex,
    selectSection,
    activeLeftTab,
    setActiveLeftTab,
    viewportMode,
    setViewportMode,
    updateCompany,
    saveToBackend,
    publishToBackend,
    isSaving,
    hasUnsavedChanges,
    lastSavedAt,
    undo,
    redo,
    canUndo,
    canRedo,
    toast,
    showToast,
  } = useEditorState(slug, token);

  // Route protection — redirect unauthenticated user to /login
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      router.replace('/login');
    }
  }, [user, isAuthLoading, router]);

  // Section Action Handlers for Canvas Toolbar
  const handleMoveSectionUp = (index) => {
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

  const handleMoveSectionDown = (index) => {
    if (!company?.sections || index === company.sections.length - 1) return;
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

  const handleDuplicateSection = (index) => {
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

  const handleToggleVisibility = (index) => {
    updateCompany((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = {
        ...newSections[index],
        isVisible: !newSections[index].isVisible,
      };
      return { ...prev, sections: newSections };
    });
  };

  const handleDeleteSection = (index) => {
    if (company.sections.length <= 1) {
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

  if (isAuthLoading || isCompanyLoading) {
    return (
      <div className={styles.editorLoading}>
        <Head>
          <title>Loading Careers Editor...</title>
        </Head>
        <div className={styles.loadingSpinner} />
        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '14px' }}>
          Loading careers page editor...
        </p>
      </div>
    );
  }

  // Ownership Guard — recruiter can only edit their own company
  if (user && user.company && slug && user.company.slug !== slug) {
    return (
      <div className={styles.editorLoading}>
        <Head>
          <title>Access Denied | Careers Editor</title>
        </Head>
        <div style={{
          textAlign: 'center',
          maxWidth: '440px',
          padding: '32px 24px',
          background: '#131926',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</p>
          <h2 style={{ color: '#f1f5f9', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
            Access Restricted
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
            You are logged in as <strong>{user.name}</strong> ({user.company.name}). You do not have authorization to edit <strong>{slug}</strong>'s page.
          </p>
          <button
            onClick={() => router.push(`/editor/${user.company.slug}`)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#6366f1',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Go to My Company Editor ({user.company.name}) →
          </button>
        </div>
      </div>
    );
  }

  if (loadError || !company) {
    return (
      <div className={styles.editorLoading}>
        <Head>
          <title>Editor Error</title>
        </Head>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</p>
          <h2 style={{ color: '#f1f5f9', marginBottom: '8px' }}>Failed to Load Editor</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
            {loadError || 'Company not found'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#6366f1',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editorRoot}>
      <Head>
        <title>{`Editing ${company.name} Careers Page | No-Code Editor`}</title>
      </Head>

      {/* Top Toolbar */}
      <EditorTopBar
        company={company}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        viewportMode={viewportMode}
        onViewportChange={setViewportMode}
        onOpenJobManager={() => setIsJobManagerOpen(true)}
        onSave={saveToBackend}
        onPublish={publishToBackend}
        onCopyPublicLink={() => showToast('📋 Copied public careers page link to clipboard!', 'info')}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSavedAt={lastSavedAt}
      />

      {/* Main Workspace: Left Sidebar | Center Canvas | Right Panel */}
      <div className={styles.workspace}>
        <EditorLeftSidebar
          company={company}
          sections={company.sections || []}
          selectedSectionId={selectedSectionId}
          onSelectSection={selectSection}
          activeTab={activeLeftTab}
          onTabChange={setActiveLeftTab}
          updateCompany={updateCompany}
          onFocusBrandingArea={setBrandingFocusArea}
        />

        <EditorCanvas
          company={company}
          jobs={jobs}
          viewportMode={viewportMode}
          selectedSectionId={selectedSectionId}
          brandingFocusArea={brandingFocusArea}
          onSelectSection={(secId) => {
            setBrandingFocusArea(null);
            selectSection(secId);
          }}
          onMoveSectionUp={handleMoveSectionUp}
          onMoveSectionDown={handleMoveSectionDown}
          onDuplicateSection={handleDuplicateSection}
          onToggleVisibility={handleToggleVisibility}
          onDeleteSection={handleDeleteSection}
        />

        {selectedSection && (
          <EditorRightPanel
            selectedSection={selectedSection}
            selectedSectionIndex={selectedSectionIndex}
            onClose={() => selectSection(null)}
            updateCompany={updateCompany}
          />
        )}
      </div>

      {/* Toast Overlay */}
      {toast && (
        <div
          className={`${styles.toast} ${
            toast.type === 'error' ? styles.toastError : ''
          }`}
        >
          {toast.type === 'error' ? '❌ ' : '✅ '}
          {toast.message}
        </div>
      )}

      {/* Recruiter Job Management Modal */}
      <JobManagerModal
        isOpen={isJobManagerOpen}
        onClose={() => setIsJobManagerOpen(false)}
        companySlug={company?.slug}
        token={token}
      />
    </div>
  );
}
