import { useState, useCallback, useEffect, useRef } from 'react';

const API_BASE = 'http://127.0.0.1:5000/api';

export function useEditorState(slug, token) {
  // Company data
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Editor UI state
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('sections'); // 'sections' | 'design' | 'branding'
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [mobileWidth, setMobileWidth] = useState('390px'); // '320px' | '375px' | '390px' | '414px'

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Toast
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error'|'info' }
  const toastTimerRef = useRef(null);

  // Undo/Redo history
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistory = 50;
  const isUndoRedoRef = useRef(false);

  // Show toast helper
  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  // Load company data
  const loadCompany = useCallback(async (companySlug) => {
    if (!companySlug) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`${API_BASE}/companies/${companySlug}`);
      const data = await res.json();
      if (data.success) {
        const normalized = {
          ...data.data,
          fontFamily: data.data.fontFamily || 'Outfit',
          borderRadius: data.data.borderRadius || '16px',
          socialLinks: data.data.socialLinks || {},
          sections: (data.data.sections || []).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)),
        };
        setCompany(normalized);
        setHistory([JSON.parse(JSON.stringify(normalized))]);
        setHistoryIndex(0);
        setHasUnsavedChanges(false);
      } else {
        setLoadError(data.error || 'Failed to load company');
      }

      const jobsRes = await fetch(`${API_BASE}/companies/${companySlug}/jobs`);
      const jobsData = await jobsRes.json();
      if (jobsData.success) setJobs(jobsData.data || []);
    } catch (err) {
      setLoadError('Failed to connect to backend. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Push state to history (for undo/redo)
  const pushHistory = useCallback((newCompany) => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newCompany)));
      if (newHistory.length > maxHistory) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, maxHistory - 1));
    setHasUnsavedChanges(true);
  }, [historyIndex]);

  // Update company helper that tracks history
  const updateCompany = useCallback((updater) => {
    setCompany((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    isUndoRedoRef.current = true;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setCompany(JSON.parse(JSON.stringify(history[newIndex])));
    setHasUnsavedChanges(true);
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    isUndoRedoRef.current = true;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setCompany(JSON.parse(JSON.stringify(history[newIndex])));
    setHasUnsavedChanges(true);
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Save to backend
  const saveToBackend = useCallback(async () => {
    if (!company || !slug || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/companies/${slug}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: company.name,
          primaryColor: company.primaryColor,
          accentColor: company.accentColor,
          backgroundColor: company.backgroundColor,
          textColor: company.textColor,
          fontFamily: company.fontFamily,
          borderRadius: company.borderRadius,
          description: company.description,
          website: company.website,
          videoUrl: company.videoUrl,
          bannerUrl: company.bannerUrl,
          logoUrl: company.logoUrl,
          socialLinks: company.socialLinks,
          sections: company.sections,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHasUnsavedChanges(false);
        setLastSavedAt(new Date());
        showToast('Changes saved successfully', 'success');
      } else {
        setSaveError(data.error);
        showToast('Failed to save: ' + data.error, 'error');
      }
    } catch (err) {
      setSaveError('Network error');
      showToast('Failed to save. Check your connection.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [company, slug, isSaving, showToast]);

  // Publish draft to live candidate site
  const publishToBackend = useCallback(async () => {
    if (!company || !slug || isSaving) return;
    setIsSaving(true);
    try {
      await saveToBackend();

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/companies/${slug}/publish`, {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      if (data.success) {
        showToast('🚀 Published live to candidate site!', 'success');
      } else {
        showToast('Publish failed: ' + data.error, 'error');
      }
    } catch (err) {
      showToast('Network error while publishing', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [company, slug, isSaving, saveToBackend, showToast]);

  // Select section
  const selectSection = useCallback((sectionId) => {
    setSelectedSectionId(sectionId);
  }, []);

  // Get selected section
  const selectedSection = company?.sections?.find((s) => s._id === selectedSectionId) || null;
  const selectedSectionIndex = company?.sections?.findIndex((s) => s._id === selectedSectionId) ?? -1;

  // Load on slug change
  useEffect(() => {
    if (slug) loadCompany(slug);
  }, [slug, loadCompany]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveToBackend();
      }
      if (e.key === 'Escape') {
        setSelectedSectionId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveToBackend]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return {
    company,
    jobs,
    isLoading,
    loadError,
    selectedSectionId,
    selectedSection,
    selectedSectionIndex,
    selectSection,
    activeLeftTab,
    setActiveLeftTab,
    viewportMode,
    setViewportMode,
    mobileWidth,
    setMobileWidth,
    updateCompany,
    setCompany,
    saveToBackend,
    publishToBackend,
    isSaving,
    hasUnsavedChanges,
    lastSavedAt,
    saveError,
    undo,
    redo,
    canUndo,
    canRedo,
    toast,
    showToast,
    loadCompany,
  };
}
