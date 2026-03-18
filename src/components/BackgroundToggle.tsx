import type { BackgroundMode } from '../types';
import styles from './BackgroundToggle.module.css';

interface Props {
  value: BackgroundMode;
  onChange: (value: BackgroundMode) => void;
}

const options: Array<{ value: BackgroundMode; label: string }> = [
  { value: 'white', label: 'Weiß' },
  { value: 'gray', label: 'Grau' },
  { value: 'transparent', label: 'Transparent' },
];

export function BackgroundToggle({ value, onChange }: Props) {
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
