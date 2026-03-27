import { DEFAULT_PRESET_ID, STORAGE_KEY } from '../constants';
import { DEFAULT_TEMPLATE_ID } from '../templates';
import type {
  BackgroundMode,
  FieldValues,
  PersistedAppState,
  StorageLoadResult,
  TabId,
  TemplateCategory,
  ZoomLevel,
} from '../types';

const VALID_TABS: TabId[] = ['content', 'preview', 'templates', 'advanced'];
const VALID_BACKGROUNDS: BackgroundMode[] = ['white', 'gray', 'transparent'];
const VALID_ZOOMS: ZoomLevel[] = ['fit', '50', '75', '100'];
const VALID_TEMPLATE_CATEGORIES: TemplateCategory[] = ['business', 'podcast'];

const defaultState: PersistedAppState = {
  selectedCategory: 'business',
  selectedTemplateId: DEFAULT_TEMPLATE_ID,
  selectedPresetId: DEFAULT_PRESET_ID,
  fieldValues: {},
  activeTab: 'content',
  previewScale: 1,
  backgroundMode: 'gray',
  zoomLevel: 'fit',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeFieldValues(value: unknown): FieldValues {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<FieldValues>((accumulator, [key, entry]) => {
    if (typeof entry === 'string') {
      accumulator[key] = entry;
    } else if (typeof entry === 'number') {
      accumulator[key] = String(entry);
    }
    return accumulator;
  }, {});
}

export function loadState(): StorageLoadResult {
  if (typeof window === 'undefined') {
    return { state: { ...defaultState }, error: null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { state: { ...defaultState }, error: null };
    }

    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return {
        state: { ...defaultState },
        error: 'Gespeicherte Daten waren ungültig und wurden zurückgesetzt.',
      };
    }

    return {
      state: {
        selectedCategory: VALID_TEMPLATE_CATEGORIES.includes(parsed.selectedCategory as TemplateCategory)
          ? (parsed.selectedCategory as TemplateCategory)
          : defaultState.selectedCategory,
        selectedTemplateId:
          typeof parsed.selectedTemplateId === 'string'
            ? parsed.selectedTemplateId
            : defaultState.selectedTemplateId,
        selectedPresetId:
          typeof parsed.selectedPresetId === 'string'
            ? parsed.selectedPresetId
            : defaultState.selectedPresetId,
        fieldValues: sanitizeFieldValues(parsed.fieldValues),
        activeTab: VALID_TABS.includes(parsed.activeTab as TabId)
          ? (parsed.activeTab as TabId)
          : defaultState.activeTab,
        previewScale:
          typeof parsed.previewScale === 'number' && Number.isFinite(parsed.previewScale)
            ? parsed.previewScale
            : defaultState.previewScale,
        backgroundMode: VALID_BACKGROUNDS.includes(parsed.backgroundMode as BackgroundMode)
          ? (parsed.backgroundMode as BackgroundMode)
          : defaultState.backgroundMode,
        zoomLevel: VALID_ZOOMS.includes(parsed.zoomLevel as ZoomLevel)
          ? (parsed.zoomLevel as ZoomLevel)
          : defaultState.zoomLevel,
      },
      error: null,
    };
  } catch {
    return {
      state: { ...defaultState },
      error: 'Lokaler Speicher konnte nicht gelesen werden. Die App startet mit Standardwerten.',
    };
  }
}

export function saveState(state: PersistedAppState): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return null;
  } catch {
    return 'Lokaler Speicher ist nicht verfügbar. Änderungen werden nur temporär gehalten.';
  }
}
