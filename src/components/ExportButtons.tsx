import styles from './ExportButtons.module.css';

interface Props {
  onExportPng: () => void;
  onExportPdf: () => void;
  compact?: boolean;
}

export function ExportButtons({ onExportPng, onExportPdf, compact = false }: Props) {
  return (
    <div className={`${styles.group} ${compact ? styles.compact : ''}`}>
      <button type="button" className={styles.primary} onClick={onExportPng}>
        PNG exportieren
      </button>
      <button type="button" className={styles.secondary} onClick={onExportPdf}>
        PDF exportieren
      </button>
    </div>
  );
}
