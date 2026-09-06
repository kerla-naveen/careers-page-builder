import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 font-inter">
        <Head>
          <title>Loading Careers Editor...</title>
        </Head>
        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 text-sm font-medium">
          Loading careers page editor...
        </p>
      </div>
    );
  }

  // Ownership Guard — recruiter can only edit their own company
  if (user && user.company && slug && user.company.slug !== slug) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 font-inter">
        <Head>
          <title>Access Denied | Careers Editor</title>
        </Head>
        <div className="text-center max-w-[440px] p-8 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-5xl mb-4">🚫</p>
          <h2 className="text-white text-xl font-bold font-outfit mb-2">
            Access Restricted
          </h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You are logged in as <strong>{user.name}</strong> ({user.company.name}). You do not have authorization to edit <strong>{slug}</strong>'s page.
          </p>
          <button
            onClick={() => router.push(`/editor/${user.company.slug}`)}
            className="px-5 py-2.5 rounded-xl border-0 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm cursor-pointer transition-colors"
          >
            Go to My Company Editor ({user.company.name}) →
          </button>
        </div>
      </div>
    );
  }

  if (loadError || !company) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 font-inter">
        <Head>
          <title>Editor Error</title>
        </Head>
        <div className="text-center max-w-[400px] p-6 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-5xl mb-4">⚠️</p>
          <h2 className="text-white text-xl font-bold font-outfit mb-2">Failed to Load Editor</h2>
          <p className="text-slate-400 text-sm mb-6">
            {loadError || 'Company not found'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-5 py-2.5 rounded-xl border-0 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm cursor-pointer transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-inter">
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
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        onOpenJobManager={() => router.push(slug ? `/${slug}/jobs` : '/jobs')}
        onSave={saveToBackend}
        onPublish={publishToBackend}
        onCopyPublicLink={() => showToast('📋 Copied public careers page link to clipboard!', 'info')}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSavedAt={lastSavedAt}
      />

      {/* Main Workspace: Left Sidebar | Center Canvas | Right Panel */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Mobile Backdrop for Left Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <EditorLeftSidebar
          company={company}
          sections={company.sections || []}
          selectedSectionId={selectedSectionId}
          onSelectSection={(secId) => {
            selectSection(secId);
            setIsMobileSidebarOpen(false);
          }}
          activeTab={activeLeftTab}
          onTabChange={setActiveLeftTab}
          updateCompany={updateCompany}
          onFocusBrandingArea={(area) => {
            setBrandingFocusArea(area);
            setIsMobileSidebarOpen(false);
          }}
          isMobileOpen={isMobileSidebarOpen}
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
          className={`fixed bottom-6 right-6 z-[200] px-4 py-3 bg-slate-900 text-white font-medium text-sm rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 animate-fade-in-up ${
            toast.type === 'error' ? 'border-rose-500/50 text-rose-300' : ''
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

