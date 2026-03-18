import type { PersistedAppState } from '../types';
import { STORAGE_KEY, DEFAULT_PRESET_ID } from '../constants';

const defaultState: PersistedAppState = {
  htmlContent: '',
  cssContent: '',
  selectedPresetId: DEFAULT_PRESET_ID,
  activeTemplateId: null,
  activeTab: 'preview',
  backgroundMode: 'white',
  zoomLevel: 'fit',
  templates: [],
};

export function loadState(): PersistedAppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch {
    console.warn('Failed to load state from localStorage');
    return { ...defaultState };
  }
}

export function saveState(state: PersistedAppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}
