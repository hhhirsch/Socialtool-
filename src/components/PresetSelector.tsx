import { PRESETS } from '../constants';
import styles from './PresetSelector.module.css';

interface Props {
  selectedPresetId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function PresetSelector({ selectedPresetId, onSelect, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>LinkedIn Format wählen</div>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`${styles.option} ${selectedPresetId === preset.id ? styles.optionActive : ''}`}
            onClick={() => {
              onSelect(preset.id);
              onClose();
            }}
          >
            <span>{preset.label}</span>
            <span className={styles.dims}>
              {preset.width}×{preset.height}
            </span>
          </button>
        ))}
        <button className={styles.close} onClick={onClose}>
          Schließen
        </button>
      </div>
    </div>
  );
}
