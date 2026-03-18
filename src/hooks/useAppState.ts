import { useState, useCallback, useEffect } from 'react';
import type { AppState, TabId, BackgroundMode, ZoomLevel, CssTemplate } from '../types';
import { loadState, saveState } from '../utils/storage';
import { DEFAULT_PRESET_ID, DEBOUNCE_MS } from '../constants';
import { useDebouncedEffect } from './useDebounce';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const persisted = loadState();
    return {
      ...persisted,
      previewScale: 1,
    };
  });
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Autosave with debounce
  useDebouncedEffect(
    () => {
      saveState({
        htmlContent: state.htmlContent,
        cssContent: state.cssContent,
        selectedPresetId: state.selectedPresetId,
        activeTemplateId: state.activeTemplateId,
        activeTab: state.activeTab,
        backgroundMode: state.backgroundMode,
        zoomLevel: state.zoomLevel,
        templates: state.templates,
      });
    },
    [
      state.htmlContent,
      state.cssContent,
      state.selectedPresetId,
      state.activeTemplateId,
      state.activeTab,
      state.backgroundMode,
      state.zoomLevel,
      state.templates,
    ],
    DEBOUNCE_MS
  );

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Auto-dismiss error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const showError = useCallback((msg: string) => setError(msg), []);
  const dismissError = useCallback(() => setError(null), []);

  const setHtmlContent = useCallback(
    (html: string) => setState((s) => ({ ...s, htmlContent: html })),
    []
  );

  const setCssContent = useCallback(
    (css: string) => setState((s) => ({ ...s, cssContent: css })),
    []
  );

  const setSelectedPresetId = useCallback(
    (id: string) => setState((s) => ({ ...s, selectedPresetId: id || DEFAULT_PRESET_ID })),
    []
  );

  const setActiveTab = useCallback(
    (tab: TabId) => setState((s) => ({ ...s, activeTab: tab })),
    []
  );

  const setBackgroundMode = useCallback(
    (mode: BackgroundMode) => setState((s) => ({ ...s, backgroundMode: mode })),
    []
  );

  const setZoomLevel = useCallback(
    (zoom: ZoomLevel) => setState((s) => ({ ...s, zoomLevel: zoom })),
    []
  );

  const setPreviewScale = useCallback(
    (scale: number) => setState((s) => ({ ...s, previewScale: scale })),
    []
  );

  // Template actions
  const saveTemplate = useCallback(
    (name: string, css: string) => {
      const trimmed = name.trim();
      if (!trimmed) {
        showError('Vorlagenname darf nicht leer sein.');
        return;
      }

      setState((s) => {
        const existing = s.templates.find((t) => t.name === trimmed);
        if (existing) {
          // Overwrite existing
          const updated = s.templates.map((t) =>
            t.id === existing.id ? { ...t, css, updatedAt: Date.now() } : t
          );
          return { ...s, templates: updated, activeTemplateId: existing.id };
        }
        const newTemplate: CssTemplate = {
          id: generateId(),
          name: trimmed,
          css,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return {
          ...s,
          templates: [...s.templates, newTemplate],
          activeTemplateId: newTemplate.id,
        };
      });
      showToast(`Vorlage "${trimmed}" gespeichert.`);
    },
    [showToast, showError]
  );

  const loadTemplate = useCallback(
    (id: string) => {
      setState((s) => {
        const template = s.templates.find((t) => t.id === id);
        if (!template) return s;
        return { ...s, cssContent: template.css, activeTemplateId: id };
      });
      showToast('Vorlage geladen.');
    },
    [showToast]
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      setState((s) => ({
        ...s,
        templates: s.templates.filter((t) => t.id !== id),
        activeTemplateId: s.activeTemplateId === id ? null : s.activeTemplateId,
      }));
      showToast('Vorlage gelöscht.');
    },
    [showToast]
  );

  const renameTemplate = useCallback(
    (id: string, newName: string) => {
      const trimmed = newName.trim();
      if (!trimmed) {
        showError('Vorlagenname darf nicht leer sein.');
        return;
      }
      setState((s) => ({
        ...s,
        templates: s.templates.map((t) =>
          t.id === id ? { ...t, name: trimmed, updatedAt: Date.now() } : t
        ),
      }));
      showToast('Vorlage umbenannt.');
    },
    [showToast, showError]
  );

  const duplicateTemplate = useCallback(
    (id: string) => {
      setState((s) => {
        const template = s.templates.find((t) => t.id === id);
        if (!template) return s;
        const newTemplate: CssTemplate = {
          id: generateId(),
          name: `${template.name} (Kopie)`,
          css: template.css,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return { ...s, templates: [...s.templates, newTemplate] };
      });
      showToast('Vorlage dupliziert.');
    },
    [showToast]
  );

  return {
    state,
    toast,
    error,
    showToast,
    showError,
    dismissError,
    setHtmlContent,
    setCssContent,
    setSelectedPresetId,
    setActiveTab,
    setBackgroundMode,
    setZoomLevel,
    setPreviewScale,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    renameTemplate,
    duplicateTemplate,
  };
}
