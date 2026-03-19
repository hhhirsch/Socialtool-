import { useEffect, useState, useCallback } from 'react';
import { DEBOUNCE_MS } from '../constants';
import type { AppState, BackgroundMode, TabId, ZoomLevel } from '../types';
import { useDebouncedEffect } from './useDebounce';
import { loadState, saveState } from '../utils/storage';
import {
  getGroupFieldIndices,
  getGroupFieldKey,
  ensureCompatiblePresetId,
  getTemplateById,
  isTemplateFieldGroup,
  isValidTemplateId,
  mergeTemplateFieldValues,
  getTemplateDefaults,
  normalizeTemplateFieldValues,
} from '../utils/templateRegistry';

function createInitialState(): { state: AppState; message: string | null } {
  const { state: persistedState, error } = loadState();
  const resolvedTemplate = getTemplateById(persistedState.selectedTemplateId);
  const selectedTemplateId = isValidTemplateId(persistedState.selectedTemplateId)
    ? persistedState.selectedTemplateId
    : resolvedTemplate.id;
  const selectedPresetId = ensureCompatiblePresetId(resolvedTemplate, persistedState.selectedPresetId);
  const mismatchMessage =
    selectedPresetId !== persistedState.selectedPresetId
      ? 'Gespeichertes Format war mit der Vorlage nicht kompatibel und wurde angepasst.'
      : null;

  return {
    state: {
      selectedTemplateId,
      selectedPresetId,
      fieldValues: mergeTemplateFieldValues(resolvedTemplate, persistedState.fieldValues),
      activeTab: persistedState.activeTab,
      previewScale: persistedState.previewScale,
      backgroundMode: persistedState.backgroundMode,
      zoomLevel: persistedState.zoomLevel,
    },
    message: error ?? mismatchMessage,
  };
}

export function useAppState() {
  const [initialState] = useState(createInitialState);
  const [state, setState] = useState<AppState>(initialState.state);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialState.message);

  useDebouncedEffect(
    () => {
      const storageError = saveState({
        selectedTemplateId: state.selectedTemplateId,
        selectedPresetId: state.selectedPresetId,
        fieldValues: state.fieldValues,
        activeTab: state.activeTab,
        previewScale: state.previewScale,
        backgroundMode: state.backgroundMode,
        zoomLevel: state.zoomLevel,
      });

      if (storageError) {
        setError(storageError);
      }
    },
    [
      state.selectedTemplateId,
      state.selectedPresetId,
      state.fieldValues,
      state.activeTab,
      state.previewScale,
      state.backgroundMode,
      state.zoomLevel,
    ],
    DEBOUNCE_MS
  );

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!error) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setError(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [error]);

  const showToast = useCallback((message: string) => setToast(message), []);
  const showError = useCallback((message: string) => setError(message), []);
  const dismissError = useCallback(() => setError(null), []);

  const setActiveTab = useCallback((tab: TabId) => {
    setState((currentState) => ({ ...currentState, activeTab: tab }));
  }, []);

  const selectTemplate = useCallback((templateId: string) => {
    const template = getTemplateById(templateId);

    setState((currentState) => ({
      ...currentState,
      selectedTemplateId: template.id,
      selectedPresetId: ensureCompatiblePresetId(template, currentState.selectedPresetId),
      fieldValues: getTemplateDefaults(template),
    }));
  }, []);

  const selectPreset = useCallback(
    (presetId: string) => {
      const template = getTemplateById(state.selectedTemplateId);
      if (!template.supportedPresetIds.includes(presetId)) {
        showError('Dieses Format ist für die gewählte Vorlage nicht verfügbar.');
        return;
      }

      setState((currentState) => ({ ...currentState, selectedPresetId: presetId }));
    },
    [state.selectedTemplateId, showError]
  );

  const updateFieldValue = useCallback((fieldId: string, value: string) => {
    setState((currentState) => ({
      ...currentState,
      fieldValues: normalizeTemplateFieldValues(
        getTemplateById(currentState.selectedTemplateId),
        {
          ...currentState.fieldValues,
          [fieldId]: value,
        }
      ),
    }));
  }, []);

  const addFieldGroupItem = useCallback((groupId: string) => {
    setState((currentState) => {
      const template = getTemplateById(currentState.selectedTemplateId);
      const group = template.fields.find(
        (field): field is Extract<(typeof template.fields)[number], { type: 'group' }> =>
          isTemplateFieldGroup(field) && field.id === groupId
      );

      if (!group) {
        return currentState;
      }

      const indices = getGroupFieldIndices(group, currentState.fieldValues);
      if (group.maxItems && indices.length >= group.maxItems) {
        return currentState;
      }

      const nextIndex = (indices.at(-1) ?? -1) + 1;
      const nextValues = { ...currentState.fieldValues };

      for (const field of group.fields) {
        const key = getGroupFieldKey(group.id, nextIndex, field.id);
        nextValues[key] = template.defaults[key] ?? field.defaultValue ?? '';
      }

      return {
        ...currentState,
        fieldValues: normalizeTemplateFieldValues(template, nextValues),
      };
    });
  }, []);

  const removeFieldGroupItem = useCallback((groupId: string, indexToRemove: number) => {
    setState((currentState) => {
      const template = getTemplateById(currentState.selectedTemplateId);
      const group = template.fields.find(
        (field): field is Extract<(typeof template.fields)[number], { type: 'group' }> =>
          isTemplateFieldGroup(field) && field.id === groupId
      );

      if (!group) {
        return currentState;
      }

      const indices = getGroupFieldIndices(group, currentState.fieldValues);
      const minimumItems = group.minItems ?? 1;
      if (indices.length <= minimumItems) {
        return currentState;
      }

      const nextValues = Object.entries(currentState.fieldValues).reduce<Record<string, string>>(
        (accumulator, [key, value]) => {
          const match = key.match(new RegExp(`^${group.id}\\.(\\d+)\\.([^.]+)$`));

          if (!match) {
            accumulator[key] = value;
            return accumulator;
          }

          const currentIndex = Number(match[1]);
          const fieldId = match[2];

          if (!group.fields.some((field) => field.id === fieldId) || currentIndex < indexToRemove) {
            accumulator[key] = value;
            return accumulator;
          }

          if (currentIndex > indexToRemove) {
            accumulator[getGroupFieldKey(group.id, currentIndex - 1, fieldId)] = value;
          }

          return accumulator;
        },
        {}
      );

      return {
        ...currentState,
        fieldValues: normalizeTemplateFieldValues(template, nextValues),
      };
    });
  }, []);

  const resetFieldValues = useCallback(() => {
    const template = getTemplateById(state.selectedTemplateId);
    setState((currentState) => ({
      ...currentState,
      fieldValues: getTemplateDefaults(template),
    }));
    showToast('Standardwerte der Vorlage wurden wiederhergestellt.');
  }, [state.selectedTemplateId, showToast]);

  const loadExampleContent = useCallback(() => {
    const template = getTemplateById(state.selectedTemplateId);
    setState((currentState) => ({
      ...currentState,
      fieldValues: getTemplateDefaults(template),
      activeTab: 'content',
    }));
    showToast('Beispielinhalte geladen.');
  }, [state.selectedTemplateId, showToast]);

  const setBackgroundMode = useCallback((mode: BackgroundMode) => {
    setState((currentState) => ({ ...currentState, backgroundMode: mode }));
  }, []);

  const setZoomLevel = useCallback((zoomLevel: ZoomLevel) => {
    setState((currentState) => ({ ...currentState, zoomLevel }));
  }, []);

  const setPreviewScale = useCallback((previewScale: number) => {
    setState((currentState) => ({ ...currentState, previewScale }));
  }, []);

  return {
    state,
    toast,
    error,
    showToast,
    showError,
    dismissError,
    setActiveTab,
    selectTemplate,
    selectPreset,
    updateFieldValue,
    addFieldGroupItem,
    removeFieldGroupItem,
    resetFieldValues,
    loadExampleContent,
    setBackgroundMode,
    setZoomLevel,
    setPreviewScale,
  };
}
