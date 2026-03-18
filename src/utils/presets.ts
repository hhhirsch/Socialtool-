import { PRESETS, DEFAULT_PRESET_ID } from '../constants';
import type { Preset } from '../types';

export function getPresetById(id: string): Preset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS.find((p) => p.id === DEFAULT_PRESET_ID)!;
}
