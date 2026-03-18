import type { Preset } from '../types';

export const PRESETS: Preset[] = [
  { id: '1200x627', label: '1200 × 627', width: 1200, height: 627 },
  { id: '1080x1080', label: '1080 × 1080', width: 1080, height: 1080 },
  { id: '1080x1350', label: '1080 × 1350', width: 1080, height: 1350 },
  { id: '1584x396', label: '1584 × 396', width: 1584, height: 396 },
  { id: '1128x191', label: '1128 × 191', width: 1128, height: 191 },
];

export const DEFAULT_PRESET_ID = PRESETS[2].id; // 1080x1350

export const STORAGE_KEY = 'socialtool-state';

export const DEBOUNCE_MS = 500;

export const SAMPLE_HTML = `<div style="
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: linear-gradient(135deg, #0077B5 0%, #00A0DC 100%);
  color: white;
  padding: 60px;
  box-sizing: border-box;
">
  <h1 style="font-size: 64px; margin: 0 0 20px 0; text-align: center;">
    LinkedIn Grafik
  </h1>
  <p style="font-size: 28px; margin: 0; opacity: 0.9; text-align: center;">
    Erstellt mit dem Social Tool
  </p>
</div>`;
