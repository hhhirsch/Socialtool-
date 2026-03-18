import type { ZoomLevel } from '../types';
import styles from './ZoomControls.module.css';

interface Props {
  value: ZoomLevel;
  onChange: (value: ZoomLevel) => void;
}

const options: Array<{ value: ZoomLevel; label: string }> = [
  { value: 'fit', label: 'Fit' },
  { value: '50', label: '50%' },
  { value: '75', label: '75%' },
  { value: '100', label: '100%' },
];

export function ZoomControls({ value, onChange }: Props) {
  return (
    <div className={styles.group}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.button} ${value === option.value ? styles.active : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
