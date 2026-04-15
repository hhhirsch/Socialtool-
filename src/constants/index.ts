import type { Preset } from '../types';

export const PRESETS: Preset[] = [
  { id: '1200x644', label: '1200 × 644', width: 1200, height: 644 },
  { id: '600x322', label: '600 × 322', width: 600, height: 322 },
  { id: '1200x627', label: '1200 × 627', width: 1200, height: 627 },
  { id: '1080x1080', label: '1080 × 1080', width: 1080, height: 1080 },
  { id: '1080x1350', label: '1080 × 1350', width: 1080, height: 1350 },
  { id: '1080x1920', label: '1080 × 1920', width: 1080, height: 1920 },
  { id: '1584x396', label: '1584 × 396', width: 1584, height: 396 },
  { id: '1128x191', label: '1128 × 191', width: 1128, height: 191 },
];

export const DEFAULT_PRESET_ID = '1080x1350';
export const STORAGE_KEY = 'socialtool-state';
export const DEBOUNCE_MS = 400;
export const APP_NAME = 'LinkedIn Graphic Builder';
