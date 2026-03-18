import { PRESETS } from '../constants';
import type { Preset } from '../types';
import styles from './PresetSelector.module.css';

interface Props {
  selectedPresetId: string;
  supportedPresetIds: string[];
  onSelect: (presetId: string) => void;
}

function describePreset(preset: Preset): string {
  return `${preset.width} × ${preset.height} px`;
}

export function PresetSelector({ selectedPresetId, supportedPresetIds, onSelect }: Props) {
  return (
    <div className={styles.selector}>
      {PRESETS.map((preset) => {
        const isSelected = preset.id === selectedPresetId;
        const isSupported = supportedPresetIds.includes(preset.id);

        return (
          <button
            key={preset.id}
            type="button"
            className={`${styles.card} ${isSelected ? styles.cardActive : ''}`}
            onClick={() => isSupported && onSelect(preset.id)}
            disabled={!isSupported}
          >
            <span className={styles.label}>{preset.label}</span>
            <span className={styles.meta}>{describePreset(preset)}</span>
            {!isSupported && <span className={styles.hint}>Nicht mit dieser Vorlage kompatibel</span>}
          </button>
        );
      })}
    </div>
  );
}
