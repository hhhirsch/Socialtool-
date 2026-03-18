import { DEFAULT_PRESET_ID, PRESETS } from '../constants';
import type { Preset } from '../types';

export function getPresetById(id: string): Preset {
  return PRESETS.find((preset) => preset.id === id) ?? PRESETS.find((preset) => preset.id === DEFAULT_PRESET_ID)!;
}
